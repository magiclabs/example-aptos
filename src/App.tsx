import { useState, useEffect, FormEvent } from 'react'
import { Magic } from 'magic-sdk';
import { AptosExtension, MagicAptosWallet } from '@magic-ext/aptos';
import { AuthExtension } from '@magic-ext/auth';
import { AptosClient, BCS, CoinClient, FaucetClient, TxnBuilderTypes } from 'aptos'

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
  extensions: [
    new AuthExtension(),
    new AptosExtension({
      nodeUrl: DEVNET_NODE_URL
    }),
  ]
});

function App() {
  const [aptosWallet, setAptosWallet] = useState<MagicAptosWallet | null>(null);
  const [email, setEmail] = useState('')

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [balance, setBalance] = useState(BigInt(0));

  const [result, setResult] = useState<Uint8Array | string | null>(null)

  useEffect(() => {
    magic.user.isLoggedIn().then((async (magicIsLoggedIn: boolean) => {
      setIsLoggedIn(magicIsLoggedIn)
      if (magicIsLoggedIn) {
        const magicAptosWallet = new MagicAptosWallet(magic, {
          // You don't need to set connect if you're already logged in
        });
        setAptosWallet(magicAptosWallet)

        const accountInfo = await magicAptosWallet.account();
        setAccountInfo(accountInfo);
        getBalance(accountInfo.address)
      }
    }))
  }, [isLoggedIn])

  const login = async (e: FormEvent) => {
    e.preventDefault();

    const magicAptosWallet = new MagicAptosWallet(magic, {
      connect: async () => {
        await magic.auth.loginWithMagicLink({ email });
        const accountInfo = await magicAptosWallet.account();
        return accountInfo;
      }
    })

    const accountInfo = await magicAptosWallet.connect();
    setAccountInfo(accountInfo);
    setAptosWallet(magicAptosWallet);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await magic.user.logout();
    setIsLoggedIn(false);
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

  const handleSignTransaction = async () => {
    if (!accountInfo || !aptosWallet) {
      console.warn('No account')
      return
    }

    const result = await aptosWallet.signTransaction(SAMPLE_RAW_TRANSACTION)
    setResult(result);
  }

  const handleSignAndSubmitTransaction = async () => {
    if (!accountInfo || !aptosWallet) {
      console.warn('No account')
      return
    }

    const result = await aptosWallet.signAndSubmitTransaction(SAMPLE_RAW_TRANSACTION)
    setResult(result);
  }

  const handleSignAndSubmitBCSTransaction = async () => {
    if (!accountInfo || !aptosWallet) {
      console.warn('No account')
      return
    }

    const token = new TxnBuilderTypes.TypeTagStruct(
      TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin")
    );

    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
      TxnBuilderTypes.EntryFunction.natural(
        "0x1::coin",
        "transfer",
        [token],
        [
          BCS.bcsToBytes(
            TxnBuilderTypes.AccountAddress.fromHex(MAGIC_WALLET_ADDRESS)
          ),
          BCS.bcsSerializeUint64(1000),
        ]
      )
    );

    const result = await aptosWallet.signAndSubmitBCSTransaction(payload)
    setResult(result);
  }

  const handleSignMessage = async () => {
    if (!accountInfo || !aptosWallet) {
      console.warn('No account')
      return
    }

    const payload = {
      message: "Hello from Aptos Wallet Adapter",
      nonce: "random_string",
    };

    const result = await aptosWallet.signMessage(payload)
    setResult(result);
  }

  const handleSignMessageAndVerify = async () => {
    if (!accountInfo || !aptosWallet) {
      console.warn('No account')
      return
    }

    const payload = {
      message: "Hello from Aptos Wallet Adapter",
      nonce: "random_string",
    };

    const result = await aptosWallet.signMessageAndVerify(payload)
    setResult(result);
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

            <h2>Account Info</h2>
            <pre className="code">{JSON.stringify(accountInfo, null, 2)}</pre>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Balance: {balance?.toString() ?? '0'} coins</h3>
              {accountInfo && <button onClick={() => getBalance(accountInfo?.address)}>Get Balance</button>}
            </div>
            <button style={{ width: '100%' }} onClick={faucetFiveCoins}>💵💵💵 Get 100,000,000 coins from the Faucet 💵💵💵</button>

            <div className="divider" />

            <h2>Transaction</h2>
            <p className="notice">Notice. Before you start, please get some coins with the above faucet.</p>

            <p>This example transaction sends 1,000 coins to MAGIC.</p>
            <pre className='code'>
              {JSON.stringify(SAMPLE_RAW_TRANSACTION, null, 2)}
            </pre>
            <div className="button-list">
              <button onClick={handleSignTransaction}>signTransaction</button>
              <button onClick={handleSignAndSubmitTransaction}>signAndSubmitTransaction</button>
              <button onClick={handleSignAndSubmitBCSTransaction}>signAndSubmitBCSTransaction</button>
              <button onClick={handleSignMessage}>signMessage</button>
              <button onClick={handleSignMessageAndVerify}>signMessageAndVerify</button>
            </div>
            <pre className="code">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        ) : (
          <form className="container" onSubmit={login}>
            <h3>Please sign up or login</h3>
            <div className="row">
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
