import { useState, useEffect, FormEvent } from "react";
import { Magic } from "magic-sdk";
import { AptosExtension, MagicAptosWallet } from "@magic-ext/aptos";
import { AuthExtension } from "@magic-ext/auth";
import {
  AptosClient,
  BCS,
  CoinClient,
  FaucetClient,
  TxnBuilderTypes,
} from "aptos";

import magicLogo from "./assets/magic.svg";
import reactLogo from "./assets/react.svg";
import aptosLogo from "./assets/aptos.svg";
import "./App.css";
import { AccountInfo, NetworkInfo } from "@aptos-labs/wallet-adapter-core";

const DEVNET_NODE_URL = "https://fullnode.testnet.aptoslabs.com";
const DEVNET_FAUCET_URL = "https://faucet.testnet.aptoslabs.com";

const MAGIC_WALLET_ADDRESS =
  "0x906fd65afe31b7237cd4d7c4073d8bf76c61b6a24ec64dd26f0c16de5c2444d5";
const SAMPLE_RAW_TRANSACTION = {
  type: "entry_function_payload",
  function: "0x1::coin::transfer",
  type_arguments: ["0x1::aptos_coin::AptosCoin"],
  arguments: [MAGIC_WALLET_ADDRESS, 1000],
};
const SAMPLE_BCS_TRANSACTION = `const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
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
);`;

const SAMPLE_MESSAGE_PAYLOAD = {
  message: "Hello from Aptos Wallet Adapter",
  nonce: "random_string",
};

const magic = new Magic(import.meta.env.VITE_MAGIC_API_KEY, {
  extensions: [
    new AuthExtension(),
    new AptosExtension({
      nodeUrl: DEVNET_NODE_URL,
    }),
  ],
});

