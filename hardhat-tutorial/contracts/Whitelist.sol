//SPDX-License-Identifier:Unlicense
pragma solidity ^0.8.0;

contract Whitelist {
    // add addresses/members to whitelist of  an NFT collection
    // max no of members to be whitelisted
    uint8 public maxWhitelistedAddresses;

    // current no of whitelisted addresses
    uint8 public numAddressesWhitelisted;

    mapping(address => bool) public whitelistedAddresses;

    constructor(uint8 _maxWhitelistedAddresses){
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }


    function addAddressToWhitelist() public {
        require(!whitelistedAddresses[msg.sender], "Sender has already been whitelisted");

        require(numAddressesWhitelisted < maxWhitelistedAddresses, "More addresses can't be added, limit reached");

        whitelistedAddresses[msg.sender] = true;

        numAddressesWhitelisted += 1;
    }
}