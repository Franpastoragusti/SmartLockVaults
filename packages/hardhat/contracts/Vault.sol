//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */

contract Vault is Ownable {
	// State Variables
	address payable[] public distributeAddresses;
	uint256 public distributionTimeStamp;
	uint256 public frec;
	uint256 public distributionFrec;
	uint256 public distibutionType;
	uint256 public distributionValue;
	string public name;

	constructor(
		address _owner,
		uint256 _frec,
		uint256 _distributionFrec,
		address payable[] memory _distributeAddresses,
		string memory _name,
		uint256 _distibutionType,
		uint256 _distributionValue
	) {
		_transferOwnership(_owner);
		frec = _frec;
		distributionFrec = _distributionFrec;
		distributionTimeStamp = getNextDistributionTimeStamp();
		distributeAddresses = _distributeAddresses;
		distibutionType = _distibutionType;
		distributionValue = _distributionValue;
		name = _name;
	}

	event distributionTimeStampChange(
		uint256 newdistributionTimeStamp,
		uint256 actualPeriod
	);

	event DistributionExecuted(
		uint256 newdistributionTimeStamp,
		uint256 actualPeriod,
		address executedBy,
		uint256 currentBalance
	);

	function readDistributeAddresses()
		public
		view
		returns (address payable[] memory)
	{
		return distributeAddresses;
	}

	// Modifier: used to define a set of rules that must be met before or after a function is executed
	// Check the withdraw() function

	function allIsFine() public onlyOwner {
		distributionTimeStamp = getNextDistributionTimeStamp();
		emit distributionTimeStampChange(distributionTimeStamp, frec);
	}

	function distribute() public {
		if ((block.timestamp - distributionTimeStamp) > frec) {
			revert("The Distribution has not started");
		}
		if (address(this).balance <= 0) {
			revert("There is no enougth eth");
		}
		uint256 contractBalance = address(this).balance;
		uint256 amountPerEach = contractBalance / distributeAddresses.length;

		if (distibutionType == 1) {
			amountPerEach = (address(this).balance * distributionValue) / 100;
		}
		if (distibutionType == 2) {
			amountPerEach = distributionValue;
		}

		for (uint256 i = 0; i < distributeAddresses.length; i++) {
			sendViaCall(distributeAddresses[i], amountPerEach);
		}
		distributionTimeStamp = getNextDistributionTimeStamp();
		emit DistributionExecuted(
			distributionTimeStamp,
			frec,
			address(this),
			address(this).balance
		);
	}

	function sendViaCall(address payable _to, uint256 value) internal {
		(bool success, ) = _to.call{ value: value }("");
		require(success, "Failed to send Ether");
	}

	function getNextDistributionTimeStamp() internal view returns (uint256) {
		return block.timestamp + frec;
	}

	/**
	 * Function that allows the owner to withdraw all the Ether in the contract
	 * The function can only be called by the owner of the contract as defined by the onlyOwner modifier
	 */
	function withdraw() public onlyOwner {
		(bool success, ) = owner().call{ value: address(this).balance }("");
		require(success, "Failed to send Ether");
	}

	/**
	 * Function that allows the contract to receive ETH
	 */
	receive() external payable {}
}
