import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { DebtToken__factory, FairLaunch, FairLaunch__factory, Vault, Vault__factory, WNativeRelayer, WNativeRelayer__factory } from '../typechain';
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

  const FAIR_LAUNCH_ADDR = '0xac2fefDaF83285EA016BE3f5f1fb039eb800F43D';
  const ALLOC_POINT_FOR_DEPOSIT = 200;
  const ALLOC_POINT_FOR_OPEN_POSITION = 0;
  const CONFIG_ADDR = '0xbC6d2dfe97A557Bd793d07ebB0df3ea80cc990Fc';
  const BASE_TOKEN_ADDR = '0x0266693F9Df932aD7dA8a9b44C2129Ce8a87E81f'
  const VAULT_NAME = 'BUSD VAULT'
  const NAME = 'Interest Bearing BUSD'
  const SYMBOL = 'ibBUSD';
  const WNATIVE_RELAYER_ADDR = '0x7e2284c8CC74F13FA6c218c4231b0786E6204728';
  const TIMELOCK = '0xb3c3aE82358DF7fC0bd98629D5ed91767e45c337';






  console.log(`>> Deploying debt${SYMBOL}`)
  const DebtToken = (await ethers.getContractFactory(
    "DebtToken",
    (await ethers.getSigners())[0]
  )) as DebtToken__factory;
  const debtToken = await upgrades.deployProxy(DebtToken, [
    `debt${SYMBOL}_V2`, `debt${SYMBOL}_V2`, TIMELOCK]);
  await debtToken.deployed();
  console.log(`>> Deployed at ${debtToken.address}`);

  console.log(`>> Deploying an upgradable Vault contract for ${VAULT_NAME}`);
  const Vault = (await ethers.getContractFactory(
    'Vault',
    (await ethers.getSigners())[0]
  )) as Vault__factory;
  const vault = await upgrades.deployProxy(
    Vault,[CONFIG_ADDR, BASE_TOKEN_ADDR, NAME, SYMBOL, 18, debtToken.address]
  ) as Vault;
  await vault.deployed();
  console.log(`>> Deployed at ${vault.address}`);

  console.log(">> Transferring ownership of debtToken to Vault");
  await debtToken.transferOwnership(vault.address);
  console.log("✅ Done");

  const fairLaunch = FairLaunch__factory.connect(
    FAIR_LAUNCH_ADDR, (await ethers.getSigners())[0]) as FairLaunch;

  console.log(">> create a debtToken pool on fair launch contract");
  await fairLaunch.addPool(ALLOC_POINT_FOR_OPEN_POSITION, (await vault.debtToken()), false, { gasLimit: '2000000' });
  console.log("✅ Done");

  console.log(">> Sleep for 10000msec waiting for fairLaunch to update the pool");
  await new Promise(resolve => setTimeout(resolve, 10000));
  console.log("✅ Done");

  console.log(">> link pool with vault");
  await vault.setFairLaunchPoolId((await fairLaunch.poolLength()).sub(1), { gasLimit: '2000000' });
  console.log("✅ Done");

  console.log(">> create an ibToken pool on fair launch contract");
  await fairLaunch.addPool(ALLOC_POINT_FOR_DEPOSIT, vault.address, false, { gasLimit: '2000000' });
  console.log("✅ Done");

  const wNativeRelayer = WNativeRelayer__factory.connect(
    WNATIVE_RELAYER_ADDR, (await ethers.getSigners())[0]
  ) as WNativeRelayer;

  console.log(">> Whitelisting Vault on WNativeRelayer Contract");
  await wNativeRelayer.setCallerOk([vault.address], true);
  console.log("✅ Done");

};

export default func;
func.tags = ['Vault'];