//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Mytoken {
    string symbol = "MYT";
    string name = "MyToken";
    uint256 decimals = 18;
    uint256 _totalSupply = 0;
    address owner ;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);
    
    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can do this");
        _;
    }

    constructor() {
        owner = msg.sender;
        // totalSupply = 1000000 * (10 ** decimals);
        _totalSupply = 0 * (10 ** decimals);

        balances[msg.sender] = _totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }
    function totalSupply() public view returns (uint256 supply) {
        return _totalSupply;
    }
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0));
        require(_value <= balances[msg.sender], "Not enough balance");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0));
        require(_value <= allowances[_from][msg.sender], "Not enough allowance");
        require(_value <= balances[_from], "Not enough balance");
        balances[_from] -= _value;
        balances[_to] += _value;
        allowances[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        // require(_value <= balances[msg.sender], "Not enough balance");
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowances[_owner][_spender];
    }

    function burn(uint256 _value) onlyOwner public returns (bool success) {
        require(balances[owner] >= _value);
        balances[owner] -= _value;
        _totalSupply -= _value;
        emit Burn(owner, _value);
        return true;
    }
    // burn token of user
    function burnFrom(address _from, uint256 _value) onlyOwner public returns (bool success) {
        require(balances[_from] >= _value);
        require(_value <= allowances[_from][owner]);
        balances[_from] -= _value;
        allowances[_from][owner] -= _value;
        _totalSupply -= _value;
        emit Burn(_from, _value);
        return true;
    }
    
    function mintToken(address target, uint256 mintedAmount) onlyOwner public {
        balances[target] += mintedAmount;
        _totalSupply += mintedAmount;
        emit Transfer(address(0), address(this), mintedAmount);
        emit Transfer(address(this), target, mintedAmount);
    }
    
    function mint(address _to, uint256 _value) onlyOwner public returns (bool success) {
        require(_value <= _totalSupply);
        balances[_to] += _value;
        _totalSupply += _value;
        emit Mint(_to, _value);
        console.log("mint", _to, _value);
        return true;
    }

    function AirDrop(address[] memory _recipients, uint _values) onlyOwner public returns (bool) {
        require(_recipients.length > 0, "Recipients must be an array of addresses");
        for(uint j = 0; j < _recipients.length; j++){
            transfer(_recipients[j], _values);
        }
        return true;
    }

}

