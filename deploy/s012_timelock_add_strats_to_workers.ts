import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';
import { Timelock__factory } from '../typechain'

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

  const STRATEGY = '0x9c79F9eac99Af00A75599625895f5619Da9d19e0'
  const WORKERS = [
    '0x2c12663339Fdce1A3088C0245FC2499255ccF7eC',
    '0xf20E73385397284f37c47963E2515156fCf33360',
    '0xA950ee51Ac3b27a1a6C87D6448D6717ACBc7b0A8'
  ];

  const TIMELOCK = '0xb3c3aE82358DF7fC0bd98629D5ed91767e45c337';
  const EXACT_ETA = '1616496480';











  const timelock = Timelock__factory.connect(TIMELOCK, (await ethers.getSigners())[0]);

  for(let i = 0; i < WORKERS.length; i++) {
    console.log(">> Timelock: Setting okStrats via Timelock");
    await timelock.queueTransaction(
      WORKERS[i], '0',
      'setStrategyOk(address[],bool)',
      ethers.utils.defaultAbiCoder.encode(
        ['address[]','bool'],
        [
          [STRATEGY], true
        ]
      ), EXACT_ETA
    );
    console.log("generate timelock.executeTransaction:")
    console.log(`await timelock.executeTransaction('${WORKERS[i]}', '0', 'setStrategyOk(address[],bool)', ethers.utils.defaultAbiCoder.encode(['address[]','bool'],[['${STRATEGY}'], true]), ${EXACT_ETA})`)
    console.log("✅ Done");
  }
};

export default func;
func.tags = ['TimelockUpdateAddStratWorkers'];