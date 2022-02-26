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
        console.log("Counter selfIncrement");
        counter++;
    }

    function selfDecrement() public {
        console.log("Counter selfDecrement");
        counter--;
    }
    function increment(uint amount) public {
        console.log("decrement");
        counter += amount;
    }
    function decrement(uint amount) public {
        console.log("decrement");
        if (amount < 1) return;
        counter -= amount;
    }
}