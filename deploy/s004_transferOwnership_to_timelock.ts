import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import {  Ownable, Ownable__factory } from '../typechain'
import { ethers, upgrades } from 'hardhat';

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

  const TIMELOCK_ADDRESS = '0xb3c3aE82358DF7fC0bd98629D5ed91767e45c337';
  const TO_BE_LOCKED = [
    '0x2c12663339Fdce1A3088C0245FC2499255ccF7eC',
    '0xf20E73385397284f37c47963E2515156fCf33360',
    '0xA950ee51Ac3b27a1a6C87D6448D6717ACBc7b0A8',
    '0xDf605784D78D42b5507Be14D6533a835E2692A16',
    '0x00d078c7e058bA5106878b9e0CC09Ef1BF510925'
  ];











  for(let i = 0; i < TO_BE_LOCKED.length; i++ ) {
    console.log(`>> Transferring ownership of ${TO_BE_LOCKED[i]} to TIMELOCK`);
    const ownable = Ownable__factory.connect(TO_BE_LOCKED[i], (await ethers.getSigners())[0]);
    await ownable.transferOwnership(TIMELOCK_ADDRESS);
    console.log("✅ Done")
  }
};

export default func;
func.tags = ['TransferOwnershipToTimeLock'];