import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers, upgrades } from 'hardhat';
import {
  PancakeswapWorker,
  PancakeswapWorker__factory,
  Timelock__factory,
} from '../typechain';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    /*
  ░██╗░░░░░░░██╗░█████╗░██████╗░███╗░░██╗██╗███╗░░██╗░██████╗░
  ░██║░░██╗░░██║██╔══██╗██╔══██╗████╗░██║██║████╗░██║██╔════╝░
  ░╚██╗████╗██╔╝███████║██████╔╝██╔██╗██║██║██╔██╗██║██║░░██╗░
  ░░████╔═████║░██╔══██║██╔══██╗██║╚████║██║██║╚████║██║░░╚██╗
  ░░╚██╔╝░╚██╔╝░██║░░██║██║░░██║██║░╚███║██║██║░╚███║╚██████╔╝
  ░░░╚═╝░░░╚═╝░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝╚═╝░░╚══╝░╚═════╝░
  Check all variables below before execute the deployment script
  */

  const VAULT_CONFIG_ADDR = '0x950e8137B8c0d403DCBeAb41AF1160a56862ba5a';
  const WORKER_CONFIG_ADDR = '0xAB5AD8e7248C9b28e114723E8A43FbB0bFa98483';

  const REINVEST_BOT = '';
  
  const WORKER_NAME = "WBNB-BUSD PancakeswapWorker"
  const POOL_ID = 5;
  const VAULT_ADDR = '0x947fFd3352136aC34eC67895E4fd392de18157DF'
  const BASE_TOKEN_ADDR = '0x1f1F4D015A3CE748b838f058930dea311F3b69AE'
  const MASTER_CHEF_ADDR = '0x3d9248518Cd0B9e3e0427052AAeb8ef9e330B3B1'
  const PANCAKESWAP_ROUTER_ADDR = '0xEAF62f7bEaC130A36b3770EFd597f7678D7182F3';
  const ADD_STRAT_ADDR = '0x3Eb784B917804D42d84cE1693A0471Da722c6e50';
  const LIQ_STRAT_ADDR = '0xC949fc7A2ecF161BAAeA16190D9676E48B902896';
  const REINVEST_BOUNTY_BPS = '300';
  const WORK_FACTOR = '6000';
  const KILL_FACTOR = '8000';
  const MAX_PRICE_DIFF = '13000';
  
  const TIMELOCK = '0x771F70042ebb6d2Cfc29b7BF9f3caf9F959385B8';
  const EXACT_ETA = '1615368600';









  console.log(`>> Deploying an upgradable PancakeswapWorker contract for ${WORKER_NAME}`);
  const PancakeswapWorker = (await ethers.getContractFactory(
    'PancakeswapWorker',
    (await ethers.getSigners())[0]
  )) as PancakeswapWorker__factory;
  const pancakeswapWorker = await upgrades.deployProxy(
    PancakeswapWorker,[
      VAULT_ADDR, BASE_TOKEN_ADDR, MASTER_CHEF_ADDR,
      PANCAKESWAP_ROUTER_ADDR, POOL_ID, ADD_STRAT_ADDR,
      LIQ_STRAT_ADDR, REINVEST_BOUNTY_BPS
    ],
  ) as PancakeswapWorker;
  await pancakeswapWorker.deployed();
  console.log(`>> Deployed at ${pancakeswapWorker.address}`);

  console.log(`>> Adding REINVEST_BOT`);
  await pancakeswapWorker.setReinvestorOk([REINVEST_BOT], true);
  console.log("✅ Done");

  const timelock = Timelock__factory.connect(TIMELOCK, (await ethers.getSigners())[0]);

  console.log(">> Timelock: Setting WorkerConfig via Timelock");
  await timelock.queueTransaction(
    WORKER_CONFIG_ADDR, '0',
    'setConfigs(address[],(bool,uint64,uint64,uint64)[])',
    ethers.utils.defaultAbiCoder.encode(
      ['address[]','(bool acceptDebt,uint64 workFactor,uint64 killFactor,uint64 maxPriceDiff)[]'],
      [
        [pancakeswapWorker.address], [{acceptDebt: true, workFactor: WORK_FACTOR, killFactor: KILL_FACTOR, maxPriceDiff: MAX_PRICE_DIFF}]
      ]
    ), EXACT_ETA
  );
  console.log("generate timelock.executeTransaction:")
  console.log(`await timelock.executeTransaction('${WORKER_CONFIG_ADDR}', '0', 'setConfigs(address[],(bool,uint64,uint64,uint64)[])', ethers.utils.defaultAbiCoder.encode(['address[]','(bool acceptDebt,uint64 workFactor,uint64 killFactor,uint64 maxPriceDiff)[]'],[['${pancakeswapWorker.address}'], [{acceptDebt: true, workFactor: ${WORK_FACTOR}, killFactor: ${KILL_FACTOR}, maxPriceDiff: ${MAX_PRICE_DIFF}}]]), ${EXACT_ETA})`)
  console.log("✅ Done");

  console.log(">> Timelock: Linking VaultConfig with WorkerConfig via Timelock");
  await timelock.queueTransaction(
    VAULT_CONFIG_ADDR, '0',
    'setWorkers(address[],address[])',
    ethers.utils.defaultAbiCoder.encode(
      ['address[]','address[]'],
      [
        [pancakeswapWorker.address], [WORKER_CONFIG_ADDR]
      ]
    ), EXACT_ETA
  );
  console.log("generate timelock.executeTransaction:")
  console.log(`await timelock.executeTransaction('${VAULT_CONFIG_ADDR}', '0','setWorkers(address[],address[])', ethers.utils.defaultAbiCoder.encode(['address[]','address[]'],[['${pancakeswapWorker.address}'], ['${WORKER_CONFIG_ADDR}']]), ${EXACT_ETA})`)
  console.log("✅ Done");
};

export default func;
func.tags = ['PancakeswapWorker'];