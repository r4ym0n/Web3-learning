const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LuckyLottery", function () {

  async function deployContract() {
    let contractList = [
      "LuckyLottery",
    ]
    let contracts = {}
    for (let contractName of contractList) {
      // let contract = await hre.ethers.getContract(contractName);
      const Contract = await hre.ethers.getContractFactory(contractName);
      let contract;
      params = [];

      // if (contractName === "MyToken") {
      //   params = ["Test", "TST", 100000];
      // }
      // if (contractName === "MyToken") {
      //   params = ["Test", "TST", 100000];
      // }
      
      console.log('params:', params);
      contract = await Contract.deploy(...params);

      await contract.deployed();
      console.log(`Contract ${contractName} deployed to:`, contract.address);
      contracts[contractName] = contract;
    }
    return contracts;
  }

  it("should success bet", async function () {
    let contracts = await deployContract();
    const lt = contracts.LuckyLottery;

    const players = [...await ethers.getSigners()];
    console.log(players)
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
