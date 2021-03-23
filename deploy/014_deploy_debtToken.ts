import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { DebtToken, DebtToken__factory, Timelock__factory, } from '../typechain';
import { ethers, upgrades } from 'hardhat';
import { time } from 'node:console';

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
  const VAULT = '0xe5ed8148fE4915cE857FC648b9BdEF8Bb9491Fa5';
  const SYMBOL = 'IbBUSD';
  const TIMELOCK = '0xb3c3aE82358DF7fC0bd98629D5ed91767e45c337';
  const FAIR_LAUNCH = '0xac2fefDaF83285EA016BE3f5f1fb039eb800F43D';
  const ALLOC_POINT = '0';
  const EXACT_ETA = '1616434200';






  const timelock = Timelock__factory.connect(TIMELOCK, (await ethers.getSigners())[0]);

  console.log(`>> Deploying debt${SYMBOL}`)
  const DebtToken = (await ethers.getContractFactory(
    "DebtToken",
    (await ethers.getSigners())[0]
  )) as DebtToken__factory;
  const debtToken = await upgrades.deployProxy(DebtToken, [
    `debt${SYMBOL}_V2`, `debt${SYMBOL}_V2`, TIMELOCK]) as DebtToken;
  await debtToken.deployed();
  console.log(`>> Deployed at ${debtToken.address}`);

  console.log(">> Transferring ownership of debtToken to Vault");
  await debtToken.transferOwnership(VAULT);
  console.log("✅ Done");

  console.log(">> Queue Transaction to add pool through Timelock");
  await timelock.queueTransaction(FAIR_LAUNCH, '0', 'addPool(uint256,address,bool)', ethers.utils.defaultAbiCoder.encode(['uint256','address','bool'], [ALLOC_POINT, debtToken.address, true]), EXACT_ETA);
  console.log("✅ Done");

  console.log(">> Generate timelock executeTransaction")
  console.log(`await timelock.executeTransaction('${FAIR_LAUNCH}', '0', 'addPool(uint256,address,bool)', ethers.utils.defaultAbiCoder.encode(['uint256','address','bool'], [${ALLOC_POINT}, '${debtToken.address}', true]), ${EXACT_ETA})`);
  console.log("✅ Done")
}

export default func;
func.tags = ['DebtTokenV2'];