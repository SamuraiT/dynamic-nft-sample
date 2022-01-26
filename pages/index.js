import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from "react";
import { Grid, Button, Header, Container, Input } from 'semantic-ui-react'
const {Row, Column } = Grid

import { ethers } from "ethers";
import DynamicNFT from "../artifacts/contracts/DynamicNFT.sol/DynamicNFT.json"

const CONTRACT_ADDRESS = "0xd118aBbCB4E31d20aacD9EFE22185a01cc1a14d9"

const ConnectWallet = ({setAcount}) => {
  return (
      <Button onClick={() => connectWallet(setAcount)}>
      connect wallet
      </Button>
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
  const [account, setAcount] = useState()
  useEffect(() => {
    setWalletAccountIfConnected(setAcount)
  }, [])


  return (
    <Grid>
      <Row/>
      <Row/>
      <Row>
        <Column>
          <Container centered="true" text>
            <Header as='h1' icon='plug' content='Make and Mint your Original Dynamic NFT 🦄' />
            {account && <p>your wallet address: {account}</p>}
            { account == null ? (
              <ConnectWallet setAcount={setAcount}/>
            ) : (
              <>
              <div>
                <p>A message only owner of the NFT can see: </p>
                <Input placeholder='' row={100}/>
              </div>
              <div>
                <p>A message others can see: </p>
                <Input placeholder='' row={100}/>
              </div>
              <div style={{marginTop: 15}} />
              <Button onClick={null} color='teal' size="large">
               mint it
              </Button>
              </>
            ) }
          </Container>
        </Column>
      </Row>
    </Grid>
  )
}

export default Home;
