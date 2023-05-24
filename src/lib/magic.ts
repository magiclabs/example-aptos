import { Magic } from "magic-sdk";
import { AptosExtension } from "@magic-ext/aptos";
import { AuthExtension } from "@magic-ext/auth";
import { DEVNET_NODE_URL } from "../constants";

export const magic = new Magic(import.meta.env.VITE_MAGIC_API_KEY, {
  endpoint: "http://localhost:3014",
  extensions: [
    new AuthExtension(),
    new AptosExtension({
      nodeUrl: DEVNET_NODE_URL,
    }),
  ],
});
