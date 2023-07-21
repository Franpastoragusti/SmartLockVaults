//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */

contract YourContract {
	// State Variables
	address public immutable owner;
	address payable [] public distributeAddresses;
	uint256 public distributionBlock;
	uint256 public periodInDays;

	// Events: a way to emit log statements from smart contract that can be listened to by external parties
	event DistributionBlockChange(
		uint256 newDistributionBlock,
		uint256 actualPeriod
	);

	event DistributionExecuted(
		uint256 newDistributionBlock,
		uint256 actualPeriod, 
		address executedBy,
		uint256 currentBalance
	);

	// Constructor: Called once on contract deployment
	// Check packages/hardhat/deploy/00_deploy_your_contract.ts
	constructor(address _owner, uint256 _notificationPeriod, address payable[] memory _distributeAddresses) {
		owner = _owner;
		periodInDays = _notificationPeriod;
		distributionBlock = getNextDistributionBlockNumber();
		distributeAddresses = _distributeAddresses;
	}
	function readDistributeAddresses() public view returns (address payable[] memory){
		return distributeAddresses;
	}

	// Modifier: used to define a set of rules that must be met before or after a function is executed
	// Check the withdraw() function
	modifier isOwner() {
		// msg.sender: predefined variable that represents address of the account that called the current function
		require(msg.sender == owner, "Not the Owner");
		_;
	}

	function allIsFine() public isOwner {
		// Print data to the hardhat chain console. Remove when deploying to a live network.
		console.log(
			"Setting new distributionBlock '%s' from %s",
			distributionBlock,
			periodInDays
		);
		// Change state variables
		distributionBlock = getNextDistributionBlockNumber();
		// emit: keyword used to trigger an event
		emit DistributionBlockChange(distributionBlock, periodInDays);
	}

	function distribute() public {
		if(block.number < distributionBlock){
			revert("The Distribution has not started");
		}
		if(address(this).balance <= 0){
			revert("There is no enougth eth");
		}

		uint256 contractBalance = address(this).balance;
        uint256 twoPercent = (contractBalance * 2) / 100;
		for (uint256 i = 0; i < distributeAddresses.length; i++) {
			sendViaCall(distributeAddresses[i], twoPercent);
        }
		distributionBlock = getNextDistributionBlockNumber();
		emit DistributionExecuted(distributionBlock, periodInDays,address(this), address(this).balance);
	}

	function sendViaCall(address payable _to, uint256 value ) internal {
        (bool success, ) = _to.call{value: value}("");
        require(success, "Failed to send Ether");
    }
	function getNextDistributionBlockNumber() internal view returns (uint256){
		uint256 futureBlock = periodInDays * 24 * 60 * 60 / 15;
		return block.number+futureBlock;
    }

	/**
	 * Function that allows the owner to withdraw all the Ether in the contract
	 * The function can only be called by the owner of the contract as defined by the isOwner modifier
	 */
	function withdraw() public isOwner {
		(bool success, ) = owner.call{ value: address(this).balance }("");
		require(success, "Failed to send Ether");
	}

	/**
	 * Function that allows the contract to receive ETH
	 */
	receive() external payable {}
}
