//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address) external view returns (uint256);
    function transfer(address, uint256) external returns (bool);
    function transferFrom(address, address, uint256) external returns (bool);
}

contract Vault {
    using SafeMath for uint;
    mapping (address => bool) public supportedTokenMap;
    mapping (address => mapping (address => uint256)) public tokenBalances;

    event Deposit(address indexed token, address _from ,uint256 amount);

    constructor ( address[] memory _tokens) {
        supportedTokenMap[address(0)] = true;
        for (uint256 i = 0; i < _tokens.length; i++) {
            supportedTokenMap[_tokens[i]] = true;
        }
    }

    function deposit(address token, uint256 amount) public {
        require(supportedTokenMap[token]);
        require(amount > 0);
        require(IERC20(token).balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        tokenBalances[token][msg.sender] += amount;

        emit Deposit(token, msg.sender ,amount);
    }

    function withdraw(address token, uint256 amount) public {
        require(supportedTokenMap[token]);
        require(amount > 0);
        require(getBalanceOf(token, msg.sender) >= amount, "Insufficient balance");
        
        tokenBalances[token][msg.sender] -= amount;
        IERC20(token).transfer( msg.sender, amount);
    }

    function addToken(address token) public {
        supportedTokenMap[token] = true;
    }

    function removeToken(address token) public {
        supportedTokenMap[token] = false;
    }

    function isSupported(address token) public view returns (bool) {
        return supportedTokenMap[token];
    }

    function getBalanceTotal(address token) public view returns (uint256) {
        require(supportedTokenMap[token], "Token not supported");
        uint balance = IERC20(token).balanceOf(address(this));
        console.log("token balance %s", balance);
        return balance;
    }

    function getBalanceOf(address token, address user) public view returns (uint256) {
        require(supportedTokenMap[token], "Token not supported");
        return tokenBalances[token][user];
    }
    
}