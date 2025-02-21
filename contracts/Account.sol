// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
import "hardhat/console.sol";

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

contract Account is IAccount {
    constructor(address _owner) {
        owner = _owner;
    }

    uint256 public count;
    address public owner;

    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256
    ) external view returns (uint256 validationData) {
        address recoverd = ECDSA.recover(
            ECDSA.toEthSignedMessageHash(userOpHash),
            userOp.signature
        );
        return owner == recoverd ? 0 : 1;
    }

    function execute() external {
        count++;
    }
}

contract AccountFactory {
    function createAccount(address owner) external returns (address) {
       
        bytes32 salt = bytes32(uint256(uint160(owner)));
        bytes memory bytecode = abi.encodePacked(type(Account).creationCode, abi.encode(owner)); // Encode bytecode
        address addr = Create2.computeAddress(salt, keccak256(bytecode)); // Compute address
        if(addr.code.length > 0) {
            return addr;
        } // Check if contract already deployed
        return deploy(salt, bytecode); // Deploy bytecode
    }

    function deploy(bytes32 salt, bytes memory bytecode) internal returns (address addr) {
        require(bytecode.length != 0, "Create2: bytecode length is zero");
        /// @solidity memory-safe-assembly
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        require(addr != address(0), "Create2: Failed on deploy");
    }
}
