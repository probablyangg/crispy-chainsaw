// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
contract DummyChubby is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter public tokenIds;

    constructor() ERC721("Chubby", "chb") {}

    function mintItem(address user)
        public
        returns (uint256)
    {
        tokenIds.increment();
        uint256 newItemId = tokenIds.current();
        _mint(user, newItemId);
        // console.log ("new item minted with tokenid:",newItemId);
        return newItemId;
    }
}
