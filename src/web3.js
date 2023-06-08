import { ethers } from "ethers";

let provider;
let signer;

if (window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
} else {
  provider = new ethers.providers.JsonRpcProvider(
    "https://arb-goerli.g.alchemy.com/v2/BE-g9RmigcmXXJO8THYr_dzu_QeOXtpv"
  );
}

export { provider, signer };
