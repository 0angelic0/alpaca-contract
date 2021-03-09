pragma solidity 0.6.6;

import "@openzeppelin/contracts-ethereum-package/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/SafeERC20.sol";

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

import "../../apis/uniswap/IUniswapV2Router02.sol";
import "../../interfaces/IStrategy.sol";
import "../../../utils/SafeToken.sol";

contract StrategyLiquidate is ReentrancyGuardUpgradeSafe, IStrategy {
  using SafeToken for address;

  IUniswapV2Factory public factory;
  IUniswapV2Router02 public router;

  /// @dev Create a new liquidate strategy instance.
  /// @param _router The Uniswap router smart contract.
  function initialize(IUniswapV2Router02 _router) public initializer {
    ReentrancyGuardUpgradeSafe.__ReentrancyGuard_init();

    factory = IUniswapV2Factory(_router.factory());
    router = _router;
  }

  /// @dev Execute worker strategy. Take LP token. Return  BaseToken.
  /// @param data Extra calldata information passed along to this strategy.
  function execute(address /* user */, uint256 /* debt */, bytes calldata data)
    external
    override
    payable
    nonReentrant
  {
    // 1. Find out what farming token we are dealing with.
    (
      address baseToken,
      address farmingToken,
      uint256 minBaseToken
    ) = abi.decode(data, (address, address, uint256));
    IUniswapV2Pair lpToken = IUniswapV2Pair(factory.getPair(farmingToken, baseToken));
    // 2. Approve router to do their stuffs
    lpToken.approve(address(router), uint256(-1));
    farmingToken.safeApprove(address(router), uint256(-1));
    // 3. Remove all liquidity back to BaseToken and farming tokens.
    router.removeLiquidity(baseToken, farmingToken, lpToken.balanceOf(address(this)), 0, 0, address(this), now);
    // 4. Convert farming tokens to baseToken.
    address[] memory path = new address[](2);
    path[0] = farmingToken;
    path[1] = baseToken;
    router.swapExactTokensForTokens(farmingToken.myBalance(), 0, path, address(this), now);
    // 5. Return all baseToken back to the original caller.
    uint256 balance = baseToken.myBalance();
    require(balance >= minBaseToken, "insufficient baseToken received");
    SafeToken.safeTransfer(baseToken, msg.sender, balance);
    // 6. Reset approve for safety reason
    lpToken.approve(address(router), 0);
    farmingToken.safeApprove(address(router), 0);
  }
}
