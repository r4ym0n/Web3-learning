const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Erc20", function () {
  async function deployContract() {
    let contractList = [
      "Mytoken",
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
    return contracts;
  }

  it("Should fine to mint and transfer", async function () {
    let contracts = await deployContract();
    const contract = contracts.Mytoken;
    const [owner, user1, user2] = await ethers.getSigners();

    expect(await contract.totalSupply()).to.equal("0");

    await contract.mintToken(owner.address, 100000);
    expect(await contract.totalSupply()).to.equal("100000");
    expect(await contract.balanceOf(owner.address)).to.equal("100000");

    await contract.transfer(user1.address, 1000, { from: owner.address });
    expect(await contract.balanceOf(owner.address)).to.equal("99000");
    expect(await contract.balanceOf(user1.address)).to.equal("1000");
  });

  it("Should fine to approve and transferFrom", async function () {
    let contracts = await deployContract();
    const contract = contracts.Mytoken;
    const [owner, user1, user2] = await ethers.getSigners();

    await contract.mintToken(owner.address, 100000);

    await contract.approve(user1.address, 2000, { from: owner.address });
    expect(await contract.allowance(owner.address, user1.address)).to.equal("2000");


    // reconnect contract to user1
    await contract.connect(user1).transferFrom(owner.address, user2.address, 1000);
    expect(await contract.balanceOf(owner.address)).to.equal("99000");
    expect(await contract.balanceOf(user2.address)).to.equal("1000");
    expect(await contract.allowance(owner.address, user1.address)).to.equal("1000");

    // should not be able to transferFrom to user2
    await expect(contract.connect(user1).transferFrom(owner.address, user2.address, 10000)).to.be.revertedWith("Not enough allowance");
  });
});

describe("Vault", function () {
  async function deployContract() {
    let contractList = [
      "Mytoken",
      "Vault"
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

  it("Should fine to mint and deposit", async function () {
    let contracts = await deployContract();
    const token = contracts.Mytoken;
    const vault = contracts.Vault;
    const tokenAddress = contracts.Mytoken.address;
    const [owner, user1, user2] = await ethers.getSigners();

    await token.mintToken(owner.address, 100000);
    expect(await token.balanceOf(owner.address)).to.equal("100000");

    await token.mintToken(user1.address, 100000);
    await token.mintToken(user2.address, 100000);


    // without allowance
    await expect(vault.deposit(tokenAddress, 100000, { from: owner.address })).to.be.revertedWith("Not enough allowance");

    await token.approve(vault.address, 100000, { from: owner.address });
    await vault.deposit(tokenAddress, 100000, { from: owner.address });

    expect(await token.balanceOf(vault.address)).to.equal("100000");
    expect(await vault.getBalanceOf(tokenAddress, owner.address)).to.equal("100000");
    expect(await vault.getBalanceOf(tokenAddress, owner.address)).to.equal(await vault.getBalanceTotal(tokenAddress));


    await token.connect(user1).approve(vault.address, 100000);
    await vault.connect(user1).deposit(tokenAddress, 100000);

    expect(await token.balanceOf(vault.address)).to.equal("200000");
    expect(await vault.getBalanceOf(tokenAddress, user1.address)).to.equal("100000");
    expect(
      parseInt(await vault.getBalanceOf(tokenAddress, user1.address)) +
      parseInt(await vault.getBalanceOf(tokenAddress, owner.address)))
      .to.equal(
        parseInt(await vault.getBalanceTotal(tokenAddress))
      );
  })


  it("Should fine to mint and withdraw", async function () {
    let contracts = await deployContract();
    const token = contracts.Mytoken;
    const vault = contracts.Vault;
    const tokenAddress = contracts.Mytoken.address;
    const [owner, user1, user2] = await ethers.getSigners();

    await token.mintToken(owner.address, 100000);
    expect(await token.balanceOf(owner.address)).to.equal("100000");

    await expect(vault.deposit(tokenAddress, 100000, { from: owner.address })).to.be.revertedWith("Not enough allowance");

    await token.approve(vault.address, 100000, { from: owner.address });
    await vault.deposit(tokenAddress, 100000, { from: owner.address });

    expect(await token.balanceOf(vault.address)).to.equal("100000");
    expect(await vault.getBalanceOf(tokenAddress, owner.address)).to.equal("100000");
    expect(await vault.getBalanceOf(tokenAddress, owner.address)).to.equal(await vault.getBalanceTotal(tokenAddress));

    expect(await token.balanceOf(owner.address), "owner balance").to.equal("0");
    let balance = await vault.getBalanceOf(tokenAddress, owner.address)
    console.log(balance);
    expect(balance).to.equal("100000");

    console.log("withdraw all balance");
    await vault.withdraw(tokenAddress, balance);
    expect(await token.balanceOf(owner.address), "owner balance now").to.equal("100000")


    


  });

})