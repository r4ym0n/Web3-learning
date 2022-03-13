//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Mytoken {
    string symbol = "MYT";
    string name = "MyToken";
    uint256 decimals = 18;
    uint256 totalSupply;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowences;

    constructor() public {
        totalSupply = 1000000 * (10 ** decimals);
        balances[msg.sender] = totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0));
        require(_value <= balances[msg.sender], "Not enough balance");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        return true;
    }
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0));
        require(_value <= allowences[_from][msg.sender], "Not enough allowance");
        require(_value <= balances[_from], "Not enough balance");
        balances[_from] -= _value;
        balances[_to] += _value;
        allowences[_from][msg.sender] -= _value;
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        // require(_value <= balances[msg.sender], "Not enough balance");
        allowences[msg.sender][_spender] = _value;
        return true;
    }
}

