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

  const ALPACA_TOKEN_ADDR = '0x19C64173a4fD5C2Db375f68444B2aA3070e0de08';
  const HODLABLE_START_BLOCK = '5311496'
  const HODLABLE_END_BLOCK = '5411496'; // hodl can be called until this block
  const LOCK_END_BLOCK = '5511496'; // unhodl can be called after this block












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