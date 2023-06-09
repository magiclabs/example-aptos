export const APTOS_NODE_URL = "https://fullnode.testnet.aptoslabs.com";

export const MAGIC_WALLET_ADDRESS =
  "0x906fd65afe31b7237cd4d7c4073d8bf76c61b6a24ec64dd26f0c16de5c2444d5";

export const SAMPLE_TRANSACTION_PAYLOAD = {
  type: "entry_function_payload",
  function: "0x1::coin::transfer",
  type_arguments: ["0x1::aptos_coin::AptosCoin"],
  arguments: [MAGIC_WALLET_ADDRESS, 1000],
};

export const SAMPLE_MESSAGE_PAYLOAD = {
  message: "Hello from Aptos Wallet Adapter",
  nonce: "random_string",
};
