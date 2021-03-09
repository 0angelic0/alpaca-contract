pragma solidity 0.6.6;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

import "../../apis/uniswap/IUniswapV2Router02.sol";
import "../../interfaces/IStrategy.sol";
import "../../../utils/SafeToken.sol";
import "../../../utils/AlpacaMath.sol";

contract StrategyAddBaseTokenOnly is ReentrancyGuardUpgradeSafe, IStrategy {
  using SafeToken for address;
  using SafeMath for uint256;

  IUniswapV2Factory public factory;
  IUniswapV2Router02 public router;

  /// @dev Create a new add Token only strategy instance.
  /// @param _router The Uniswap router smart contract.
  function initialize(IUniswapV2Router02 _router) public initializer {
    ReentrancyGuardUpgradeSafe.__ReentrancyGuard_init();

    factory = IUniswapV2Factory(_router.factory());
    router = _router;
  }

  /// @dev Execute worker strategy. Take LP tokens + BaseToken. Return LP tokens + BaseToken.
  /// @param data Extra calldata information passed along to this strategy.
  function execute(address /* user */, uint256 /* debt */, bytes calldata data)
    external
    override
    payable
    nonReentrant
  {
    // 1. Find out what farming token we are dealing with and min additional LP tokens.
    (
      address baseToken,
      address quoteToken,
      uint256 minLPAmount
    ) = abi.decode(data, (address, address, uint256));
    IUniswapV2Pair lpToken = IUniswapV2Pair(factory.getPair(quoteToken, baseToken));
    IERC20(baseToken).approve(address(router), uint256(-1)); // trust router 100%
    // 2. Compute the optimal amount of baseToken to be converted to quoteToken.
    uint256 balance = IERC20(baseToken).balanceOf(address(this));
    (uint256 r0, uint256 r1, ) = lpToken.getReserves();
    uint256 rIn = lpToken.token0() == baseToken ? r0 : r1;
    uint256 aIn = AlpacaMath.sqrt(rIn.mul(balance.mul(3988000).add(rIn.mul(3988009)))).sub(rIn.mul(1997)) / 1994;
    // 3. Convert that portion of baseToken to quoteToken.
    address[] memory path = new address[](2);
    path[0] = baseToken;
    path[1] = quoteToken;
    router.swapExactTokensForTokens(aIn, 0, path, address(this), now);
    // 4. Mint more LP tokens and return all LP tokens to the sender.
    quoteToken.safeApprove(address(router), 0);
    quoteToken.safeApprove(address(router), quoteToken.myBalance());
    (,, uint256 moreLPAmount) = router.addLiquidity(
      baseToken, quoteToken, IERC20(baseToken).balanceOf(address(this)), quoteToken.myBalance(), 0, 0, address(this), now
    );
    require(moreLPAmount >= minLPAmount, "insufficient LP tokens received");
    lpToken.transfer(msg.sender, lpToken.balanceOf(address(this)));
  }
}