function App() {
  const [aptosWallet, setAptosWallet] = useState<MagicAptosWallet | null>(null);
  const [email, setEmail] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [balance, setBalance] = useState(BigInt(0));

  const [result, setResult] = useState<any>(null);
  const [resultB, setResultB] = useState<any>(null);
  const [resultC, setResultC] = useState<any>(null);

  useEffect(() => {
    magic.user.isLoggedIn().then(async (magicIsLoggedIn: boolean) => {
      setIsLoggedIn(magicIsLoggedIn);

      if (magicIsLoggedIn) {
        const magicAptosWallet = new MagicAptosWallet(magic, {
          connect: async () => {
            return await magic.aptos.getAccountInfo();
          },
        });
        setAptosWallet(magicAptosWallet);

        const accountInfo = await magicAptosWallet.account();
        setAccountInfo(accountInfo);

        const networkInfo = await magicAptosWallet.network();
        setNetworkInfo(networkInfo);

        getBalance(accountInfo.address);
      }
    });
  }, []);

  const login = async (e: FormEvent) => {
    e.preventDefault();

    const magicAptosWallet = new MagicAptosWallet(magic, {
      connect: async () => {
        await magic.auth.loginWithMagicLink({ email });
        const accountInfo = await magic.aptos.getAccountInfo();
        return accountInfo;
      },
    });

    const accountInfo = await magicAptosWallet.connect();
    getBalance(accountInfo.address);
    setAccountInfo(accountInfo);
    setAptosWallet(magicAptosWallet);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await magic.user.logout();
    setIsLoggedIn(false);
  };

  const faucetFiveCoins = async () => {
    if (!accountInfo) {
      console.warn("No account");
      return;
    }

    const faucetClient = new FaucetClient(DEVNET_NODE_URL, DEVNET_FAUCET_URL);
    await faucetClient.fundAccount(accountInfo.address, 10_000);

    await getBalance(accountInfo.address);
  };

  const getBalance = async (address: string) => {
    const client = new AptosClient(DEVNET_NODE_URL);
    const coinClient = new CoinClient(client);

    const balance = await coinClient.checkBalance(address);
    setBalance(balance);
  };

  const handleSignTransaction = async () => {
    setResult(null);

    if (!accountInfo || !aptosWallet) {
      console.warn("No account");
      return;
    }

    const result = await aptosWallet.signTransaction(SAMPLE_RAW_TRANSACTION);
    setResult(result);
  };

  const handleSignAndSubmitTransaction = async () => {
    setResult(null);

    if (!accountInfo || !aptosWallet) {
      console.warn("No account");
      return;
    }

    const { hash } = await aptosWallet.signAndSubmitTransaction(
      SAMPLE_RAW_TRANSACTION
    );

    const client = new AptosClient(DEVNET_NODE_URL);
    await client.waitForTransaction(hash, {
      checkSuccess: true,
    });
    setResult(hash);
  };

  const handleSignAndSubmitBCSTransaction = async () => {
    setResultB(null);

    if (!accountInfo || !aptosWallet) {
      console.warn("No account");
      return;
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

    const { hash } = await aptosWallet.signAndSubmitBCSTransaction(payload);

    const client = new AptosClient(DEVNET_NODE_URL);
    await client.waitForTransaction(hash, {
      checkSuccess: true,
    });
    setResultB(hash);
  };

  const handleSignMessage = async () => {
    setResultC(null);

    if (!accountInfo || !aptosWallet) {
      console.warn("No account");
      return;
    }

    const result = await aptosWallet.signMessage(SAMPLE_MESSAGE_PAYLOAD);
    setResultC(result);
  };

  const handleSignMessageAndVerify = async () => {
    setResultC(null);

    if (!accountInfo || !aptosWallet) {
      console.warn("No account");
      return;
    }

    const result = await aptosWallet.signMessageAndVerify(
      SAMPLE_MESSAGE_PAYLOAD
    );
    setResultC(result);
  };

  return (
    <>
      <div>
        <a href="https://magic.link" target="_blank" rel="noreferrer">
          <img src={magicLogo} className="logo magic" alt="Magic logo" />
        </a>
        <a href="https://aptoslabs.com/" target="_blank" rel="noreferrer">
          <img src={aptosLogo} className="logo aptos" alt="Aptos logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Magic + Aptos + React</h1>

      {isLoggedIn && <button onClick={logout}>Logout</button>}

      <div className="card">
        {isLoggedIn ? (
          <div
            style={{ width: "700px", overflow: "hidden", textAlign: "start" }}
          >
            <h2>Network</h2>
            <pre className="code">{JSON.stringify(networkInfo, null, 2)}</pre>

            <h2>Account Info</h2>
            <pre className="code" data-testid="account-info-box">
              {JSON.stringify(accountInfo, null, 2)}
            </pre>

            <h3>Balance</h3>
            <pre className="code" data-testid="balance-box">
              {balance?.toString() ?? "0"}
            </pre>
            <button
              style={{ width: "100%" }}
              onClick={faucetFiveCoins}
              data-testid="faucet-button"
            >
              💵💵💵 Get 10,000 coins from the Faucet 💵💵💵
            </button>

            <div className="divider" />

            <h2>Actions</h2>
            <p className="notice">
              Notice. Before you start, please get some coins with the above
              faucet.
            </p>

            <p>Transaction payload - sends 1,000 coins to MAGIC.</p>
            <pre className="code">
              {JSON.stringify(SAMPLE_RAW_TRANSACTION, null, 2)}
            </pre>
            <div className="button-list">
              <button onClick={handleSignTransaction}>signTransaction</button>
              <button onClick={handleSignAndSubmitTransaction}>
                signAndSubmitTransaction
              </button>
              <pre className="code" data-testid="transaction-result-box">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>

            <p>BCSTransaction paylod</p>
            <pre className="code" style={{ textAlign: "left" }}>
              {SAMPLE_BCS_TRANSACTION}
            </pre>
            <div className="button-list">
              <button onClick={handleSignAndSubmitBCSTransaction}>
                signAndSubmitBCSTransaction
              </button>
              <pre className="code" data-testid="bcs-transaction-result-box">
                {JSON.stringify(resultB, null, 2)}
              </pre>
            </div>

            <p>Message paylod</p>
            <pre className="code" style={{ textAlign: "left" }}>
              {JSON.stringify(SAMPLE_MESSAGE_PAYLOAD, null, 2)}
            </pre>
            <div className="button-list">
              <button onClick={handleSignMessage}>signMessage</button>
              <button onClick={handleSignMessageAndVerify}>
                signMessageAndVerify
              </button>
              <pre className="code" data-testid="message-result-box">
                {JSON.stringify(resultC, null, 2)}
              </pre>
            </div>
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
  );
}

export default App;
