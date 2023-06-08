/** @type import('hardhat/config').HardhatUserConfig */

require("dotenv").config();

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.13",
  networks: {
    // mainnet: {
    //   url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
    //   accounts: [GOERLI_PRIVATE_KEY]
    // },
    // goerli: {
    //   url: `https://eth-goerli.alchemyapi.io/v2/lP-flLxYsf17ns4fIQtT3L-pHB2RHLQZ`,
    //   accounts: process.env.ARB_PRIV_KEY,
    // },
    goerli_arb: {
      url: `https://arb-goerli.g.alchemy.com/v2/BE-g9RmigcmXXJO8THYr_dzu_QeOXtpv`,
      accounts: [process.env.ARB_PRIV_KEY],
    },
    // matic: {
    //   url: "https://polygon-mainnet.g.alchemy.com/v2/r_jvahXsLoHQKDrBrHBav_P5R9lJKlt-",
    //   accounts: process.env.ARB_PRIV_KEY,
    // },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  paths: {
    sources: "./src/contracts",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};


