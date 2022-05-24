// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "hardhat/console.sol";
import "./libs/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./libs/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./libs/@openzeppelin/contracts/utils/Counters.sol";
import "./libs/@openzeppelin/contracts/access/Ownable.sol";
import "./libs/@openzeppelin/contracts/security/ReentrancyGuard.sol";



error LotteryError();

contract LuckyLottery is Ownable{
    using Counters for Counters.Counter;

    uint public joinFee;
    uint public playersPerRound;

    Counters.Counter public gameRound;
    Counters.Counter public joinedCounter;
    address[] public players;

    mapping (uint => address) public winnerOfRound;
    mapping (uint => uint) public prizeOfRound;

    event GameStarted(uint round);
    event GameEnded(uint round, address winner, uint winnerAmount);
    event PlayerJoined(address player, uint amount);
    event PlayerLeft(address player, uint amount);
    event PlayerWon(address player, uint amount);

    constructor () {
        console.log("Hello, world!");
        gameRound.reset();
        joinedCounter.reset();
        playersPerRound = 10;
        joinFee = 0.01 * 10 ** 18;
    }

    function setGameConfig(uint _playersPerRound, uint _joinFee) public onlyOwner {
        playersPerRound = _playersPerRound;
        joinFee = _joinFee;
    }

    function _fakeRandom() internal view returns (uint) {
        uint seed = block.number;
        uint randomNumber = uint(keccak256(abi.encodePacked(seed))) % playersPerRound;
        return randomNumber;
    }

    function genRandomNumber() public  view returns (uint) {
        return _fakeRandom();
    }

    function luckyDraw() internal {
        winnerOfRound[gameRound.current()] = players[genRandomNumber()];
        gameRound.increment();
        joinedCounter.reset();
        delete players;
    }

    function claimPrize(uint round) external {
        require(winnerOfRound[round] != address(0), "No winner yet");
        require(winnerOfRound[round] == msg.sender, "not the winner of this round");
        require(prizeOfRound[round] != 0, "no prize yet");
        payable(msg.sender).transfer(prizeOfRound[round]);
        prizeOfRound[round] = 0;
    }

    function _checkJoined(address player) internal view returns (bool) {
        for (uint i = 0; i < players.length; i++) {
            if (players[i] == player) {
                return true;
            }
        }
        return false;
    }

    function bet() public payable {
        require(msg.value >= joinFee, "You need to pay the join fee");
        require(_checkJoined(msg.sender) == true, "You have already joined");

        joinedCounter.increment();
        players.push(msg.sender);

        prizeOfRound[gameRound.current()] += msg.value;
        payable(msg.sender).transfer(joinFee);

        // Draw the winner
        if (joinedCounter.current() == playersPerRound) {
            luckyDraw();
        }
    }

    receive() external payable {        
        console.log("bet!");
        bet();
    }

    function winnerOfTheRound(uint round) public view returns (address) {
        return winnerOfRound[round];
    }

    function prizeOfTheRound(uint round) public view returns (uint) {
        return prizeOfRound[round];
    }

    function getGameRound() public view returns (uint) {
        return gameRound.current();
    }
}
