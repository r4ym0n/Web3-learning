//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./libs/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./libs/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./libs/@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./libs/@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "./libs/@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "./libs/@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";

contract MyTokenMarket {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address public myToken;
    address public myUniswapFactory;
    address public myUniswapPair;
    address public myUniswapRouter;
    address public weth;

    constructor(
        address _token,
        address _uniswapFactory,
        address _uniswapRouter,
        address _weth
    ) {
        myToken = _token;
        myUniswapFactory = _uniswapFactory;
        myUniswapRouter = _uniswapRouter;
        weth = _weth;
    }

    function addLiquidity(uint256 _amount) public payable {
        IERC20(myToken).transferFrom(msg.sender, address(this), _amount);
        // approve uniswap router to spend _amount
        IERC20(myToken).approve(myUniswapRouter, _amount);
        IUniswapV2Router01(myUniswapRouter).addLiquidityETH{value: msg.value}(
            myToken,
            _amount,
            0,
            0,
            msg.sender,
            block.timestamp + 3600
        );
    }

    function buyToken() public payable {
        // approve uniswap router to spend _amount
        IERC20(myToken).approve(myUniswapRouter, msg.value);
        address[] memory _path = new address[](2);
        _path[0] = weth;
        _path[1] = myToken;
        IUniswapV2Router01(myUniswapRouter).swapExactETHForTokens{value: msg.value}(
            0,
            _path,
            msg.sender,
            block.timestamp + 3600
        );
    }

    function sellToken(uint256 _amount) public {
        IERC20(myToken).transferFrom(msg.sender, address(this), _amount);
        address[] memory _path = new address[](2);
        _path[0] = myToken;
        _path[1] = weth;
        IUniswapV2Router01(myUniswapRouter).swapExactTokensForETH(
            _amount,
            0,
            _path,
            msg.sender,
            block.timestamp + 3600
        );
    }
}
