const { constants } = require("buffer");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Teacher and score test",  function () {
  async function deployContract() {
    let contractList = [
      "Teacher",
      "Scores"
    ]
    let contracts = {}
    for (let contractName of contractList) {
      // let contract = await hre.ethers.getContract(contractName);
      const Contract = await hre.ethers.getContractFactory(contractName);
      const contract = await Contract.deploy();
      await contract.deployed();
      console.log(`Contract ${contractName} deployed to:`, contract.address);
      contracts[contractName] = contract;
    }
    return  contracts;
  }

  it("owner should be registed teacher", async function () {
    let contracts = await deployContract();
    let [owner, second] = await hre.ethers.getSigners();
    expect(await contracts.Teacher.isTeacher(owner.address)).to.equal(true);
    
    await contracts.Teacher.registNewTeacher(second.address);
    expect(await contracts.Teacher.isTeacher(second.address)).to.equal(true);

    await contracts.Teacher.unregistTeacher(second.address);
    expect(await contracts.Teacher.isTeacher(second.address)).to.equal(false);
  });

  it("it should Ok to set score", async function () {
    let contracts = await deployContract();
    let [owner, second] = await hre.ethers.getSigners();
    expect(await contracts.Teacher.isTeacher(owner.address)).to.equal(true);

    await contracts.Teacher.setScore(second.address, 10);
    expect(await contracts.Teacher.getScore(second.address)).to.equal(10);

    await contracts.Teacher.setScore(second.address, 100);
    expect(await contracts.Teacher.getScore(second.address)).to.equal(100);

    await contracts.Teacher.unregistTeacher(owner.address);

    await expect( contracts.Teacher.setScore(second.address, 0)).to.be.revertedWith("Only teacher can call this function");

  });

});
