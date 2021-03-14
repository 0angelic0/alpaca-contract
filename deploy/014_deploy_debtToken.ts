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
  const VAULT = '';
  const SYMBOL = 'IbBUSD';
  const TIMELOCK = '';
  const FAIR_LAUNCH = '';
  const ALLOC_POINT = '';
  const EXACT_ETA = '';






  const timelock = Timelock__factory.connect(TIMELOCK, (await ethers.getSigners())[0]);

  console.log(`>> Deploying debt${SYMBOL}`)
  const DebtToken = (await ethers.getContractFactory(
    "DebtToken",
    (await ethers.getSigners())[0]
  )) as DebtToken__factory;
  const debtToken = await upgrades.deployProxy(DebtToken, [
    `debt${SYMBOL}`, `debt${SYMBOL}`, TIMELOCK]) as DebtToken;
  await debtToken.deployed();
  console.log(`>> Deployed at ${debtToken.address}`);

  console.log(">> Transferring ownership of debtToken to Vault");
  await debtToken.transferOwnership(VAULT);
  console.log("✅ Done");

  console.log(">> Queue Transaction to add pool through Timelock");
  await timelock.queueTransaction(FAIR_LAUNCH, '0', 'addPool(uint256,address,bool)', ethers.utils.defaultAbiCoder.encode(['uint256','address','bool'], [ALLOC_POINT, debtToken.address, false]), EXACT_ETA);
  console.log("✅ Done");

  console.log(">> Generate timelock executeTransaction")
  console.log(`timelock.executeTransaction('${FAIR_LAUNCH}', '0', 'addPool(uint256,address,bool)', ethers.utils.defaultAbiCoder.encode(['uint256','address','bool'], [${ALLOC_POINT}, '${debtToken.address}', false]), ${EXACT_ETA})`);
  console.log("✅ Done")
}

export default func;
func.tags = ['DebtTokenV2'];