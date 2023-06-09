import { magic } from "@/lib/magic";
import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const HomeLayout = () => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    magic.user
      .isLoggedIn()
      .then((isLoggedIn) => {
        if (isLoggedIn) {
          setIsChecked(true);
        } else {
          router.replace("/signin");
        }
      })
      .catch((e) => {
        console.warn(e);
        router.replace("/signin");
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
