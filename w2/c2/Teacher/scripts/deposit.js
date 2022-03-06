// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
    if (hre.network.name !== "localhost") {
        console.log("This script is only for the hardhat network");
        process.exit(1);
    }
    
    console.log("owner:", owner.address);
    console.log("second:", second.address);
    let contractAddr = "0xD84379CEae14AA33C123Af12424A37803F885889"
    bank = await hre.ethers.getContractAt("Bank", contractAddr, owner);

    console.log("contract owner:", await bank._owner());

    console.log("bank value:", await bank.getBalance(), await owner.getBalance());
    await bank.deposit({value: 1000000, from: owner.address});
    console.log("deposit: ", await bank.getBalance(), await owner.getBalance());
    
    await bank.deposit({value: 1000000, from: second.address});
    console.log("deposit: ", await bank.getBalance(), await owner.getBalance());
    
    // await owner.sendTransaction({to: contractAddr, value: 1000000});
    // console.log("bank value:", await bank.getBalance(), await owner.getBalance());

    // console.log('the balance of the second account:', await bank.balanceOf(owner.address));
    // console.log('the balance of the second account:', await bank.balanceOf(second.address));
    
    await bank.withdraw(100000, {from: owner.address});
    console.log("withdraw 100000:", await bank.getBalance(), await owner.getBalance());

    await bank.withdrawAll();
    console.log("withdraw all:", await bank.getTotalBalance(), await owner.getBalance());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
