//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./libs/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./libs/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "./libs/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "./libs/v2-core/contracts/interfaces/IUniswapV2Router01.sol";


interface IERC20 {
    function balanceOf(address _owner) external view returns (uint256);
    function transfer(address _to, uint256 _value) external returns (bool);
    function allowance(address _owner, address _spender) external view returns (uint256);
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool);
    function approve(address _spender, uint256 _value) external returns (bool);
}

contract MyTokenMarket {

    address public myToken;

    constructor (address _token) public {
        myToken = _token;
    }

    using SafeMath for uint;
    mapping(address => uint) public balances;
    
    event Deposit(address _from, uint _value);
    event Withdraw(address _from, uint _value);

    
    function addLiquidity(uint _amount) public payable {
        require(_amount > 0);
        require(balances[msg.sender] >= _amount);
        balances[msg.sender] -= _amount;
        balances[myToken] += _amount;

        IERC20(myToken).transferFrom(msg.sender, address(this), _amount);
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