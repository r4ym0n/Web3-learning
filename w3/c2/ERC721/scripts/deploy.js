// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  async function deployContract() {
    let contractList = [
      "ERC721",
    ]
    let contracts = {}
    for (let contractName of contractList) {
      // let contract = await hre.ethers.getContract(contractName);
      const Contract = await hre.ethers.getContractFactory(contractName);
      let contract;
      if (contractName == "Vault") {
        params = [contracts.Mytoken.address]
        console.log(params);
        contract = await Contract.deploy(params);
      } else {
        contract = await Contract.deploy();
      }

      await contract.deployed();
      console.log(`Contract ${contractName} deployed to:`, contract.address);
      contracts[contractName] = contract;
    }
    return contracts;
  }
  let contracts = await deployContract();

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
