import W3info from "./W3info";
import W3Token from "./W3Token";
import { ethers } from "ethers";
import { useEffect, useState } from "react"

import './App.css';


function App() {
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    function initWeb3() {
      // this is a hack to get around the fact that the Metamask injected web3
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        console.log("web3 already injected");
        // const provider = new ethers.providers.JsonRpcProvider({url: "http://localhost:8545"});
        window.web3 = provider;
        setWeb3(provider);

      } else {
        const provider = new ethers.providers.JsonRpcProvider({
          url: "ws://localhost:8545"
        });

        console.log("web3 injected");
        setWeb3(provider);
      }
    }
    initWeb3();
    return function cleanup() {
      // 取消订阅
      if (window.web3) {
        window.web3.off()
        console.log('Successfully unsubscribed!');
      }
    }

  }, [])

  return (
    <div className="App">
      <header className="App-header">
        {web3 === null ?
          <div>Loading...</div>:
          <W3info web3={web3} ></W3info> 
        }

        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {web3 === null ?
          <div>Loading...</div>:
          <W3Token web3={web3}></W3Token> 
        }

      </header>
    </div>
  );
}

export default App;
