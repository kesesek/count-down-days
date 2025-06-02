import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import { confirmSignUp } from "aws-amplify/auth";
import { router, useLocalSearchParams } from "expo-router";

export default function Verify() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.email) setEmail(params.email as string);
  }, [params])

  const handleVerify = async () => {
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      Alert.alert("Success", "Account verified. You can now login.");
      router.replace("/");
    } catch (error: any) {
      console.error("Verification error", error);
      const errorMsg = error.message.split(".");
      const errorDetail = errorMsg.length > 1 ? errorMsg[1].trim() : error.message;
      Alert.alert("Verification Failed", errorDetail || "Unknown error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Verification Code"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Confirm Code" onPress={handleVerify} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
  },
});