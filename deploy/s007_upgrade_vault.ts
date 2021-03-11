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
  // PROXY_ADMIN
  // Testnet: 0x2c6c09b46d00A88161B7e4AcFaFEc58990548aC2
  // Mainnet: 0x5379F32C8D5F663EACb61eeF63F722950294f452
  const PROXY_ADMIN = '0x2c6c09b46d00A88161B7e4AcFaFEc58990548aC2';
  const NEW_IMPL = '0x4e176A68d503B8Ad0756a838eA7888A02c543651';
  const TO_BE_UPGRADE_VAULT = '0x947fFd3352136aC34eC67895E4fd392de18157DF';

  const TIMELOCK = '0x771F70042ebb6d2Cfc29b7BF9f3caf9F959385B8';
  const EXACT_ETA = '1615442700';









  const timelock = Timelock__factory.connect(TIMELOCK, (await ethers.getSigners())[0]);

  let newImpl = NEW_IMPL;
  console.log(`>> Upgrading Vault at ${TO_BE_UPGRADE_VAULT} through Timelock + ProxyAdmin`);
  if (newImpl === '') {
    console.log('>> NEW_IMPL is not set. Deploy a new IMPL automatically.');
    const NewVault = (await ethers.getContractFactory(
      'Vault',
      (await ethers.getSigners())[0]
    )) as Vault__factory;
    const newVault = await NewVault.deploy();
    await newVault.deployed();
    newImpl = newVault.address;
    console.log(`>> New implementation deployed at: ${newVault.address}`);
    console.log("✅ Done");
  }

  console.log(`>> Queue tx on Timelock to upgrade the implementation`);
  await timelock.queueTransaction(PROXY_ADMIN, '0', 'upgrade(address,address)', ethers.utils.defaultAbiCoder.encode(['address','address'], [TO_BE_UPGRADE_VAULT, newImpl]), EXACT_ETA);
  console.log("✅ Done");

  console.log(`>> Generate executeTransaction:`);
  console.log(`await timelock.executeTransaction('${PROXY_ADMIN}', '0', 'upgrade(address,address)', ethers.utils.defaultAbiCoder.encode(['address','address'], ['${TO_BE_UPGRADE_VAULT}','${newImpl}']), ${EXACT_ETA})`);
  console.log("✅ Done");
};

export default func;
func.tags = ['UpgradeVault'];