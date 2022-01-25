// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol";

contract DynamicNFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";
  Counters.Counter private _tokenIds;

  event NewBasicNFTMinted (
    address sender,
    uint256 tokenId
  );

  constructor() ERC721 ("WalletGacha", "gacha") {
    console.log("dynamic nft");
  }

  function makeSVGTokenURL(string memory _word) internal view returns (string memory) {
    string memory finalSvg = string(abi.encodePacked(baseSvg, _word, "</text></svg>"));

    string memory json = Base64.encode(bytes(string(
      abi.encodePacked(
        '{"name": "',
        _word,
        '", "description": "Sushi sakana", "image": "data:image/svg+xml;base64,', 
        Base64.encode(bytes(finalSvg)),
        '"}'
      )
    )));
    string memory finalTokenUri = string(
      abi.encodePacked("data:application/json;base64,", json)
    );
    return finalTokenUri;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    if (ownerOf(tokenId) == msg.sender) {
      console.log("msg sender is owner");
      return super.tokenURI(tokenId);
    }

    console.log("msg sender is not owner");
    string memory _svgURI = makeSVGTokenURL("");
    return _svgURI;
  }

  function makeDyamicNFT() public {
    uint256 newItemId = _tokenIds.current();
    require(newItemId <= 100);
    _safeMint(msg.sender, newItemId);

    string memory finalTokenUri = makeSVGTokenURL("sakana");

    console.log("---mint---");
    console.log(finalTokenUri);
    console.log("---mint---");

    _setTokenURI(newItemId, finalTokenUri);
    console.log("ID:%s, Address: %s", newItemId, msg.sender);
    _tokenIds.increment();
    emit NewBasicNFTMinted(msg.sender, newItemId);
  }
}
