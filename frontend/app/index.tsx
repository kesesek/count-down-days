import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { router } from "expo-router";
import { signIn } from "aws-amplify/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { nextStep: signInNextStep } = await signIn({
        username: email,
        password: password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH",
          preferredChallenge: "PASSWORD_SRP", // or 'PASSWORD'
        },
      });

      if (signInNextStep.signInStep === "DONE") {
        console.log("Sign in successful!");
      }

      router.replace("/home");
    } catch (error: any) {
      console.error("Login failed", error);
      Alert.alert("Login Failed", error.name || "Unknown error");
    }
  };

  return (
    <View style={{ padding: 20, margin: 60 }}>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
