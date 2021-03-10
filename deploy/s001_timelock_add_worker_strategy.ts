import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';
import { IWorker__factory, IStrategy__factory, Timelock__factory } from '../typechain'

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

  const WORKER_ADDR = '0x336ce685b3DD5c47E52Af3ee407B9d134A2fdea5';
  const STRATEGY_ADDR = '0x4194bFDFA67A8a04d0EB3Dc802716fE744C46282';
  const IS_ENABLE = true;

  const TIMELOCK = '0x771F70042ebb6d2Cfc29b7BF9f3caf9F959385B8';
  const EXACT_ETA = '';











  const worker = IWorker__factory.connect(
    WORKER_ADDR, (await ethers.getSigners())[0]);
  const strategy = IStrategy__factory.connect(
    STRATEGY_ADDR, (await ethers.getSigners())[0]);
  const timelock = Timelock__factory.connect(TIMELOCK, (await ethers.getSigners())[0]);

  console.log(">> Timlock: Setting Strategy for a Worker");
  await timelock.queueTransaction(
    WORKER_ADDR, '0',
    'setStrategyOk(address[],bool)',
    ethers.utils.defaultAbiCoder.encode(
      ['address[]','bool'],
      [
        [STRATEGY_ADDR], IS_ENABLE
      ]
    ), EXACT_ETA
  );
  console.log("generate timelock.executeTransaction:")
  console.log(`await timelock.executeTransaction('${WORKER_ADDR}', '0', 'setStrategyOk(address[],bool)', ethers.utils.defaultAbiCoder.encode(['address[]','bool'],[['${STRATEGY_ADDR}'], ${IS_ENABLE}]), ${EXACT_ETA})`);
  console.log("✅ Done");
};

export default func;
func.tags = ['TimelockAddWorkerStrategy'];