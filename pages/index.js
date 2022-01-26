import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from "react";

import { ethers } from "ethers";
import DynamicNFT from "../artifacts/contracts/DynamicNFT.sol/DynamicNFT.json"

const CONTRACT_ADDRESS = "0xd118aBbCB4E31d20aacD9EFE22185a01cc1a14d9"

const ConnectWallet = ({setAcount}) => {
  return (
      <button onClick={() => connectWallet(setAcount)}>
      connect wallet
      </button>
  )
}
const setWalletAccountIfConnected = async (setAccount) => {
  const { ethereum } = window;

  if (!ethereum) {
    console.log("Install metamask")
  }

  const accounts = await ethereum.request({method: "eth_accounts"})
  setAccount(accounts[0])
}

const connectWallet = async (setAccount) => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert("Install metamask")
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts"})
      setAccount(accounts[0])
    } catch (e) {
      console.error(e)
    }
}

const Home = () => {
  const [account, setAcount] = useState("")
  useEffect(() => {
    setWalletAccountIfConnected(setAcount)
  }, [])


  return (
    <>
    { account === "" ? (
      <ConnectWallet setAcount={setAcount}/>
    ) : (
      <button onClick={null}>
       mint it
      </button>
    ) }
    {account}
    </>
  )
}

export default Home;
