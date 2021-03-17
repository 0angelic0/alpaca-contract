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

  const VAULT_CONFIG = '0xd7b805E88c5F52EDE71a9b93F7048c8d632DBEd4';
  const MIN_DEBT_SIZE = ethers.utils.parseEther('400');
  const RESERVE_POOL_BPS = '1000';
  const KILL_PRIZE_BPS = '500';
  const INTEREST_MODEL = '0xb17e305AF95E6a4345Ff743Bc394a0929cc31725';
  const WBNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
  const WNATIVE_RELAYER = '0xE1D2CA01bc88F325fF7266DD2165944f3CAf0D3D';
  const FAIRLAUNCH = '0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F';

  const TIMELOCK = '0x2D5408f2287BF9F9B05404794459a846651D0a59';
  const EXACT_ETA = '1616050800';











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