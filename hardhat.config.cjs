require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    riseTestnet: {
      url: "https://testnet.riselabs.xyz",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155931,
    },
  },
  etherscan: {
    apiKey: {
      riseTestnet: process.env.ETHERSCAN_API_KEY || "NOT_REQUIRED",
    },
    customChains: [
      {
        network: "riseTestnet",
        chainId: 11155931,
        urls: {
          apiURL: "https://explorer.testnet.riselabs.xyz/api",
          browserURL: "https://explorer.testnet.riselabs.xyz",
        },
      },
    ],
  },
};
