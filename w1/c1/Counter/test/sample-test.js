const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  it("Should return the new value once it selfincreased", async function () {
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy();
    await counter.deployed();

    expect(await counter.counter()).to.equal("0");

    const selfincreased = await counter.selfIncrement();

    // wait until the transaction is mined
    await selfincreased.wait();

    expect(await counter.count()).to.equal("1");

    const selfincreased2 = await counter.increment("2");
    await selfincreased2.wait();

    expect(await counter.count()).to.equal("3");
  });
  it("Should return the new value once it decrement", async function () {
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy();
    await counter.deployed();

    expect(await counter.counter()).to.equal("0");

    const selfincreased = await counter.selfIncrement();

    // wait until the transaction is mined
    await selfincreased.wait();

    expect(await counter.count()).to.equal("1");

    const selfincreased2 = await counter.decrement("1");
    await selfincreased2.wait();

    expect(await counter.count()).to.equal("0");
  });
});
