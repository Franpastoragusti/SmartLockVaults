//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "./Distributor.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */

contract DistributorFactory {
	// State Variables
	address public immutable factoryOwner;
	mapping(address => address[]) public DistributorsDeployed;

	event NewDistributorCreated(
		address indexed contractAddress,
		address executedBy,
		address[] distributeAddresses
	);

	constructor(address _factoryOwner) {
		factoryOwner = _factoryOwner;
	}

	modifier isOwner() {
		// msg.sender: predefined variable that represents address of the account that called the current function
		require(msg.sender == factoryOwner, "Not the Owner");
		_;
	}

	function CreateNewDistributor(
		address _owner,
		uint256 _notificationPeriod,
		address payable[] memory _distributeAddresses
	) public payable {
		require(msg.value > 0, "You must send some ether.");
		Distributor distributor = new Distributor(
			_owner,
			_notificationPeriod,
			_distributeAddresses
		);
		address[] storage senderDistributors = DistributorsDeployed[msg.sender];
		senderDistributors.push(address(distributor));
		address[] memory addresses = new address[](_distributeAddresses.length);
		for (uint256 i = 0; i < _distributeAddresses.length; i++) {
			addresses[i] = _distributeAddresses[i];
		}
		emit NewDistributorCreated(address(distributor), _owner, addresses);
	}

	/**
	 * Function that allows the owner to withdraw all the Ether in the contract
	 * The function can only be called by the owner of the contract as defined by the isOwner modifier
	 */
	function withdraw() public isOwner {
		(bool success, ) = factoryOwner.call{ value: address(this).balance }(
			""
		);
		require(success, "Failed to send Ether");
	}

	/**
	 * Function that allows the contract to receive ETH
	 */
	receive() external payable {}
}
