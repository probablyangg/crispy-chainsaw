// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
	// Hardhat always runs the compile task when running scripts with its command
	// line interface.
	//
	// If this script is run directly using `node` you may want to call compile
	// manually to make sure everything is compiled
	// await hre.run('compile');

	// We get the contract to deploy
	// const Greeter = await hre.ethers.getContractFactory("Greeter");
	// const greeter = await Greeter.deploy("Hello, Hardhat!");
	// await greeter.deployed();
  // console.log("Greeter deployed to:", greeter.address);
  
  const ChubbyUprising = await hre.ethers.getContractFactory("ChubbyUprising");
  const chubbyUprising = await ChubbyUprising.deploy(
    "QmUXLHcjFEtquVX2ikdWuiPXhWa4DYrRbymhoAhf1icp9A",
    "0x1DB61FC42a843baD4D91A2D788789ea4055B8613"
  );
  await chubbyUprising.deployed();
  console.log("Chubby uprising deployed to:", chubbyUprising.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
