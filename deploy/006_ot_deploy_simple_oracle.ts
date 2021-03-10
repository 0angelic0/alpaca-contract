import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers, upgrades } from 'hardhat';
import { SimplePriceOracle__factory } from '../typechain';

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
  const FEEDER_ADDR = '0xc1594110aF71D31c7F64F1EeD1f540307964873c';
  const TIMELOCK = '0x771F70042ebb6d2Cfc29b7BF9f3caf9F959385B8';
















  console.log(">> Deploying an upgradable SimplePriceOracle contract");
  const SimplePriceOracle = (await ethers.getContractFactory(
    'SimplePriceOracle',
    (await ethers.getSigners())[0]
  )) as SimplePriceOracle__factory;
  const simplePriceOracle = await upgrades.deployProxy(
    SimplePriceOracle,[FEEDER_ADDR]
  );
  await simplePriceOracle.deployed();
  console.log(`>> Deployed at ${simplePriceOracle.address}`);

};

export default func;
func.tags = ['SimpleOracle'];