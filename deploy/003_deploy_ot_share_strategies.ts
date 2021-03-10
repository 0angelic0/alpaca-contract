import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers, upgrades } from 'hardhat';
import { StrategyAddBaseTokenOnly__factory, StrategyLiquidate__factory, Timelock__factory } from '../typechain';

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

  const ROUTER = '0xEAF62f7bEaC130A36b3770EFd597f7678D7182F3';
  const TIMELOCK = '0x771F70042ebb6d2Cfc29b7BF9f3caf9F959385B8';











  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();
  const timelock = Timelock__factory.connect(TIMELOCK, (await ethers.getSigners())[0]);

  console.log(">> Deploying an upgradable StrategyAddBaseTokenOnly contract");
  const StrategyAddBaseTokenOnly = (await ethers.getContractFactory(
    "StrategyAddBaseTokenOnly",
    (await ethers.getSigners())[0],
  )) as StrategyAddBaseTokenOnly__factory;
  const strategyAddBaseTokenOnly = await upgrades.deployProxy(StrategyAddBaseTokenOnly, [ROUTER]);
  await strategyAddBaseTokenOnly.deployed()
  console.log(`>> Deployed at ${strategyAddBaseTokenOnly.address}`);

  console.log(">> Deploying an upgradble StrategyLiquidate contract");
  const StrategyLiquidate = (await ethers.getContractFactory(
    "StrategyLiquidate",
    (await ethers.getSigners())[0],
  )) as StrategyLiquidate__factory;
  const strategyLiquidate = await upgrades.deployProxy(StrategyLiquidate, [ROUTER]);
  await strategyLiquidate.deployed();
  console.log(`>> Deployed at ${strategyLiquidate.address}`);
};

export default func;
func.tags = ['ShareStrategies'];