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
  const VAULT = '0x947fFd3352136aC34eC67895E4fd392de18157DF';
  const SYMBOL = 'IbBUSD';
  const TIMELOCK = '0x771F70042ebb6d2Cfc29b7BF9f3caf9F959385B8';
  const FAIR_LAUNCH = '0x31402C656f48F09284755d7B97Ffd40Ea372D531';
  const ALLOC_POINT = '100';
  const EXACT_ETA = '1615776300';






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
  console.log(`await timelock.executeTransaction('${FAIR_LAUNCH}', '0', 'addPool(uint256,address,bool)', ethers.utils.defaultAbiCoder.encode(['uint256','address','bool'], [${ALLOC_POINT}, '${debtToken.address}', false]), ${EXACT_ETA})`);
  console.log("✅ Done")
}

export default func;
func.tags = ['DebtTokenV2'];