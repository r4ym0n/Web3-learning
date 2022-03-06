//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract Bank {
    using SafeMath for uint;
    mapping(address => uint) public balances;
    
    event Deposit(address _from, uint _value);
    event Withdraw(address _from, uint _value);

    address public _owner;

    constructor()  {
        _owner = msg.sender;
        console.log("Bank created");
    }


    modifier onlyOwner {
        require(msg.sender == _owner, "Only owner can call this function"); 
        _;
    }

    function balanceOf(address addr) public view returns (uint) {
        return balances[addr];
    }

    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }
    
    function getTotalBalance() public view returns (uint) {
        console.log("total balance: %s", address(this).balance);
        return address(this).balance;
    }

    function deposit() payable public {
        balances[msg.sender] = balances[msg.sender].add(msg.value);
        console.log("Money saved: %s", msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    receive() payable external  {
        balances[msg.sender] = balances[msg.sender].add(msg.value);
        console.log("Money saved: %s", msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    // function depositToken(address tokenAddr, uint value) public {
    //     balances[msg.sender] += value;
    //     console.log("Money saved: ");
    //     emit Deposit(msg.sender, value);
    // }

    function withdraw(uint value) public {
        address mAddress = address(this);
        address payable to = payable(msg.sender);
        console.log("deposited : %s", balances[to]);
        console.log("total : %s", mAddress.balance);
        require(balances[to] >= value, "Account Insufficient funds");
        require(mAddress.balance >= value, "Contract Insufficient funds");
        balances[to] = balances[to].sub(value);
        to.transfer(value);
        console.log("Money withdrawn %s", value);
        emit Withdraw(msg.sender, value);
    }
    
    function withdrawAll() onlyOwner public {
        address mAddress = address(this);
        address payable to = payable(msg.sender);
        require(mAddress.balance >= 0, "Insufficient funds");
        console.log("Money withdrawn %s", mAddress.balance);
        to.transfer(mAddress.balance);
        console.log("Money rest %s", mAddress.balance);

        emit Withdraw(msg.sender, mAddress.balance);
    }
}