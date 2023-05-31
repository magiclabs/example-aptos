import { useState, useEffect, FormEvent } from 'react'
import { Magic } from 'magic-sdk';
import { AptosExtension, MagicAptosWallet } from '@magic-ext/aptos';
import { AuthExtension } from '@magic-ext/auth';
import { AptosClient, CoinClient, FaucetClient } from 'aptos'

import magicLogo from './assets/magic.svg'
import reactLogo from './assets/react.svg'
import aptosLogo from './assets/aptos.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AccountInfo } from '@aptos-labs/wallet-adapter-core';

const DEVNET_NODE_URL = 'https://fullnode.testnet.aptoslabs.com';
const DEVNET_FAUCET_URL = 'https://faucet.testnet.aptoslabs.com';

const MAGIC_WALLET_ADDRESS = '0x906fd65afe31b7237cd4d7c4073d8bf76c61b6a24ec64dd26f0c16de5c2444d5'
const SAMPLE_RAW_TRANSACTION = {
  function: "0x1::coin::transfer",
  type_arguments: ["0x1::aptos_coin::AptosCoin"],
  arguments: [MAGIC_WALLET_ADDRESS, 1000]
}

const magic = new Magic(import.meta.env.VITE_MAGIC_API_KEY, {
  endpoint: 'http://localhost:3014/',
  extensions: [
    new AuthExtension(),
    new AptosExtension({
      nodeUrl: DEVNET_NODE_URL
    }),
  ]
});

const magicAptosWallet = new MagicAptosWallet(magic, {
  loginWith: 'magicLink',
})

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [balance, setBalance] = useState(BigInt(0));

  const [resultA, setResultA] = useState<any>("")
  const [resultB, setResultB] = useState<any>("")

  useEffect(() => {
    magic.user.isLoggedIn().then((async (magicIsLoggedIn: boolean) => {
      setIsLoggedIn(magicIsLoggedIn)
      if (magicIsLoggedIn) {
        const accountInfo = await magicAptosWallet.account()
        setAccountInfo(accountInfo)
        getBalance(accountInfo.address)
      }
    }))
  }, [isLoggedIn])

  const handleConnect = async (e: FormEvent) => {
    e.preventDefault();

    await magicAptosWallet.connect();
    setIsLoggedIn(true);
  };

  const handleDisconnect = async () => {
    await magicAptosWallet.disconnect();
    setIsLoggedIn(false);
  }

  const handleSignAndSubmitTransaction = async () => {
    const result = await magicAptosWallet.signAndSubmitTransaction(SAMPLE_RAW_TRANSACTION)
    setResultA(result)
  }

  const handleSignMessage = async () => {
    if (!accountInfo) {
      console.warn('No account')
      return
    }
  
    const result = await magicAptosWallet.signMessage({
      message: 'Hello World',
      nonce: 2,
    })
    setResultB(result)
  }

  const faucetFiveCoins = async () => {
    if (!accountInfo) {
      console.warn('No account')
      return
    }

    const faucetClient = new FaucetClient(DEVNET_NODE_URL, DEVNET_FAUCET_URL)
    await faucetClient.fundAccount(accountInfo.address, 100_000_000)

    await getBalance(accountInfo.address)
  }

  const getBalance = async (address: string) => {
    const client = new AptosClient(DEVNET_NODE_URL);
    const coinClient = new CoinClient(client);

    const balance = await coinClient.checkBalance(address)
    setBalance(balance)
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={magicLogo} className="logo magic" alt="Magic logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={aptosLogo} className="logo aptos" alt="Aptos logo" />
        </a>
      </div>

      <h1>Vite + React + Magic + Aptos</h1>

      <div className="container">
        <h2>Environment</h2>
        <pre className="code">
          Network: devnet<br />
          NODE_URL: {DEVNET_NODE_URL}<br />
          FAUCET_URL: {DEVNET_FAUCET_URL}
        </pre>
      </div>

      <div className="card">
        {isLoggedIn ? (
          <>
          <button onClick={handleDisconnect}>Disconnect</button>
          <div style={{ width: '700px', overflow: 'hidden', textAlign: 'start' }}> 
            <h2>Account Info</h2>
            <pre className="code">{JSON.stringify(accountInfo, null, 2)}</pre>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Balance: {balance?.toString() ?? '0'} coins</h3>
              {accountInfo && <button onClick={() => getBalance(accountInfo.address)}>Get Balance</button>}
            </div>
            <button style={{ width: '100%' }} onClick={faucetFiveCoins}>💵💵💵 Get 100,000,000 coins from the Faucet 💵💵💵</button>

            <div className="divider" />

            <h2>Transaction</h2>
            <p>Let's send a transaction with MagicAptosWallet.</p>
            <p className="notice">Notice. Before you start, please get some coins with the above faucet.</p>

            <p>This is sample data that sends 1,000 coins to Magic.</p>
            <pre className='code'>
              {JSON.stringify(SAMPLE_RAW_TRANSACTION, null, 2)}
            </pre>
            <button onClick={handleSignAndSubmitTransaction}>signAndSubmitTransaction</button>
            <pre className='code'>
              {JSON.stringify(resultA, null, 2)}
            </pre>
            <button onClick={handleSignMessage}>signMessage</button>
            <pre className='code'>
              {JSON.stringify(resultB, null, 2)}
            </pre>
          </div>
          </>
        ) : (
          <form className="container" onSubmit={handleConnect}>
            <h3>Please sign up or login</h3>
            <div className="row">
              <button type="submit">Connect</button>
            </div>
          </form>
        )}
      </div>

      <div className="card">
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  )
}

export default App
