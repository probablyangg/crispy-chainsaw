require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");

const pk = process.env.ADMIN_PK;
const infuraKey = process.env.INFURA;
const rinkeby = "https://rinkeby.infura.io/v3/" + infuraKey;
const mainnet = "https://mainnet.infura.io/v3/" + infuraKey;
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
https: task("accounts", "Prints the list of accounts", async () => {
	const accounts = await ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	defaultNetwork: "hardhat",
	networks: {
		rinkeby: {
			url: rinkeby,
			accounts: [pk],
		},
		mainnet: {
			url: mainnet,
			accounts: [pk],
		},
	},
	solidity: {
		version: "0.8.6",
  },
  gasReporter: {
    enabled: (process.env.REPORT_GAS) == "true" ? true : false,
    showTimeSpent: true,
    excludeContracts: ['Greeter.sol'],
    currency: 'USD',
    coinmarketcap: process.env.COINMARKETCAP
    // gasPrice: 21
  }
};
