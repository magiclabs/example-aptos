import { magic } from "@/lib/magic";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export const HomePage = () => {
  const [accountInfo, setAccountInfo] = useState<any>(null);

  useEffect(() => {
    magic.user.getMetadata().then((metadata) => setAccountInfo(metadata));
  }, []);

  return (
    <SafeAreaView style={{ padding: 20 }}>
      <Text style={styles.title}>Magic + Aptos + React Native</Text>
      <Text>User metadata</Text>
      <Text>{JSON.stringify(accountInfo, null, 2)}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 20,
  },
  emailInput: {
    textAlign: "center",
    minWidth: 200,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderColor: "blue",
    borderWidth: 1,
  },
});
