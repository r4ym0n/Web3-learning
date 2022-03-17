import { useEffect, useState } from "react";
import { ethers } from "ethers";
const { abi } = require('./abi.json')

function W3Token(props) {
    let web3 = props.web3
    const [account, setAccount] = useState(null);
    const [token, setToken] = useState({});


    useEffect(() => {
        // 初始化web3
        w3DataInitial(web3).then(() => {

        })


    }, [])

    async function w3DataInitial(w3) {
        let tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const token = new ethers.Contract(tokenAddress, abi, w3);
        setToken(token);
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
            setAccount({
                address: address,
            })
            return address
        }).then(address => {
            console.log(address);
            (updeteAccountInfo(address))
            return address
        }).then(address => {
            updateTokenInfo(address)
        })

    }
    async function disconnectWallet() {
        setAccount(null)
    }

    async function updeteAccountInfo(address) {
        let balanceBigint = await web3.getBalance(address)
        let balance = ethers.utils.formatEther(balanceBigint)
        console.log(balance);
        setAccount(prevState => { return { ...prevState, balance: balance } })
        console.log(account);
    }
    function updateTokenInfo(address) {
        token.balanceOf(address).then((res) => {
            console.log(res);
            // force update
            setAccount(prevState => {
                return {
                    ...prevState,
                    balance: res.toString()
                }
            })
        })

    }

    function AccountInfo(props) {

        return (
            <div className="token-tab">
                <h4>Account: {props.account.address}</h4>
                <ul>
                    <li> balance: {props.account.balance} ETH</li>
                    <li> token: {props.token.address}</li>
                    <li> token balance {props.account.tokenBalance}</li>
                </ul>

                {/* <input placeholder="token address" value={props.tokenAddress} onChange={(e) => {
                    console.log(e.target.value);
                    props.setTokenAddress(e.target.value)
                }} /> */}
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
                ></AccountInfo>
            }
        </div>
    );

}

export default W3Token;;
