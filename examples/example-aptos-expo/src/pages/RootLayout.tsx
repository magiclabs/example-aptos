import { polyfill as polyfillEncoding } from "react-native-polyfill-globals/src/encoding";

import { magic } from "@/lib/magic";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

polyfillEncoding();

export const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <Slot />
      <magic.Relayer />
    </SafeAreaProvider>
  );
};
