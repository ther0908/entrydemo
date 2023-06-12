import React, { useState } from 'react';
import { ethers } from "ethers";
import logo from './logo.svg';
import './App.css';

function App() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  const ConnectMetamask = async () => {
    if(window.ethereum) {
      try {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      } catch (error) {
        console.error(error);
        alert("连接MetaMask失败")
      }

    } else {
      alert('Meta Mask not detected');
    }
  };

  const TransferButton = async () => {
    // 检查连接状态
    if(!window.ethereum.selectedAddress){
      alert("请先连接钱包");
      return;
    }

    if(address && amount){
      try{
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // 判断是否处于Sepolia测试网链
        const network = await provider.getNetwork();
        if(network.chainId != 5){
          alert("请检查自己所处的网络");
          return;
        }

        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();
        
        await signer.sendTransaction({
          to: address,
          value: ethers.utils.parseEther(amount)
        })

      }catch(error){
        alert("转账失败")
        console.error("Failed to send transaction", error.message);
      }
    }

    else alert("请输入转账地址和金额");
  };

  return (
    <div className="App">
      <button onClick={ConnectMetamask}>Connect MetaMask</button>
      <div>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Value in ETH"
        />
      </div>
      <div>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Receiver Address"
        />
      </div>{' '}
      <button onClick={TransferButton}>Tranasfer</button>
    </div>
  );
}

export default App;
