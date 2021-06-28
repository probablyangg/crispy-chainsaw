// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ChubbyUprising is IERC721Receiver, ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter public chubbiesReceived;
    mapping (uint256 => bool) public tokenIdsReceived;
    /**
     * All 10,000 Chubbies have been revealed hence the metadata CID is being hardcoded here.
     * accessed by: `ipfs://CID/<path>` or `https://dweb.link/ipfs/CID/path
     * CID is case sensitive.
     */
    string public CID;
    /**
     * Address of the original Chubbies contract on Mainnet
     * removed checksum
     */
    address public ChubbiesContract;
    // cid: QmUXLHcjFEtquVX2ikdWuiPXhWa4DYrRbymhoAhf1icp9A
    constructor (string memory cid, address chubbiesContract) ERC721("ChubbiesUprising","CHUBBIESUprising") {
      CID = cid;
      ChubbiesContract = chubbiesContract;
    }

    /**
     * Checks if the received NFT is a Chubby
     * If receieved Chubby -> burns it and mints and returns a new one to the sender
     * If received a different NFT than a chubby -> do nothing :)
     * Always returns `IERC721Receiver.onERC721Received.selector`.
     */
    function onERC721Received (
      address,
      address from,
      uint256 tokenId,
      bytes memory
    ) public virtual override returns (bytes4) {
      ERC721 chubby = ERC721(ChubbiesContract);
      if (
        chubby.ownerOf(tokenId) == address(this) &&
        !tokenIdsReceived[tokenId]
      ) {
        mint (from, tokenId);
        tokenIdsReceived[tokenId] = true;
        chubbiesReceived.increment();
      }
      return this.onERC721Received.selector;
    }

    function mint (address receiver, uint256 tokenId) internal {
      _safeMint(receiver, tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
      return string(
        abi.encodePacked("https://dweb.link/ipfs/", CID, "/")
      );
    }
}