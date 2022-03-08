//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract Scores {
    address public _owner;
    mapping (address => uint) public scores;
    constructor() public {
        _owner = msg.sender;
    }

    modifier onlyOwner {
        require(_owner == msg.sender);
        _;
    }
    
    function setScore(address studentAddr,uint _score) onlyOwner public {
        require(_score > 0);
        scores[studentAddr] = _score;
    }

    function getScore(address studentAddr) public view returns (uint){
        return scores[studentAddr];
    }

}

interface Iscore{
    function setScore(address studentAddr,uint _score) external;
    function getScore(address studentAddr) view external returns (uint);
}

contract Teacher {
    mapping (address => bool) public teacherRegister;
    address public _owner;
    address scoreAddr;
    constructor() public {
        _owner = msg.sender;
        registNewTeacher(_owner);
        scoreAddr = address(new Scores());

    }

    function isTeacher(address _teacherAddr) public view returns (bool) {
        return teacherRegister[_teacherAddr];
    }

    function registNewTeacher(address _teacherAddr) public onlyOwner {
        teacherRegister[_teacherAddr] = true;
    }

    function unregistTeacher(address _teacherAddr) public onlyOwner {
        teacherRegister[_teacherAddr] = false;
    }

    modifier onlyOwner {
        require(msg.sender == _owner, "Only owner can call this function");
        _;
    }

    modifier onlyTeacher {
        require(isTeacher(msg.sender), "Only teacher can call this function");
        _;
    }

    function setScore(address studentAddr,uint _score) onlyTeacher public {
        Iscore(scoreAddr).setScore(studentAddr,_score);
    }

    function getScore(address studentAddr) onlyTeacher public view returns (uint){
        return Iscore(scoreAddr).getScore(studentAddr);
    }

    
}