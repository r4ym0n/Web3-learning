import { useEffect, useState } from "react";
import { ethers } from "ethers";
const { abi:tokenAbi } = require('./abi/Mytoken.json')
const {  abi:vaultAbi } = require('./abi/Vault.json')

function W3Token(props) {
    let web3 = props.web3
    const [account, setAccount] = useState(null);
    const [token, setToken] = useState({});
    const [vault, setVault] = useState({});
    const [tokenInfo, setTokenInfo] = useState({});

    useEffect(() => {
        // 初始化web3
        w3DataInitial(web3).then(() => {

        })


    }, [])

    async function w3DataInitial(w3) {
        let tokenAddress = "0xE6e05cBE654E4F10cCF70c97cC9c522E63004D20";
        let vaultAddress = "0x4761BB788840323297Fcb8b8519d65Ec2dAA28C6";
        const token = new ethers.Contract(tokenAddress, tokenAbi, w3);
        const vault = new ethers.Contract(vaultAddress, vaultAbi, w3);

        token.metadata = {}
        vault.metadata = {}
        // token.metadata.name = await token.name();
        // token.metadata.symbol = await token.symbol();
        // token.metadata.decimals = await token.decimals();
        token.metadata.totalSupply = (await token.totalSupply()).toString();
        vault.metadata.totalBalance = (await vault.getBalanceTotal(tokenAddress)).toString();
        web3.on(token.filters.Transfer(), (err, event) => {
            if (err) {
                console.log(err);
            } else {
                connectWallet()
                console.log(event);
            }
        });

        

        setToken(token);
        setVault(vault);
        console.log(token);
    }


    async function connectWallet() {
        // 连接钱包
        let command = ""
        if (web3.connection.url.indexOf('metamask') > -1) {
            command = "eth_requestAccounts"
        } else {
            command = "eth_accounts"
        }
        return web3.send(command, []).then((res) => {
            let address = res[0]
            console.log("wallet connected to " + address);
            let tmpAccount = {
                address: address,
            }
            return tmpAccount;
        }).then(account => {
            console.log(account.address);
            return account
        }).then(account => {
            return (updeteAccountInfo(account))
        }).then(account => {
            return updateTokenInfo(account)
        }).catch(err => {
            console.log(err);
        })
    }
    
    
    async function updeteAccountInfo(account) {
        let balanceBigint = await web3.getBalance(account.address)
        let balance = ethers.utils.formatEther(balanceBigint)
        account.balance = balance
        // setAccount(account)

        // setAccount(prevState => { return { ...prevState, balance: balance } })

        console.log(account);
        return account
    }

    async function updateTokenInfo() {
        token.metadata.totalSupply = (await token.totalSupply()).toString();
        setToken(token);
    }

    function updateTokenInfo(account) {
        return token.balanceOf(account.address).then((res) => {
            console.log(res);
            account.tokenBalance = res.toString()
            setAccount(account)
            console.log(account);
            return account
            // force update
            // setAccount(prevState => {
            //     return {
            //         ...prevState,
            //         balance: res.toString()
            //     }
            // })
        })
    }

    async function disconnectWallet() {
        setAccount(null)
    }
    async function mintToken() {
        const singer = web3.getSigner();
        return await token.connect(singer).mintToken(account.address, 10000,{gasLimit: 1000000})
    }

    async function depositToken() {
        const singer = web3.getSigner();
        await token.connect(singer).approve(vault.address, 100000, {gasLimit: 1000000})
        return await vault.connect(singer).deposit(token.address, 10000,{gasLimit: 1000000})
    }
    async function withdrawToken() {
        const singer = web3.getSigner();
        return await vault.connect(singer).withdraw(token.address, 10000,{gasLimit: 1000000})
    }
    function AccountInfo(props) {

        return (
            <div className="token-tab">
                Account
                <ul>
                    <li> Account: {props.account.address}</li>
                    <li> balance: {props.account.balance} ETH</li>
                </ul>
                <hr></hr>
                Token
                <ul>

                <li> token: {props.token.address}</li>
                    <li> token balance: {props.account.tokenBalance}</li>
                    <li> token totalSupply: {props.token.metadata.totalSupply}</li>
                </ul>
                <button onClick={mintToken}>mint</button>
                {/* <input> </input> */}
                {/* <button onClick={disconnectWallet}>Transfer</button> */}

                <hr></hr>
                Vault
                <ul>
                    <li> address: {props.vault.address} </li>
                    <li> token: {props.token.address}</li>
                    <li> vault balance: {props.vault.metadata.totalBalance}</li>
                    {/* <li> token totalSupply: {props.token.metadata.totalSupply}</li> */}
                </ul>
                <button onClick={depositToken}> deposit</button>
                <button onClick={withdrawToken}> withdraw</button>

                {/* <input placeholder="token address" value={props.tokenAddress} onChange={(e) => {
                    console.log(e.target.value);
                    props.setTokenAddress(e.target.value)
                }} /> */}
                <hr></hr>
                <br></br>
                <button onClick={disconnectWallet}>disconnect wallet</button>

            </div>
        )
    }

    return (
        <div className="App">
            {account === null ?
                <button onClick={connectWallet}>Connect Wallet</button> :
                <AccountInfo account={account}
                    token={token}
                    vault={vault}
                ></AccountInfo>
            }
        </div>
    );

}

export default W3Token;;
