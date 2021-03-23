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

<<<<<<< HEAD
  const VAULT_CONFIG_ADDR = '0x53dbb71303ad0F9AFa184B8f7147F9f12Bb5Dc01';
  const WORKER_CONFIG_ADDR = '0xADaBC5FC5da42c85A84e66096460C769a151A8F8';

  const REINVEST_BOT = '0xe45216Ac4816A5Ec5378B1D13dE8aA9F262ce9De';

  const WORKER_NAME = "CAKE-WBNB Worker"
  const POOL_ID = 1;
  const VAULT_ADDR = '0xd7D069493685A581d27824Fc46EdA46B7EfC0063'
  const BASE_TOKEN_ADDR = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
  const MASTER_CHEF_ADDR = '0x73feaa1eE314F8c655E354234017bE2193C9E24E'
  const PANCAKESWAP_ROUTER_ADDR = '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F';
  const ADD_STRAT_ADDR = '0x1DBa79e73a7Ea9749fc28B921bc9431D09BEf2B5';
  const LIQ_STRAT_ADDR = '0xc7c025aA69F4b525E3F9f5186b524492ee1C86bB';
  const REINVEST_BOUNTY_BPS = '300';
  const WORK_FACTOR = '6250';
  const KILL_FACTOR = '8000';
  const MAX_PRICE_DIFF = '11000';

  const TIMELOCK = '0x2D5408f2287BF9F9B05404794459a846651D0a59';
  const EXACT_ETA = '1616565600';
=======
  const VAULT_CONFIG_ADDR = '0xbC6d2dfe97A557Bd793d07ebB0df3ea80cc990Fc';
  const WORKER_CONFIG_ADDR = '0x8ae5e14864090E9332Ceb238F7cEa183d7C056a7';
  
  const REINVEST_BOT = '0xcf28b4da7d3ed29986831876b74af6e95211d3f9';
  
  const WORKER_NAME = "WBNB-BUSD Worker"
  const POOL_ID = 4;
  const VAULT_ADDR = '0xe5ed8148fE4915cE857FC648b9BdEF8Bb9491Fa5'
  const BASE_TOKEN_ADDR = '0x0266693F9Df932aD7dA8a9b44C2129Ce8a87E81f'
  const MASTER_CHEF_ADDR = '0xbCC50b0B0AFD19Ee83a6E79e6c01D51b16090A0B'
  const PANCAKESWAP_ROUTER_ADDR = '0xf46A02489B99C5A4a5cC31AA3F9eBD6A501D4B49';
  const ADD_STRAT_ADDR = '0x5D0c3a0C79fCe9c177D7140e975681447C747D05';
  const LIQ_STRAT_ADDR = '0x3be48dD0b9AA62560AAF0bff2115cc8617A4BD70';
  const REINVEST_BOUNTY_BPS = '300';
  const WORK_FACTOR = '7000';
  const KILL_FACTOR = '8333';
  const MAX_PRICE_DIFF = '11000';
  
  const TIMELOCK = '0xb3c3aE82358DF7fC0bd98629D5ed91767e45c337';
  const EXACT_ETA = '1616434200';
>>>>>>> master









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
    ]
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