import React, { useState } from "react";
import { View, TextInput, Alert, Text, TouchableOpacity } from "react-native";
import { router, Link } from "expo-router";
import { signIn, fetchUserAttributes } from "aws-amplify/auth";
import styles from "@/styles/userAuthStyles";
import { saveToSecureStore } from "@/utils/storage";

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

      const attributes = await fetchUserAttributes();
      const nickname = attributes.nickname || "";
      await saveToSecureStore("email", email);
      await saveToSecureStore("nickname", nickname);

      router.replace("/home");
    } catch (error: any) {
      console.error("Login failed", error);
      const errorMsg = error.message.split(".");
      const errorDetail =
        errorMsg.length > 1 ? errorMsg[1].trim() : error.message;
      Alert.alert("Login Failed", errorDetail || "Unknown error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{"Welcome Back"}</Text>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        placeholderTextColor="#666"
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#666"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        {"Don't have an account?"}
        <Link href="/register" style={styles.link}>
          Register here
        </Link>
      </Text>
    </View>
  );
}
