// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
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
  // const Counter = await hre.ethers.getContractFactory("Counter");
  // const counter = await Counter.deploy();

  // await counter.deployed();

  // console.log("Counter deployed to:", counter.address);

  let contractAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  counter = await hre.ethers.getContractAt("Counter", contractAddr);
  
  console.log("counter value:", await counter.count());

  await counter.selfIncrement();

  console.log("counter value:", await counter.count());

  await counter.increment("2");

  console.log("counter value:", await counter.count());

  
  
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
