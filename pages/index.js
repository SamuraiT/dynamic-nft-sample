import React, { useEffect, useState } from "react"
import {
  Divider,
  Grid,
  Button,
  Header,
  Container,
  Input,
  Radio
} from 'semantic-ui-react'
const { Row, Column } = Grid

import { ethers } from "ethers"
import dynamic from 'next/dynamic'
import DynamicNFT from "../artifacts/matic/contracts/DynamicNFT.sol/DynamicNFT.json"

import SketchColorPicker from "../components/SketchColorPicker"
import {
  base64,
  ShowSVGImage,
  baseSvgSrc
} from "../components/utils"
const maticChainId = "0x89"

const switchMaticNetwork = async () => {
  try {

    const { ethereum } = window
    if (!ethereum) {
      console.log("Install metamask")
      return;
    }
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log(chainId)
    if (chainId != maticChainId) {
      const result = await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: maticChainId}],
      })
      console.log(result)
    }
  } catch (e) {
    console.error(e)
  }
}
const ConnectWallet = ({setAcount}) => {
  return (
      <Button onClick={() => connectWallet(setAcount)}>
      connect wallet
      </Button>
  )
}

const setWalletAccountIfConnected = async (setAccount, CONTRACT_ADDRESS) => {
  const { ethereum } = window;

  if (!ethereum) {
    console.log("Install metamask")
  }

  const accounts = await ethereum.request({method: "eth_accounts"})
  setAccount(accounts[0])
}

const getDataURI = async (tokenId, CONTRACT_ADDRESS) => {
  try {
    const { ethereum } = window
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, DynamicNFT.abi, signer)
      const dataURI = await contract.tokenURI(tokenId)
      return dataURI
    }
  } catch (e) {
    console.log(e)
    return;
  }
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

const mintNft = async (ownersMsg, viewableMsg, textColor, backgroundColor, setLoading, setTokenId, CONTRACT_ADDRESS) => {
  if (!viewableMsg || !ownersMsg) {
    alert('enter messages')
    return
  }
  setLoading(true)
  console.log(viewableMsg, ownersMsg)
  try {
    const { ethereum } = window
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, DynamicNFT.abi, signer)

      let tx = await contract.makeDyamicNFT(ownersMsg, viewableMsg, textColor, backgroundColor)
      const logs = await tx.wait()
      setTokenId(logs.events[0].args.tokenId.toNumber())
      alert("Tada! 🎉 check your account in opensea! https://opensea.io/ , it takes 5, 10min to dipct")
    }
  } catch (e) {
    console.log(e)
  }
  setLoading(false)
}

const Home = ({NETWORK}) => {
  const [account, setAcount] = useState()
  const [viewableMsg, setViewableMsg] = useState("")
  const [ownersMsg, setOwnersMsg] = useState("")
  const [loading, setLoading] = useState(false)
  const [tokenId, setTokenId] = useState()
  const [dataURI, setDataURI] = useState()
  const [textColor, setTextColor] = useState("rgb(256,256,256)")
  const [backgroundColor, setBackgroundColor] = useState("rgb(0,0,0)")
  const [preview, setPreviewImage] = useState()
  const [option, setOption] = useState('owner')

  const CONTRACT_ADDRESS = NETWORK == "matic"  ? "0x7Dff3728DD7dDa7619053cFCac9f136cb654eACc" : "0xD45D2Ca7295da5BF2D1419cdAaCA8B62d67f735B"
  console.log(CONTRACT_ADDRESS)
  useEffect(() => {
    setWalletAccountIfConnected(setAcount, CONTRACT_ADDRESS)
    switchMaticNetwork()
  }, [account])

  useEffect(async() => {
    setDataURI(await getDataURI(tokenId, CONTRACT_ADDRESS))
  }, [tokenId])

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
                <Input placeholder='' row={100} onChange={({target}) => setOwnersMsg(target.value)} value={ownersMsg}/>
              </div>
              <div>
                <p>A message others can see: </p>
                <Input placeholder='' row={100} onChange={({target}) => setViewableMsg(target.value)} value={viewableMsg}/>
              </div>
              <div>
                <div style={{marginTop: '10px', paddingTop: "10px"}}>
                  <span>pick up background color: </span>
                  <SketchColorPicker color={backgroundColor} setColor={setBackgroundColor}/>
                </div>
              </div>

              <div>
                <div style={{marginTop: '10px', paddingTop: "10px"}}>
                  <span>pick up text color: </span>
                  <SketchColorPicker color={textColor} setColor={setTextColor}/>
                </div>
              </div>
              <div style={{marginTop: 15}} />
              <div>
                <p>preview by: {option}</p>
                 <Radio
                    label='owners message'
                    name='option'
                    value='owner'
                    checked={option === 'owner'}
                    onChange={(e, {value}) => setOption(value)}
                  />
                 <Radio
                    label='viewers message'
                    name='option'
                    value='viewer'
                    checked={option === 'viewer'}
                    onChange={(e, {value}) => setOption(value)}
                  />

                <img src={baseSvgSrc(option == 'owner' ? ownersMsg : viewableMsg, backgroundColor, textColor)} />
              </div>
              <Button onClick={() => mintNft(ownersMsg, viewableMsg, textColor, backgroundColor, setLoading, setTokenId, CONTRACT_ADDRESS)} color='teal' size="large" loading={loading} style={{marginTop: "10px"}}>
               mint it
              </Button>
              </>
            ) }

              <p style={{marginTop: "15px"}}>
                Build with❤️  <a href="https://github.com/SamuraiT">yasek</a>. Check out the code <a href="https://github.com/SamuraiT/dynamic-nft-sample">here</a>
              </p>
            <Divider horizontal>
              <Header as='h4'>
                Show Image of TokenId
              </Header>
            </Divider>
            <p>Enter Token ID (must be a number)</p>
            <input value={tokenId} onChange={({target}) => setTokenId(target.value)} />
            { tokenId && <p><a href={`https://opensea.io/assets/matic/${CONTRACT_ADDRESS}/${tokenId}`} target="_blank" rel="noreferrer"> Check NFT in Opeansea</a></p> }
            { dataURI && <ShowSVGImage dataURI={dataURI} /> }
          </Container>
        </Column>
      </Row>
    </Grid>
  )
}
export async function getStaticProps() {
  const NETWORK = process.env.NETWORK
  return {
    props: {
      NETWORK
    }
  }
}

export default Home;
