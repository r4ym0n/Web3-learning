const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC721", function () {

  async function deployContract() {
    let contractList = [
      "PowerGear",
    ]
    let contracts = {}
    for (let contractName of contractList) {
      // let contract = await hre.ethers.getContract(contractName);
      const Contract = await hre.ethers.getContractFactory(contractName);
      let contract;
      if (contractName !== "Vault") {
        contract = await Contract.deploy();
      } else {
        params = [contracts.Mytoken.address]
        console.log(params);
        contract = await Contract.deploy(params);
      }

      await contract.deployed();
      console.log(`Contract ${contractName} deployed to:`, contract.address);
      contracts[contractName] = contract;
    }
    return contracts;
  }
  it("should fine to mint", async function () {
    let contracts = await deployContract();
    const powergear = contracts.PowerGear;

    const [owner, secondOwner, thirdOwner] = await ethers.getSigners();

    expect(await powergear.name()).to.equal("PowerGear"); 
    expect(await powergear.symbol()).to.equal("PG");

    await powergear.awardItem(owner.address, "test");
    await powergear.awardItem(secondOwner.address, "test2");
    await powergear.awardItem(thirdOwner.address, "test3");

    expect(await powergear.balanceOf(owner.address)).to.equal(1);
    expect(await powergear.balanceOf(secondOwner.address)).to.equal(1);
    expect(await powergear.balanceOf(thirdOwner.address)).to.equal(1);

    expect(await powergear.ownerOf(1)).to.equal(owner.address);
    expect(await powergear.ownerOf(2)).to.equal(secondOwner.address);
    expect(await powergear.ownerOf(3)).to.equal(thirdOwner.address);
  });
  it("should fine to transfer", async function () {
    let contracts = await deployContract();
    const powergear = contracts.PowerGear;

    const [owner, secondOwner, thirdOwner] = await ethers.getSigners();

    expect(await powergear.name()).to.equal("PowerGear"); 
    expect(await powergear.symbol()).to.equal("PG");

    await powergear.awardItem(owner.address, "test");
    expect(await powergear.balanceOf(owner.address)).to.equal(1);

    await powergear.transferFrom(owner.address, secondOwner.address, 1);
    expect(await powergear.balanceOf(owner.address)).to.equal(0);
    expect(await powergear.balanceOf(secondOwner.address)).to.equal(1);
  });

});
