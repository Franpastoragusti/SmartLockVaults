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
		distributionTimeStamp = getNextDistributionTimeStamp(_frec);
		distributeAddresses = _distributeAddresses;
		distibutionType = _distibutionType;

		if (_distibutionType == 1) {
			require(
				((_distributionValue / 10 ** 18) *
					_distributeAddresses.length) <= 100,
				"Total distribution exceeds 100%"
			);
		}
		distributionValue = _distributionValue;
		name = _name;
	}

	event distributionTimeStampChange(uint256 newdistributionTimeStamp);

	event DistributionExecuted(
		uint256 newdistributionTimeStamp,
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

	function allIsFine() public onlyOwner {
		distributionTimeStamp = getNextDistributionTimeStamp(frec);
		emit distributionTimeStampChange(distributionTimeStamp);
	}

	function distribute() public {
		require(block.timestamp >= distributionTimeStamp, "Contract is locked");
		require(address(this).balance > 0, "There is no enougth eth");
		uint256 contractBalance = address(this).balance;
		uint256 amountPerEach = contractBalance / distributeAddresses.length;

		if (distibutionType == 1 && address(this).balance > 1 ether) {
			amountPerEach =
				(address(this).balance * (distributionValue / 10 ** 18)) /
				100;
		}
		if (distibutionType == 2 && address(this).balance > 1 ether) {
			amountPerEach = distributionValue;
		}

		for (uint256 i = 0; i < distributeAddresses.length; i++) {
			sendViaCall(distributeAddresses[i], amountPerEach);
		}
		distributionTimeStamp = getNextDistributionTimeStamp(distributionFrec);
		emit DistributionExecuted(
			distributionTimeStamp,
			address(this),
			address(this).balance
		);
	}

	function sendViaCall(address payable _to, uint256 value) internal {
		(bool success, ) = _to.call{ value: value }("");
		require(success, "Failed to send Ether");
	}

	function getNextDistributionTimeStamp(
		uint256 frecToUse
	) internal view returns (uint256) {
		return block.timestamp + frecToUse;
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
