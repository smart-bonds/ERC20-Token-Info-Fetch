import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TokenInfo from './TokenInfo';

export default function App() {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(newProvider);
      console.log(newProvider);

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    } else {
      setErrorMessage("Please install MetaMask");
    }

    // Cleanup the event listener on component unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      setDefaultAccount(null);
      setErrorMessage("Please connect to MetaMask");
    } else {
      setDefaultAccount(accounts[0]);
    }
  };

  const connectwalletHandler = async () => {
    if (!provider) {
      setErrorMessage("Provider is not initialized");
      return;
    }

    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      setDefaultAccount(accounts[0]);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <div className="container">
        <div class="row">
          <div class="col">
          <button className="btn coin-btn" onClick={connectwalletHandler}>Connect Wallet</button>
            {defaultAccount ? <p>Connected ✅</p> : <p>Not connected ❌</p>}
            {defaultAccount ? <p>Address: {defaultAccount}</p> : <p></p>} 
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </div>
        <div className="col">
            <img className="logo" src="./sblogo.png" alt="logo"/>
        </div>
      </div>
      </div>
      <div className="container">
        <TokenInfo defaultAccount={defaultAccount}/>
      </div>
    </>
  );
}