import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers, upgrades } from 'hardhat';
import { StrategyAddTwoSidesOptimal__factory } from '../typechain';

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

  const VAULT_ADDR = '0xe5ed8148fE4915cE857FC648b9BdEF8Bb9491Fa5';
  const ROUTER = '0xf46A02489B99C5A4a5cC31AA3F9eBD6A501D4B49';









  console.log(">> Deploying an upgradable StrategyAddTwoSidesOptimal contract");
  const StrategyAddTwoSidesOptimal = (await ethers.getContractFactory(
    'StrategyAddTwoSidesOptimal',
    (await ethers.getSigners())[0]
  )) as StrategyAddTwoSidesOptimal__factory;
  const strategyAddTwoSidesOptimal = await upgrades.deployProxy(
    StrategyAddTwoSidesOptimal,[ROUTER, VAULT_ADDR]
  );
  await strategyAddTwoSidesOptimal.deployed();
  console.log(`>> Deployed at ${strategyAddTwoSidesOptimal.address}`);
};

export default func;
func.tags = ['VaultStrategies'];