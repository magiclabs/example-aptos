import { useEffect, useState } from "react";
import { magic } from "../lib/magic";
import { MAGIC_WALLET_ADDRESS } from "../constants";

export const CoinClientPlugin = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [checkBalanceResult, setCheckBalanceResult] = useState<bigint | null>(
    null
  );
  const [transferResult, setTransferResult] = useState<string | null>(null);

  const handleCheckBalance = async () => {
    const result = await magic.aptos.coinClient.checkBalance(walletAddress);
    setCheckBalanceResult(result);
  };

  const handleTransfer = async () => {
    const result = await magic.aptos.coinClient.transfer(walletAddress, MAGIC_WALLET_ADDRESS, 1_000, { gasUnitPrice: BigInt(100) })
    setTransferResult(result);
  }

  useEffect(() => {
    magic.aptos.getAccount().then((address: string) => {
      setWalletAddress(address);
    });
  }, [])

  return (
    <>
      <h2>CoinClient Plugin</h2>
      <button onClick={handleCheckBalance}>checkBalance</button>
      <pre className="code">
        {JSON.stringify(checkBalanceResult?.toString())}
      </pre>
      <button onClick={handleTransfer}>transfer</button>
      <pre className="code">{JSON.stringify(transferResult, (_, value) => typeof value === 'bigint' ? value.toString() : value)}</pre>
    </>
  );
};
