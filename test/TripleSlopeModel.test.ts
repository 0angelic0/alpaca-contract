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
    TestHelpers.assertAlmostEqual(interestPerYear.toString(), ethers.utils.parseEther('6').toString())
  });

  it('should return 10 APY when utilization 50%', async () => {
    const interestPerSec = await tripleSlopeModel.getInterestRate('50','50')
    const interestPerYear = interestPerSec.mul(60).mul(60).mul(24).mul(365)
    TestHelpers.assertAlmostEqual(interestPerYear.toString(), ethers.utils.parseEther('10').toString())
  });

  it('should returns 10% APY when utlization 89%', async () => {
    const interestPerSec = await tripleSlopeModel.getInterestRate('89','11')
    const interestPerYear = interestPerSec.mul(60).mul(60).mul(24).mul(365)
    TestHelpers.assertAlmostEqual(interestPerYear.toString(), ethers.utils.parseEther('10').toString())
  });

  it('should returns ~35% APY when utlization 95%', async () => {
    const interestPerSec = await tripleSlopeModel.getInterestRate('95','5')
    const interestPerYear = interestPerSec.mul(60).mul(60).mul(24).mul(365)
    TestHelpers.assertAlmostEqual(interestPerYear.toString(), ethers.utils.parseEther('35').toString())
  });
});