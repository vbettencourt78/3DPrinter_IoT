require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    fuji: {
      url: process.env.FUJI_RPC_URL,
      chainId: Number(process.env.FUJI_CHAIN_ID), // Chain ID de Avalanche Fuji
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};