//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
// Useful for debugging. Remove when deploying to a live network.
import "./Vault.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */

contract SmartLockFactory {
	// State Variables
	address public immutable factoryOwner;
	mapping(address => address[]) private VaultsDeployed;
	mapping(address => address[]) private VaultsAssigned;
	constructor(address _factoryOwner) {
		factoryOwner = _factoryOwner;
	}

	modifier isOwner() {
		// msg.sender: predefined variable that represents address of the account that called the current function
		require(msg.sender == factoryOwner, "Not the Owner");
		_;
	}

	function getMyDeployedVaults() public view returns (address[] memory) {
        return VaultsDeployed[msg.sender];
    }
	
	function getMyAssignedVaults() public view returns (address[] memory) {
        return VaultsAssigned[msg.sender];
    }

	function CreateNewVault(
		uint256 _notificationPeriod,
		address payable[] memory _distributeAddresses,
		string memory _name
	) public payable {
		require(msg.value > 0, "You must send some ether.");
		Vault vault = new Vault(
			msg.sender,
			_notificationPeriod,
			_distributeAddresses,
			_name
		);
		VaultsDeployed[msg.sender].push(address(vault));
		for (uint256 index = 0; index < _distributeAddresses.length; index++) {
			VaultsAssigned[_distributeAddresses[index]].push(address(vault));
		}
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
