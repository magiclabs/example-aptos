import { magic } from "@/lib/magic";
import { useSetAptosWallet } from "@/states/aptosWalletStore";
import { MagicAptosWallet } from "@magic-ext/aptos";
import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const HomeLayout = () => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const setAptosWallet = useSetAptosWallet();

  useEffect(() => {
    magic.user
      .isLoggedIn()
      .then((isLoggedIn) => {
        if (isLoggedIn) {
          const magicAptosWallet = new MagicAptosWallet(magic, {
            connect: async () => {
              return await magic.aptos.getAccountInfo();
            },
          });
          setAptosWallet(magicAptosWallet);
          setIsChecked(true);
        } else {
          router.replace("/sign-in");
        }
      })
      .catch((e) => {
        console.warn(e);
        router.replace("/sign-in");
      });
  }, []);

  return isChecked ? (
    <Slot />
  ) : (
    <SafeAreaView
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>Loading...</Text>
    </SafeAreaView>
  );
};
