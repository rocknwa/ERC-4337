require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Adjust for size optimization
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545", // Hardhat local node
    },
    arbitrum: {
      url: process.env.RPC_URL, // Arbitrum testnet
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
