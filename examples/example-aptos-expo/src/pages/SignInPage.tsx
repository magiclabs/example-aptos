import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { magic } from "@/lib/magic";
import { useState } from "react";

export const SignInPage = () => {
  const [email, setEmail] = useState("");

  const loginWithMagicLink = async () => {
    await magic.auth.loginWithMagicLink({ email });
    const userMetadata = await magic.user.getMetadata();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Magic + Aptos + React Native</Text>
      <TextInput
        style={styles.emailInput}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <Button title="Submit" onPress={loginWithMagicLink} />
    </View>
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
