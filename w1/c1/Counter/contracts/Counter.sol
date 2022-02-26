//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Counter {
    uint public counter;

    constructor()  {
        console.log("Counter constructor");
        counter = 0;
        
    }
    function count() public view returns (uint) {
        return counter;
    }

    function selfIncrement() public {
        counter++;
    }

    function selfDecrement() public {
        counter--;
    }
    function increment(uint amount) public {
        if (amount < 1) return;
        counter += amount;
    }
    function decrement(uint amount) public {
        counter -= amount;
    }
}