// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const main = async () => {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const DynamicNFT = await hre.ethers.getContractFactory("DynamicNFT");
  const accounts = await hre.ethers.getSigners();
  console.log(accounts.map(ac => ac.address))
  const dnft = await DynamicNFT.deploy();
  await dnft.deployed();
  console.log("contract address: ", dnft.address)

  const backgroundColor = "rgb(187, 73, 73)"
  const textColor = "rgb(224, 224, 224)"
  const tx = await dnft.makeDyamicNFT("My first dynamic NFT. Interesting", "Omoshiroine NFT", textColor, backgroundColor)
  await tx.wait()

  const tokenURI = await dnft.tokenURI(0)
  console.log(tokenURI)
}

(async () => {
  try {
    await main()
    process.exit(0)
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})()
