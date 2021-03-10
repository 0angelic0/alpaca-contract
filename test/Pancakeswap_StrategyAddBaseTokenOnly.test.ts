import { ethers, upgrades, waffle } from "hardhat";
import { Signer, BigNumberish, utils, Wallet } from "ethers";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import "@openzeppelin/test-helpers";
import {
  MockERC20,
  MockERC20__factory,
  StrategyAddBaseTokenOnly,
  StrategyAddBaseTokenOnly__factory,
  UniswapV2Factory,
  UniswapV2Factory__factory,
  UniswapV2Pair,
  UniswapV2Pair__factory,
  UniswapV2Router02,
  UniswapV2Router02__factory,
  WETH,
  WETH__factory
} from "../typechain";

chai.use(solidity);
const { expect } = chai;

describe('Pancakeswap - StrategyAddBaseTokenOnly', () => {
  const FOREVER = '2000000000';

  /// Uniswap-related instance(s)
  let factory: UniswapV2Factory;
  let router: UniswapV2Router02;
  let lp: UniswapV2Pair;

  /// Token-related instance(s)
  let weth: WETH;
  let baseToken: MockERC20;
  let quoteToken: MockERC20;

  /// Strategy-ralted instance(s)
  let strat: StrategyAddBaseTokenOnly;

  // Accounts
  let deployer: Signer;
  let alice: Signer;
  let bob: Signer;

  // Contract Signer
  let baseTokenAsAlice: MockERC20;
  let baseTokenAsBob: MockERC20;

  let lpAsAlice: UniswapV2Pair;
  let lpAsBob: UniswapV2Pair;

  let quoteTokenAsAlice: MockERC20;
  let quoteTokenAsBob: MockERC20;

  let routerAsAlice: UniswapV2Router02;
  let routerAsBob: UniswapV2Router02;

  let stratAsAlice: StrategyAddBaseTokenOnly;
  let stratAsBob: StrategyAddBaseTokenOnly;

  beforeEach(async () => {
    [deployer, alice, bob] = await ethers.getSigners();

    // Setup Uniswap
    const UniswapV2Factory = (await ethers.getContractFactory(
      "UniswapV2Factory",
      deployer
    )) as UniswapV2Factory__factory;
    factory = await UniswapV2Factory.deploy((await deployer.getAddress()));
    await factory.deployed();

    const WETH = (await ethers.getContractFactory(
      "WETH",
      deployer
    )) as WETH__factory;
    weth = await WETH.deploy();
    await factory.deployed();

    const UniswapV2Router02 = (await ethers.getContractFactory(
      "UniswapV2Router02",
      deployer
    )) as UniswapV2Router02__factory;
    router = await UniswapV2Router02.deploy(factory.address, weth.address);
    await router.deployed();

    /// Setup token stuffs
    const MockERC20 = (await ethers.getContractFactory(
      "MockERC20",
      deployer
    )) as MockERC20__factory
    baseToken = await upgrades.deployProxy(MockERC20, ['BTOKEN', 'BTOKEN']) as MockERC20;
    await baseToken.deployed();
    await baseToken.mint(await alice.getAddress(), ethers.utils.parseEther('100'));
    await baseToken.mint(await bob.getAddress(), ethers.utils.parseEther('100'));
    quoteToken = await upgrades.deployProxy(MockERC20, ['FTOKEN', 'FTOKEN']) as MockERC20;
    await quoteToken.deployed();
    await quoteToken.mint(await alice.getAddress(), ethers.utils.parseEther('10'));
    await quoteToken.mint(await bob.getAddress(), ethers.utils.parseEther('10'));

    await factory.createPair(baseToken.address, quoteToken.address);

    lp = await UniswapV2Pair__factory.connect(await factory.getPair(quoteToken.address, baseToken.address), deployer);

    const StrategyAddBaseTokenOnly = (await ethers.getContractFactory(
      "StrategyAddBaseTokenOnly",
      deployer
    )) as StrategyAddBaseTokenOnly__factory;
    strat = await upgrades.deployProxy(StrategyAddBaseTokenOnly, [router.address]) as StrategyAddBaseTokenOnly;
    await strat.deployed();

    // Assign contract signer
    baseTokenAsAlice = MockERC20__factory.connect(baseToken.address, alice);
    baseTokenAsBob = MockERC20__factory.connect(baseToken.address, bob);

    quoteTokenAsAlice = MockERC20__factory.connect(quoteToken.address, alice);
    quoteTokenAsBob = MockERC20__factory.connect(quoteToken.address, bob);

    routerAsAlice = UniswapV2Router02__factory.connect(router.address, alice);
    routerAsBob = UniswapV2Router02__factory.connect(router.address, bob);

    lpAsAlice = UniswapV2Pair__factory.connect(lp.address, alice);
    lpAsBob = UniswapV2Pair__factory.connect(lp.address, bob);

    stratAsAlice = StrategyAddBaseTokenOnly__factory.connect(strat.address, alice);
    stratAsBob = StrategyAddBaseTokenOnly__factory.connect(strat.address, bob);
  });

  it('should revert on bad calldata', async () => {
    // Bob passes some bad calldata that can't be decoded
    await expect(
      stratAsBob.execute(await bob.getAddress(), '0', '0x1234')
    ).to.be.reverted;
  });

  it('should convert all BTOKEN to LP tokens at best rate', async () => {
    // Alice adds 0.1 FTOKEN + 1 WBTC
    await quoteTokenAsAlice.approve(router.address, ethers.utils.parseEther('0.1'));
    await baseTokenAsAlice.approve(router.address, ethers.utils.parseEther('1'));

    // Add liquidity to the WBTC-FTOKEN pool on Uniswap
    await routerAsAlice.addLiquidity(
      baseToken.address, quoteToken.address,
      ethers.utils.parseEther('1'), ethers.utils.parseEther('0.1'), '0', '0', await alice.getAddress(), FOREVER);

    // Bob transfer 0.1 WBTC to StrategyAddBaseTokenOnly first
    await baseTokenAsBob.transfer(strat.address, ethers.utils.parseEther('0.1'));
    // Bob uses AddBaseTokenOnly strategy to add 0.1 WBTC
    await stratAsBob.execute(
      await bob.getAddress(), '0',
      ethers.utils.defaultAbiCoder.encode(
        ['address','address', 'uint256'], [baseToken.address, quoteToken.address, '0']
      )
    );

    expect(await lp.balanceOf(await bob.getAddress())).to.be.bignumber.eq(ethers.utils.parseEther('0.015403813051483008'))
    expect(await lp.balanceOf(strat.address)).to.be.bignumber.eq(ethers.utils.parseEther('0'))
    expect(await quoteToken.balanceOf(strat.address)).to.be.bignumber.eq(ethers.utils.parseEther('0'))

    // Bob uses AddBaseTokenOnly strategy to add another 0.1 WBTC
    await baseTokenAsBob.transfer(strat.address, ethers.utils.parseEther('0.1'));
    await lpAsBob.transfer(strat.address, ethers.utils.parseEther('0.015403813051483008'));
    await stratAsBob.execute(
      await bob.getAddress(), '0',
      ethers.utils.defaultAbiCoder.encode(
        ['address', 'address', 'uint256'], [baseToken.address, quoteToken.address, ethers.utils.parseEther('0.01')]
      )
    );

    expect(await lp.balanceOf(await bob.getAddress())).to.be.bignumber.eq(ethers.utils.parseEther('0.030128652046542732'))
    expect(await lp.balanceOf(strat.address)).to.be.bignumber.eq(ethers.utils.parseEther('0'))
    expect(await quoteToken.balanceOf(strat.address)).to.be.bignumber.eq(ethers.utils.parseEther('0'))

    // Bob uses AddBaseTokenOnly strategy yet again, but now with an unreasonable min LP request
    await baseTokenAsBob.transfer(strat.address, ethers.utils.parseEther('0.1'))
    await expect(
      stratAsBob.execute(
        await bob.getAddress(), '0',
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'address', 'uint256'],
          [baseToken.address, quoteToken.address, ethers.utils.parseEther('0.05')]
        ),
      )
    ).to.be.revertedWith('insufficient LP tokens received');
  });
});
