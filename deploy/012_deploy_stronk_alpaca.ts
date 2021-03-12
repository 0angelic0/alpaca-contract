import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';
import { StronkAlpaca__factory } from '../typechain';

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

  const ALPACA_TOKEN_ADDR = '0xd84605b66bD0Cec5693c727b8208e25504326fb1';
  const HODLABLE_START_BLOCK = '7000001'; // hodl can be called after this block
  const HODLABLE_END_BLOCK = '7019000'; // hodl can be called until this block
  const LOCK_END_BLOCK = '7022000'; // unhodl can be called after this block
  /**
   * HODLABLE_START_BLOCK = Thu Mar 11 2021 17:50:20 UTC
   * HODLABLE_END_BLOCK = Fri Mar 12 2021 09:40:41 UTC
   * LOCK_END_BLOCK = Fri Mar 12 2021 12:10:32 UTC
   */











  console.log(">> Deploying a StronkAlpaca contract");
  const StronkAlpaca = (await ethers.getContractFactory(   "StronkAlpaca",    (await ethers.getSigners())[0],  )) as StronkAlpaca__factory;
  const stronkAlpaca = await StronkAlpaca.deploy(
    ALPACA_TOKEN_ADDR,
    ethers.BigNumber.from(HODLABLE_START_BLOCK),
    ethers.BigNumber.from(HODLABLE_END_BLOCK),
    ethers.BigNumber.from(LOCK_END_BLOCK),
  );
  await stronkAlpaca.deployed();
  console.log(`>> Deployed at ${stronkAlpaca.address}`);
  console.log("✅ Done");

};

export default func;
func.tags = ['StronkAlpaca'];