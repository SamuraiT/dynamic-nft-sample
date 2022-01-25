const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DynamicNFT", function () {
  it("Should return the new greeting once it's changed", async function () {
    const DynamicNFT = await hre.ethers.getContractFactory("DynamicNFT");
    const dnft = await DynamicNFT.deploy();
    await dnft.deployed();
    const tx = await dnft.makeDyamicNFT()
    await tx.wait()

    const tokenURI = await dnft.tokenURI(0)
    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
