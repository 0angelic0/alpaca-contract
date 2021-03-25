import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers, upgrades } from 'hardhat';
import { StrategyAddBaseTokenOnly__factory, StrategyLiquidate__factory, StrategyWithdrawMinimizeTrading__factory, Timelock__factory } from '../typechain';

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

  const ROUTER = '0xf46A02489B99C5A4a5cC31AA3F9eBD6A501D4B49';










  console.log(">> Deploying an upgradable StrategyWithdrawMinimize contract");
  const StrategyWithdrawMinimizeTrading = (await ethers.getContractFactory(
    "StrategyWithdrawMinimizeTrading",
    (await ethers.getSigners())[0],
  )) as StrategyWithdrawMinimizeTrading__factory;
  const strategyWithdrawMinimizeTrading = await upgrades.deployProxy(StrategyWithdrawMinimizeTrading, [ROUTER]);
  await strategyWithdrawMinimizeTrading.deployed()
  console.log(`>> Deployed at ${strategyWithdrawMinimizeTrading.address}`);
};

export default func;
func.tags = ['StrategyWithdrawMinimizeTrading'];