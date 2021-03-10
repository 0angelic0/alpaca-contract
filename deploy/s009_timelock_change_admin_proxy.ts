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

  const PROXY_ADDRESSES = [
    // '0xFb0645d38e35DA4C4Aa0079366B7d9905f162fCe',
    '0xAB5AD8e7248C9b28e114723E8A43FbB0bFa98483',
    '0x0901fcc2814348Fa4DFc866376f7A952c1963D9A',
    '0x6883D1297721F4584077fe7471c396538DC5dcbC',
    '0x950e8137B8c0d403DCBeAb41AF1160a56862ba5a',
    '0x947fFd3352136aC34eC67895E4fd392de18157DF'
  ];
  // PROXY_ADMIN
  // Testnet: 0x2c6c09b46d00A88161B7e4AcFaFEc58990548aC2
  // Mainnet: 0x5379F32C8D5F663EACb61eeF63F722950294f452
  const PROXY_ADMIN = '0x2c6c09b46d00A88161B7e4AcFaFEc58990548aC2';

  const TIMELOCK = '0x771F70042ebb6d2Cfc29b7BF9f3caf9F959385B8';
  const EXACT_ETA = '1615366200';











  const timelock = Timelock__factory.connect(TIMELOCK, (await ethers.getSigners())[0]);
  console.log(">> Queuing transaction to change admin to Master ProxyAdmin Contract");
  for(let i = 0; i < PROXY_ADDRESSES.length; i++ ) {
    console.log(`>> Changing admin of ${PROXY_ADDRESSES[i]} to ProxyAdmin`);
    await timelock.queueTransaction(
      PROXY_ADDRESSES[i], '0',
      'changeAdmin(address)',
      ethers.utils.defaultAbiCoder.encode(['address'], [PROXY_ADMIN]), EXACT_ETA)
    console.log("✅ Done")
    console.log("timelock execution");
    console.log(`await timelock.executeTransaction('${PROXY_ADDRESSES[i]}', '0', 'changeAdmin(address)', ethers.utils.defaultAbiCoder.encode(['address'],['${PROXY_ADMIN}']), ${EXACT_ETA})`);
  }
};

export default func;
func.tags = ['TimelockChangeAdminProxy'];