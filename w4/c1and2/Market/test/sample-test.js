const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {

  async function deployContract() {
    let contractList = [
      "MyToken",
      "MyTokenMarket",
    ]
    let contracts = {}
    for (let contractName of contractList) {
      // let contract = await hre.ethers.getContract(contractName);
      const Contract = await hre.ethers.getContractFactory(contractName);
      let contract;
      params = [];

      if (contractName === "MyToken") {
        params = ["Test", "TST", 100000];
      }
      if (contractName === "MyToken") {
        params = ["Test", "TST", 100000];
      }
      
      console.log('params:', params);
      contract = await Contract.deploy(...params);


      await contract.deployed();
      console.log(`Contract ${contractName} deployed to:`, contract.address);
      contracts[contractName] = contract;
    }
    return contracts;
  }

  it("should success mint token", async function () {
    let contracts = await deployContract();
    const powergear = contracts.PowerGear;

    const [owner, secondOwner, thirdOwner] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("Bank");
    const contract = await Contract.deploy();
    await contract.deployed();

    expect(await contract.getBalance()).to.equal("0");

    await contract.deposit({ value: 1000000 });
    expect(await contract.getBalance()).to.equal("1000000");

    await contract.withdraw(100000);
    expect(await contract.getBalance()).to.equal("900000");

    await contract.withdrawAll();
    console.log(await contract.getTotalBalance())
    expect(await contract.getTotalBalance()).to.equal("0");

    
  });
});
