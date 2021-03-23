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
  const NEW_IMPL = '0x91B1b5C90D7D21e2E74a8f98adBc9f50bcf50Db5';
  const TO_BE_UPGRADE_VAULT = '0xe5ed8148fE4915cE857FC648b9BdEF8Bb9491Fa5';

  const TIMELOCK = '0xb3c3aE82358DF7fC0bd98629D5ed91767e45c337';
  const EXACT_ETA = '1616434200';

  const NEW_DEBT_TOKEN = '0x49974bc28f1920A603aa8dffB3C61b4CD5B26710';
  const DEBT_PID = '7';









  const timelock = Timelock__factory.connect(TIMELOCK, (await ethers.getSigners())[0]);

  let newImpl = NEW_IMPL;
  console.log(`>> Upgrading Vault at ${TO_BE_UPGRADE_VAULT} through Timelock + ProxyAdmin`);
  if (newImpl === '') {
    console.log('>> NEW_IMPL is not set. Prepare upgrade a new IMPL automatically.');
    const NewVaultFactory = (await ethers.getContractFactory('Vault')) as Vault__factory;
    const preparedNewVault = await upgrades.prepareUpgrade(TO_BE_UPGRADE_VAULT, NewVaultFactory)
    newImpl = preparedNewVault;
    console.log(`>> New implementation deployed at: ${preparedNewVault}`);
    console.log("✅ Done");
  }

  console.log(`>> Queue tx on Timelock to upgrade the implementation`);
  await timelock.queueTransaction(PROXY_ADMIN, '0', 'upgrade(address,address)', ethers.utils.defaultAbiCoder.encode(['address','address'], [TO_BE_UPGRADE_VAULT, newImpl]), EXACT_ETA);
  console.log("✅ Done");

  console.log(`>> Generate executeTransaction:`);
  console.log(`await timelock.executeTransaction('${PROXY_ADMIN}', '0', 'upgrade(address,address)', ethers.utils.defaultAbiCoder.encode(['address','address'], ['${TO_BE_UPGRADE_VAULT}','${newImpl}']), ${EXACT_ETA})`);
  console.log("✅ Done");

  let newDebtToken = NEW_DEBT_TOKEN
  if (newDebtToken !== '') {
    console.log(`>> Queue tx on Timelock to updateDebtToken on the Vault`);
    await timelock.queueTransaction(TO_BE_UPGRADE_VAULT, '0', 'updateDebtToken(address,uint256)', ethers.utils.defaultAbiCoder.encode(['address','uint256'], [NEW_DEBT_TOKEN, DEBT_PID]), EXACT_ETA);
    console.log("✅ Done");

    console.log(`>> Generate executeTransaction:`);
    console.log(`await timelock.executeTransaction('${TO_BE_UPGRADE_VAULT}', '0', 'updateDebtToken(address,uint256)', ethers.utils.defaultAbiCoder.encode(['address','uint256'], ['${NEW_DEBT_TOKEN}', ${DEBT_PID}]), ${EXACT_ETA})`);
    console.log("✅ Done");
  }
};

export default func;
func.tags = ['UpgradeVault'];