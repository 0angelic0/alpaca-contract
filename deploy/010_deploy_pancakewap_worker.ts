import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers, upgrades } from 'hardhat';
import {
  ConfigurableInterestVaultConfig__factory,
  PancakeswapWorker__factory,
  Timelock__factory,
  WorkerConfig__factory
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

  const VAULT_CONFIG_ADDR = '0x1b9a864a510Cd86B0Ab2dF8C44B5a80633fA459D';
  const WORKER_CONFIG_ADDR = '0x4b5C242E8B9f8420Fb62829c6177BC6c07f9E017';

  const WORKER_NAME = "USDT-BUSD PancakeswapWorker"
  const POOL_ID = 4;
  const VAULT_ADDR = '0x65CcD1eE5f96C10B7Ee997eE2538E69fa4902b94'
  const BASE_TOKEN_ADDR = '0x1f1F4D015A3CE748b838f058930dea311F3b69AE'
  const MASTER_CHEF_ADDR = '0x3d9248518Cd0B9e3e0427052AAeb8ef9e330B3B1'
  const PANCAKESWAP_ROUTER_ADDR = '0xEAF62f7bEaC130A36b3770EFd597f7678D7182F3';
  const ADD_STRAT_ADDR = '0x3a7c75044984a1BE715CD5379c5843dDB81aB95d';
  const LIQ_STRAT_ADDR = '0x216a483aDf50C4Af87C9d1ccdcb10d99Cc3a3741';
  const REINVEST_BOUNTY_BPS = '300';
  const WORK_FACTOR = '6667';
  const KILL_FACTOR = '8750';
  const MAX_PRICE_DIFF = '13000';

  const TIMELOCK = '0x771F70042ebb6d2Cfc29b7BF9f3caf9F959385B8';
  const EXACT_ETA = '';






  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

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
  );
  await pancakeswapWorker.deployed();
  console.log(`>> Deployed at ${pancakeswapWorker.address}`);

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
  console.log(`await timelock.executeTransaction('${WORKER_CONFIG_ADDR}', '0', 'setConfigs(address[],(bool,uint64,uint64,uint64)[])', ethers.utils.defaultAbiCoder.encode(['address[]','(bool acceptDebt,uint64 workFactor,uint64 killFactor,uint64 maxPriceDiff)[]'],[[${pancakeswapWorker.address}], [{acceptDebt: true, workFactor: ${WORK_FACTOR}, killFactor: ${KILL_FACTOR}, maxPriceDiff: ${MAX_PRICE_DIFF}}]]), ${EXACT_ETA})`)
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
  console.log(`await timelock.executeTransaction('${VAULT_CONFIG_ADDR}', '0','setWorkers(address[],address[])', ethers.utils.defaultAbiCoder.encode(['address[]','address[]'],[[${pancakeswapWorker.address}], [${WORKER_CONFIG_ADDR}]]), ${EXACT_ETA})`)
  console.log("✅ Done");
};

export default func;
func.tags = ['PancakeswapWorker'];