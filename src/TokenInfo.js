import React from 'react';
import { useState } from 'react';
import { ethers, utils } from "ethers";

function TokenInfo(props) {
  //State variables
  const [tokens, setTokens] = useState([])
  const [address, setAddress] = useState(props.defaultAccount);

  //Function to handle form submission
  const handleClick = (e) => {
    e.preventDefault();
    console.log(address, "clicked");
    setAddress(address);
    fetchTokens() 
    .then(data => {
      setTokens(data.result);
      console.log(tokens, data)
    })
    .catch(err => setTokens([]))
  }

  //Function to fetch tokens
  const fetchTokens = async () => {
    if (!utils.isAddress(address)){
      alert('Please enter a valid Ethereum wallet address')
      return;
    }
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER_URL);    
    const tokens = await provider.send("qn_getWalletTokenBalance", [
      {
        wallet: address,
      },
    ]); 
    return tokens;
  }

  //JSX code
  return(
    <div>
            <p>See tokens by inputting a valid Ethereum account</p>
            <input
                className="form-control address-input"
                onChange={e => (
                  setAddress(e.target.value))}
                type="text"
                placeholder="Enter an Ethereum address"
            />
            <button className="btn coin-btn" onClick={handleClick}> Show me the tokens 👀 </button>
        
        {tokens.length === 0 && <p>No tokens found for the given address</p>}
        {tokens.length > 0 && <p><span className="font-weight-bold">{address}</span> has {tokens.length} ERC20 token holdings on <span className="font-weight-bold">Sepolia:</span></p>}
        {tokens.length > 0 && 
        <table class="table table-info table-sm table-hover">
          <thead>
            <tr>
              <th scope="col">Symbol</th>
              <th scope="col">Name</th>
              <th scope="col">Balance</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <tr key={index}>
                <td>{token.symbol}</td>
                <td>{token.name}</td>
                <td>{utils.formatUnits(token.totalBalance, token.decimals)}</td>
              </tr>
            ))}  
        </tbody>
        </table>}
      </div>
  );
}

export default TokenInfo;
