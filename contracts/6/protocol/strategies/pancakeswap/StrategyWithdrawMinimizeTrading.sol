pragma solidity 0.6.6;

import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

import "../../apis/uniswap/IUniswapV2Router02.sol";
import "../../interfaces/IStrategy.sol";
import "../../../utils/SafeToken.sol";

contract StrategyWithdrawMinimizeTrading is ReentrancyGuardUpgradeSafe, IStrategy {
  using SafeToken for address;
  using SafeMath for uint256;

  IUniswapV2Factory public factory;
  IUniswapV2Router02 public router;

  /// @dev Create a new withdraw minimize trading strategy instance.
  /// @param _router The Uniswap router smart contract.
  function initialize(IUniswapV2Router02 _router) public initializer {
    ReentrancyGuardUpgradeSafe.__ReentrancyGuard_init();

    factory = IUniswapV2Factory(_router.factory());
    router = _router;
  }

  /// @dev Execute worker strategy. Take LP tokens. Return FarmingToken + BaseToken.
  /// However, some BaseToken will be deducted to pay the debt
  /// @param user User address to withdraw liquidity.
  /// @param debt Debt amount in WAD of the user.
  /// @param data Extra calldata information passed along to this strategy.
  function execute(address user, uint256 debt, bytes calldata data) external override payable nonReentrant {
    // 1. Find out what farming token we are dealing with.
    (
      address baseToken,
      address farmingToken,
      uint256 minFarmingToken
    ) = abi.decode(data, (address, address, uint256));
    IUniswapV2Pair lpToken = IUniswapV2Pair(factory.getPair(farmingToken, baseToken));
    // 2. Approve router to do their stuffs
    lpToken.approve(address(router), uint256(-1));
    farmingToken.safeApprove(address(router), uint256(-1));
    // 3. Remove all liquidity back to BaseToken and farming tokens.
    router.removeLiquidity(baseToken, farmingToken, lpToken.balanceOf(address(this)), 0, 0, address(this), now);
    // 4. Convert farming tokens to BaseToken.
    address[] memory path = new address[](2);
    path[0] = farmingToken;
    path[1] = baseToken;
    uint256 balance = baseToken.myBalance();
    if (debt > balance) {
      // Convert some farming tokens to BaseToken.
      uint256 remainingDebt = debt.sub(balance);
      router.swapTokensForExactTokens(remainingDebt, farmingToken.myBalance(), path, address(this), now);
    }
    // 5. Return BaseToken back to the original caller.
    uint256 remainingBalance = baseToken.myBalance();
    baseToken.safeTransfer(msg.sender, remainingBalance);
    // 6. Return remaining farming tokens to user.
    uint256 remainingFarmingToken = farmingToken.myBalance();
    require(remainingFarmingToken >= minFarmingToken, "insufficient quote tokens received");
    if (remainingFarmingToken > 0) {
      farmingToken.safeTransfer(user, remainingFarmingToken);
    }
    // 7. Reset approval for safety reason
    lpToken.approve(address(router), 0);
    farmingToken.safeApprove(address(router), 0);
  }

  receive() external payable {}
}
