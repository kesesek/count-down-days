import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text } from "react-native";
import { router, Link } from "expo-router";
import { signUp } from "aws-amplify/auth";
import styles from "@/styles/userAuthStyles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const handleRegister = async () => {
    try {
      await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            nickname,
          },
        },
      });

      // to verify the email address
      router.push({
        pathname: "/verify",
        params: { email },
      });
    } catch (error: any) {
      console.error("register failed", error);

      const errorMsg = error.message.split(".");
      const errorDetail = errorMsg.length > 1 ? errorMsg[1].trim() : error.message;
      Alert.alert("Register Failed", errorDetail || "Unknown error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{}}>{"Welcome!"}</Text>
      <TextInput
        placeholder="Name"
        placeholderTextColor="#666"
        onChangeText={setNickname}
        value={nickname}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#666"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#666"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Register" onPress={handleRegister} />
      <Text style={styles.text}>
        {"Already have an account?"}
        <Link href={"/"} style={styles.link}>
          Login
        </Link>
      </Text>
    </View>
  );
}
