import { magic } from "@/lib/magic";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <Slot />
      <magic.Relayer />
    </SafeAreaProvider>
  );
};
