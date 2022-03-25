//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./@openzeppelin/contracts/utils/Counters.sol";


contract PowerGear is ERC721URIStorage {
   using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor()  ERC721("PowerGear", "PG") {}


    function awardItem(address player, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _safeMint(player, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}