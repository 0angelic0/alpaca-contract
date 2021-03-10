import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers, upgrades } from 'hardhat';
import { Timelock__factory, Vault, Vault__factory } from '../typechain'

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
  const NEW_IMPL = "";
  const TO_BE_UPGRADE_VAULT = '0x6883D1297721F4584077fe7471c396538DC5dcbC';

  const TIMELOCK = '0x771F70042ebb6d2Cfc29b7BF9f3caf9F959385B8';
  const EXACT_ETA = '1615349100';









  const timelock = Timelock__factory.connect(TIMELOCK, (await ethers.getSigners())[0]);

  let newImpl = NEW_IMPL;
  console.log(`>> Upgrading Vault at ${TO_BE_UPGRADE_VAULT} through Timelock`);
  if (newImpl === '') {
    console.log('>> NEW_IMPL is not set. Deploy a new IMPL automatically.')
    const NewVault = (await ethers.getContractFactory(
      'Vault',
      (await ethers.getSigners())[0]
    )) as Vault__factory;
    const newVault = await NewVault.deploy();
    await newVault.deployed();
    newImpl = newVault.address;
    console.log("✅ Done");
  }

  console.log(`>> Queue tx on Timelock to change implementation`);
  await timelock.queueTransaction(TO_BE_UPGRADE_VAULT, '0', 'upgradeTo(address)', ethers.utils.defaultAbiCoder.encode(['address'], [newImpl]), EXACT_ETA);
  console.log("✅ Done");

  console.log(`>> Generate executeTransaction:`);
  console.log(`await timelock.executeTransaction('${TO_BE_UPGRADE_VAULT}', '0', 'upgradeTo(address)', ethers.utils.defaultAbiCoder.encode(['address'], ['${newImpl}']), ${EXACT_ETA})`);
  console.log("✅ Done");
};

export default func;
func.tags = ['UpgradeVault'];