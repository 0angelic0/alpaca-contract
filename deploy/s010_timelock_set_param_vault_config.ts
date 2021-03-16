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

  const VAULT_CONFIG = '';
  const MIN_DEBT_SIZE = '';
  const RESERVE_POOL_BPS = '';
  const KILL_PRIZE_BPS = '';
  const INTEREST_MODEL = '';
  const WBNB = '';
  const WNATIVE_RELAYER = '';
  const FAIRLAUNCH = '';

  const TIMELOCK = '0x2D5408f2287BF9F9B05404794459a846651D0a59';
  const EXACT_ETA = '1615789200';











  const timelock = Timelock__factory.connect(TIMELOCK, (await ethers.getSigners())[0]);
  console.log(">> Queuing transaction to update Vault config");
  // function setParams(
  //   uint256 _minDebtSize,
  //   uint256 _reservePoolBps,
  //   uint256 _killBps,
  //   InterestModel _interestModel,
  //   address _wrappedNative,
  //   address _wNativeRelayer,
  //   address _fairLaunch
  // )
  await timelock.queueTransaction(
    VAULT_CONFIG, '0',
    'setParams(uint256,uint256,uint256,address,address,address,address)',
    ethers.utils.defaultAbiCoder.encode(
      ['uint256','uint256','uint256','address','address','address','address'],
      [MIN_DEBT_SIZE, RESERVE_POOL_BPS, KILL_PRIZE_BPS, INTEREST_MODEL, WBNB, WNATIVE_RELAYER, FAIRLAUNCH]), EXACT_ETA)
  console.log("✅ Done")
  console.log("timelock execution:");
  console.log(`await timelock.executeTransaction('${VAULT_CONFIG}', '0', 'setParams(uint256,uint256,uint256,address,address,address,address)', ethers.utils.defaultAbiCoder.encode(['uint256','uint256','uint256','address','address','address','address'],['${MIN_DEBT_SIZE}', '${RESERVE_POOL_BPS}', '${KILL_PRIZE_BPS}', '${INTEREST_MODEL}', '${WBNB}', '${WNATIVE_RELAYER}', '${FAIRLAUNCH}']), ${EXACT_ETA})`);
};

export default func;
func.tags = ['TimelockSetParamsVaultConfig'];