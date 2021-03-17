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

  const VAULT_CONFIG = '0x950e8137B8c0d403DCBeAb41AF1160a56862ba5a';
  const MIN_DEBT_SIZE = ethers.utils.parseEther('400');
  const RESERVE_POOL_BPS = '1000';
  const KILL_PRIZE_BPS = '500';
  const INTEREST_MODEL = '0xEE9A636C8dB153B301553a87b2B90aEAA17Da287';
  const WBNB = '0x0421b6CE68C71708CD18652aF5123fc2573DBCCC';
  const WNATIVE_RELAYER = '0x01EBAC2f65eC3cE064EDcf05f9fAd9B8D9a419Ee';
  const FAIRLAUNCH = '0x31402C656f48F09284755d7B97Ffd40Ea372D531';

  const TIMELOCK = '0x771F70042ebb6d2Cfc29b7BF9f3caf9F959385B8';
  const EXACT_ETA = '1615952700';











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