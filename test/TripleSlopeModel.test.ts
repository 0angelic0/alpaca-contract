import { ethers, upgrades, waffle } from "hardhat";
import { Signer, BigNumberish, utils, Wallet } from "ethers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import "@openzeppelin/test-helpers";
import {
  TripleSlopeModel,
  TripleSlopeModel__factory
} from '../typechain'
import * as TestHelpers from "./helpers/assert";

describe("TripleSlopeModel", () => {
  let tripleSlopeModel: TripleSlopeModel

  let deployer: Signer;

  beforeEach(async () => {
    [deployer] = await ethers.getSigners();

    const TripleSlopeModel = (await ethers.getContractFactory('TripleSlopeModel', deployer)) as TripleSlopeModel__factory
    tripleSlopeModel = await TripleSlopeModel.deploy()
  });

  it('should returns ~6% APY when utilization 30%', async () => {
    const interestPerSec = await tripleSlopeModel.getInterestRate('30','70')
    const interestPerYear = interestPerSec.mul(60).mul(60).mul(24).mul(365)
    TestHelpers.assertAlmostEqual(interestPerYear.toString(), ethers.utils.parseEther('0.06').toString())
  });

  it('should return ~10% APY when utilization 50%', async () => {
    const interestPerSec = await tripleSlopeModel.getInterestRate('50','50')
    const interestPerYear = interestPerSec.mul(60).mul(60).mul(24).mul(365)
    TestHelpers.assertAlmostEqual(interestPerYear.toString(), ethers.utils.parseEther('0.10').toString())
  });

  it('should returns ~10% APY when utilization 89%', async () => {
    const interestPerSec = await tripleSlopeModel.getInterestRate('89','11')
    const interestPerYear = interestPerSec.mul(60).mul(60).mul(24).mul(365)
    TestHelpers.assertAlmostEqual(interestPerYear.toString(), ethers.utils.parseEther('0.10').toString())
  });

  it('should returns ~85% APY when utilization 95%', async () => {
    const interestPerSec = await tripleSlopeModel.getInterestRate('95','5')
    const interestPerYear = interestPerSec.mul(60).mul(60).mul(24).mul(365)
    TestHelpers.assertAlmostEqual(interestPerYear.toString(), ethers.utils.parseEther('0.80').toString())
  });

  it('should returns ~113% APY when utilization 97.5%', async () => {
    const interestPerSec = await tripleSlopeModel.getInterestRate('975','25')
    const interestPerYear = interestPerSec.mul(60).mul(60).mul(24).mul(365)
    TestHelpers.assertAlmostEqual(interestPerYear.toString(), ethers.utils.parseEther('1.15').toString())
  });

  it('should returns ~150% APY when utilization 99%', async () => {
    const interestPerSec = await tripleSlopeModel.getInterestRate('99','1')
    const interestPerYear = interestPerSec.mul(60).mul(60).mul(24).mul(365)
    TestHelpers.assertAlmostEqual(interestPerYear.toString(), ethers.utils.parseEther('1.36').toString())
  });

  it('should returns ~150% APY when utilization 100%', async () => {
    const interestPerSec = await tripleSlopeModel.getInterestRate('100','0')
    const interestPerYear = interestPerSec.mul(60).mul(60).mul(24).mul(365)
    TestHelpers.assertAlmostEqual(interestPerYear.toString(), ethers.utils.parseEther('1.50').toString())
  });
});