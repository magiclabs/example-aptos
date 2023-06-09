import { AptosExtension } from "@magic-ext/aptos";
import { Magic } from "@magic-sdk/react-native-expo";
import { APTOS_NODE_URL } from "@/constants";

export const magic = new Magic("pk_live_E8E97A739862EE73", {
  extensions: [
    new AptosExtension({
      nodeUrl: APTOS_NODE_URL,
    }),
  ],
});
