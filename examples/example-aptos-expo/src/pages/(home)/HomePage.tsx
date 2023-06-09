import {
  APTOS_NODE_URL,
  MAGIC_WALLET_ADDRESS,
  SAMPLE_MESSAGE_PAYLOAD,
  SAMPLE_TRANSACTION_PAYLOAD,
} from "@/constants";
import { getBalance } from "@/lib/aptos/getBalance";
import { useAptosWallet, useSetAptosWallet } from "@/states/aptosWalletStore";
import { AccountInfo, NetworkInfo } from "@aptos-labs/wallet-adapter-core";
import { AptosClient, BCS, HexString, TxnBuilderTypes } from "aptos";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const HomePage = () => {
  const router = useRouter();
  const aptosWallet = useAptosWallet();

  const [network, setNetwork] = useState<NetworkInfo | null>(null);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [balance, setBalance] = useState("0");

  const [resultA, setResultA] = useState<any>(null);
  const [resultB, setResultB] = useState<any>(null);
  const [resultC, setResultC] = useState<any>(null);

  const bcsTransactionPayload = useMemo(() => {
    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
      TxnBuilderTypes.EntryFunction.natural(
        "0x1::coin",
        "transfer",
        [TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin")],
        [
          BCS.bcsToBytes(
            TxnBuilderTypes.AccountAddress.fromHex(MAGIC_WALLET_ADDRESS)
          ),
          BCS.bcsSerializeUint64(1000),
        ]
      )
    );
  }, []);

  const handleSignTranasction = async () => {
    setResultA(null);

    const raw = await aptosWallet.signTransaction(SAMPLE_TRANSACTION_PAYLOAD);
    const hex = HexString.fromUint8Array(raw).hex();
    setResultA(hex);
  };

  const handleSignAndSubmitTransaction = async () => {
    setResultA(null);

    const { hash } = await aptosWallet.signAndSubmitTransaction(
      SAMPLE_TRANSACTION_PAYLOAD
    );

    const client = new AptosClient(APTOS_NODE_URL);
    await client.waitForTransaction(hash, {
      checkSuccess: true,
    });
    setResultA(hash);
  };

  const handleSignAndBCSSubmitTransaction = async () => {
    setResultB(null);

    const { hash } = await aptosWallet.signAndSubmitBCSTransaction(
      bcsTransactionPayload
    );

    const client = new AptosClient(APTOS_NODE_URL);
    await client.waitForTransaction(hash, {
      checkSuccess: true,
    });
    setResultB(hash);
  };

  const handleSignMessage = async () => {
    setResultC(null);

    const result = await aptosWallet.signMessage(SAMPLE_MESSAGE_PAYLOAD);
    setResultC(result);
  };

  const handleSignMessageAndVerify = async () => {
    setResultC(null);

    const result = await aptosWallet.signMessageAndVerify(
      SAMPLE_MESSAGE_PAYLOAD
    );

    console.log(result);
    setResultC(result);
  };

  const handleDisconnect = async () => {
    await aptosWallet.disconnect();
    router.replace("/sign-in");
  };

  useEffect(() => {
    aptosWallet.network().then(setNetwork);
    aptosWallet.account().then(async (accountInfo) => {
      setAccountInfo(accountInfo);
      getBalance(accountInfo.address).then(setBalance);
    });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Magic + Aptos + React Native</Text>

          <Button title="Disconnect" onPress={handleDisconnect} />

          <View>
            <Text style={styles.subtitle}>Network</Text>
            <View style={styles.codeBox}>
              <Text style={styles.code}>
                {JSON.stringify(network, null, 2)}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.subtitle}>Account Info</Text>
            <View style={styles.codeBox}>
              <Text style={styles.code}>
                {JSON.stringify(accountInfo, null, 2)}
              </Text>
            </View>
            <View style={styles.codeBox}>
              <Text style={styles.code}>
                Balance: {JSON.stringify(balance, null, 2)}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.subtitle}>Transaction</Text>
            <Text style={styles.notice}>
              Notice. Before you start, please get some coins with the above
              faucet.
            </Text>
            <View>
              <Text>
                Sample Transaction payload - sends 1,000 coins to MAGIC.
              </Text>
              <View style={styles.codeBox}>
                <Text style={styles.code}>
                  {JSON.stringify(SAMPLE_TRANSACTION_PAYLOAD, null, 2)}
                </Text>
              </View>
              <View style={styles.row}>
                <Button
                  title="signTransaction"
                  onPress={handleSignTranasction}
                />
                <Button
                  title="signAndSubmitTransaction"
                  onPress={handleSignAndSubmitTransaction}
                />
              </View>
            </View>
            <View style={styles.codeBox}>
              <Text style={styles.code}>
                {JSON.stringify(resultA, null, 2)}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.subtitle}>BCS Transaction</Text>
            <Text style={styles.notice}>
              Notice. Before you start, please get some coins with the above
              faucet.
            </Text>
            <View>
              <Text>
                Sample BCS Transaction payload - sends 1,000 coins to MAGIC.
              </Text>
              <View style={styles.codeBox}>
                <Text style={styles.code}>
                  {JSON.stringify(bcsTransactionPayload.value)}
                </Text>
              </View>
              <View style={styles.row}>
                <Button
                  title="signAndSubmitBCSTransaction"
                  onPress={handleSignAndBCSSubmitTransaction}
                />
              </View>
            </View>
            <View style={styles.codeBox}>
              <Text style={styles.code}>
                {JSON.stringify(resultB, null, 2)}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.subtitle}>Message</Text>
            <View>
              <Text>Sample Message payload</Text>
              <View style={styles.codeBox}>
                <Text style={styles.code}>
                  {JSON.stringify(SAMPLE_MESSAGE_PAYLOAD, null, 2)}
                </Text>
              </View>
              <View style={styles.row}>
                <Button title="signMessage" onPress={handleSignMessage} />
                <Button
                  title="signMessageAndVerify"
                  onPress={handleSignMessageAndVerify}
                />
              </View>
            </View>
            <View style={styles.codeBox}>
              <Text style={styles.code}>
                {JSON.stringify(resultC, null, 2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    gap: 16,
  },
  card: {
    gap: 12,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  title: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 20,
  },
  notice: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#eeeeee",
    backgroundColor: "#eeeeee",
    overflow: "hidden",
  },
  codeBox: {
    padding: 16,
    backgroundColor: "#333333",
    borderRadius: 12,
    textAlign: "start",
  },
  code: {
    color: "#ffffff",
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
