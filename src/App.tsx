import { useState, useEffect, FormEvent } from 'react'
import { Magic } from 'magic-sdk';
import { AptosExtension } from '@magic-ext/aptos';
import { AptosClient, HexString, CoinClient, FaucetClient } from 'aptos'

import magicLogo from './assets/magic.svg'
import reactLogo from './assets/react.svg'
import aptosLogo from './assets/aptos.svg'
import viteLogo from '/vite.svg'
import './App.css'

const DEVNET_NODE_URL = 'https://fullnode.devnet.aptoslabs.com';
const DEVNET_FAUCET_URL = 'https://faucet.devnet.aptoslabs.com';

const JAY_WALLET_ADDRESS = '0x906fd65afe31b7237cd4d7c4073d8bf76c61b6a24ec64dd26f0c16de5c2444d5'
const SAMPLE_RAW_TRANSACTION = {
  function: "0x1::coin::transfer",
  type_arguments: ["0x1::aptos_coin::AptosCoin"],
  arguments: [JAY_WALLET_ADDRESS, 1000]
}

const magic = new Magic(import.meta.env.VITE_MAGIC_API_KEY, {
  endpoint: import.meta.env.VITE_MAGIC_ENDPOINT,
  extensions: [
    new AptosExtension({
      nodeUrl: DEVNET_NODE_URL
    }),
  ]
});

function App() {
  const [email, setEmail] = useState('')

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMetadata, setUserMetadata] = useState({});
  const [balance, setBalance] = useState(BigInt(0));

  const [walletAddress, setWalletAddress] = useState('')
  const [rawTransaction, setRawTransaction] = useState<any>()
  const [signedTransaction, setSignedTransaction] = useState('')
  const [transactionResult, setTransactionResult] = useState<any>('')

  useEffect(() => {
    magic.user.isLoggedIn().then((async (magicIsLoggedIn: boolean) => {
      setIsLoggedIn(magicIsLoggedIn)
      if (magicIsLoggedIn) {
        setUserMetadata(await magic.user.getInfo());
        setWalletAddress(await magic.aptos.getAccount());
      }
    }))
  }, [isLoggedIn])

  const login = async (e: FormEvent) => {
    e.preventDefault();

    await magic.auth.loginWithMagicLink({ email });
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await magic.user.logout();
    setIsLoggedIn(false);
  }

  const faucetFiveCoins = async () => {
    if (!walletAddress) {
      console.warn('No account')
      return
    }

    const faucetClient = new FaucetClient(DEVNET_NODE_URL, DEVNET_FAUCET_URL)
    await faucetClient.fundAccount(walletAddress, 100_000_000)

    await getBalance(walletAddress)
  }

  const getBalance = async (address: string) => {
    const client = new AptosClient(DEVNET_NODE_URL);
    const coinClient = new CoinClient(client); // <:!:section_1a

    const balance = await coinClient.checkBalance(address)
    setBalance(balance)
  }

  const generateTransaction = async () => {
    if (!walletAddress) {
      console.warn('No account')
      return
    }
    console.log(walletAddress)

    /* sign the transaction */
    const client = new AptosClient(DEVNET_NODE_URL);

    const rawTransaction = await client.generateTransaction(walletAddress, SAMPLE_RAW_TRANSACTION)
    setRawTransaction(rawTransaction)
  }

  const signTransaction = async () => {
    /* sign the transaction */
    const hexAddress = new HexString(walletAddress)

    const client = new AptosClient(DEVNET_NODE_URL);
    const rawTransaction = await client.generateTransaction(hexAddress, SAMPLE_RAW_TRANSACTION)

    const signedTransaction = await magic.aptos.signTransaction(rawTransaction)
    setSignedTransaction(signedTransaction)

    /* submit the transaction */
    const txHash = await client.submitTransaction(signedTransaction)
    console.log(txHash.hash);
  }

  const sendTransaction = async () => {
    if (!walletAddress) {
      console.warn('No account')
      return
    }

    setTransactionResult(null)

    /* send the transaction */
    const hexAddress = new HexString(walletAddress)

    const client = new AptosClient(DEVNET_NODE_URL);
    const rawTransaction = await client.generateTransaction(hexAddress, SAMPLE_RAW_TRANSACTION)
    const signedTransaction = await magic.aptos.signTransaction(rawTransaction)
    console.log(signedTransaction)

    const transaction = await client.submitTransaction(signedTransaction)
    console.log(transaction)
    setTransactionResult(transaction)

    // wait for the transaction to be confirmed
    const result = await client.waitForTransactionWithResult(transaction.hash, {
      checkSuccess: true
    })

    setTransactionResult(result)
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
          <div style={{ width: '700px', overflow: 'hidden', textAlign: 'start' }}>
            <button onClick={logout}>Logout</button>

            <h3>User Metadata</h3>
            <pre className="code">{JSON.stringify(userMetadata, null, 2)}</pre>

            <h3>Your wallet address is</h3>
            <pre className="code">
              {walletAddress}
            </pre>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Balacne: {balance?.toString() ?? '0'} coins</h2>
              <button onClick={() => getBalance(walletAddress)}>Get Balance</button>
            </div>
            <button style={{ width: '100%' }} onClick={faucetFiveCoins}>💵💵💵 Faucet Get 100,000,000 coins 💵💵💵</button>

            <div className="divider" />

            <h2>Transaction</h2>
            <p>Let's send a transaction to Jay.</p>

            <h3>Generate transaction</h3>
            <p>This is sample data that sends 1,000 coins to Jay.</p>
            <pre className='code'>
              {JSON.stringify(SAMPLE_RAW_TRANSACTION, null, 2)}
            </pre>
            <p>You can generate a transaction with generateTransaction method of aptos SDK.</p>
            <button onClick={generateTransaction}>
              Generate a transaction with sample data
            </button>
            <pre className="code">
              {JSON.stringify(rawTransaction, (_, value) => typeof value === 'bigint' ? value.toString() : value)}
            </pre>

            <h3>Sign Transaction</h3>
            <p>Before sending the transaction, let's sign the transaction first.</p>
            <button onClick={signTransaction}>Sign the transaction</button>
            <pre className="code">
              {signedTransaction}
            </pre>

            <h3>Send Transaction</h3>
            <p>Finally, we can send the transaction! You can see a boring result.</p>
            <button onClick={sendTransaction}>Send the transaction</button>
            <pre className="code">
              {JSON.stringify(transactionResult, null, 2)}
            </pre>
            <p>Please check your balance again.</p>


          </div>
        ) : (
          <form className="container" onSubmit={login}>
            <h3>Please sign up or login</h3>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <button type="submit">Send</button>
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
