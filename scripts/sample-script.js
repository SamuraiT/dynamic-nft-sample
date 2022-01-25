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
  const dnft = await DynamicNFT.deploy();

  await dnft.deployed();

  console.log("Greeter deployed to:", dnft.address);
}

(async () => {
  try {
    await main()
    process.exit(0)
  } catch (e) {
    console.error(error);
    process.exit(1);
  }
})()
