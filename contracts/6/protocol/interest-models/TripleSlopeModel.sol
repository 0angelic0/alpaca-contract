pragma solidity 0.6.6;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract TripleSlopeModel {
  using SafeMath for uint256;

  /// @dev Return the interest rate per second, using 1e18 as denom.
  function getInterestRate(uint256 debt, uint256 floating) external pure returns (uint256) {
    if (debt == 0 && floating == 0) return 0;

    uint256 total = debt.add(floating);
    uint256 utilization = debt.mul(100e18).div(total);
    if (utilization < 50e18) {
      // Less than 50% utilization - 0%-10% APY
      return utilization.mul(10e16).div(50e18) / 365 days;
    } else if (utilization < 90e18) {
      // Between 50% and 90% - 10% APY
      return uint256(10e16) / 365 days;
    } else if (utilization < 100e18) {
      // Between 90% and 100% - 10%-60% APY
      return (10e16 + utilization.sub(90e18).mul(50e16).div(10e18)) / 365 days;
    } else {
      // Not possible, but just in case - 50% APY
      return uint256(50e16) / 365 days;
    }
  }
}