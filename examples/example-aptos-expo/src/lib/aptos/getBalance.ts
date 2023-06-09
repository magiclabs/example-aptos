import { APTOS_NODE_URL } from "@/constants";
import { AptosClient, CoinClient } from "aptos";

export const getBalance = async (address: string) => {
  const client = new AptosClient(APTOS_NODE_URL);
  const coinClient = new CoinClient(client);

  const balance = await coinClient.checkBalance(address);
  return balance.toString();
};
