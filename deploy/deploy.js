const hre = require("hardhat");
const { ethers } = require("ethers");
require("dotenv").config();

var subId = process.env.VRF_SUBSCRIPTION_ID;

async function main() {
  console.log("Beginning deployment...");

  const MagicOracleVRF = await hre.ethers.getContractFactory("MagicOracleVRF");
  const magicOracleNFT = await hre.ethers.getContractFactory("MagicOracleNFT");

  const magicOracleVRFDeployed = await MagicOracleVRF.deploy(subId);
  await magicOracleVRFDeployed.deployed();
  console.log("MagicOracleVRF deployed to:", magicOracleVRFDeployed.address);

  const magicOracleNFTDeployed = await magicOracleNFT.deploy();
  await magicOracleNFTDeployed.deployed();
  console.log("MagicOracleNFT deployed to:", magicOracleNFTDeployed.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
