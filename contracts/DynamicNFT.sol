// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol";

contract DynamicNFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  struct NFT {
    string message;
    string textColor;
    string backgroundColor;
  }

  mapping(uint256 => NFT) public viewableMessage;

  event NewBasicNFTMinted (
    address sender,
    uint256 tokenId
  );

  constructor() ERC721 ("Himitsu NFT", "secret NFT") {
    console.log("dynamic nft");
  }

  function buildBaseSVG(NFT memory nft) internal view returns (string memory) {
    return string(abi.encodePacked(
      "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: ",
      nft.textColor,
      "; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='",
      nft.backgroundColor,
      "' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>",
      nft.message,
      "</text></svg>"
    ));
  }

  function makeSVGTokenURL(NFT memory nft) internal view returns (string memory) {
    //string memory finalSvg = string(abi.encodePacked(baseSvg, _word, "</text></svg>"));
    string memory finalSvg = buildBaseSVG(nft);
    string memory json = Base64.encode(bytes(string(
      abi.encodePacked(
        '{"name": "',
        nft.message,
        '", "description": "secret NFT. only the owner of a NFT can see a special message", "image": "data:image/svg+xml;base64,',
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
    string memory _svgURI = makeSVGTokenURL(viewableMessage[tokenId]);
    return _svgURI;
  }

  function makeDyamicNFT(
    string memory _ownerMsg,
    string memory _viewableMsg,
    string memory _textColor,
    string memory _backgroundColor
  ) public {
    uint256 newItemId = _tokenIds.current();
    _safeMint(msg.sender, newItemId);
    NFT memory ownerNFT = NFT(_ownerMsg, _textColor, _backgroundColor);
    NFT memory viewableNFT = NFT(_viewableMsg, _textColor, _backgroundColor);

    string memory finalTokenUri = makeSVGTokenURL(ownerNFT);

    console.log("---mint---");
    console.log(finalTokenUri);
    console.log("---mint---");

    _setTokenURI(newItemId, finalTokenUri);
    viewableMessage[newItemId] = viewableNFT;

    console.log("ID:%s, Address: %s", newItemId, msg.sender);
    _tokenIds.increment();
    emit NewBasicNFTMinted(msg.sender, newItemId);
  }
}
