const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank", function () {
  it("amount should equal all sum", async function () {
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
