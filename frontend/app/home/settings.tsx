import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { getFromSecureStore, deleteFromSecureStore } from "@/utils/storage";
import { signOut } from "@aws-amplify/auth";
import { router } from "expo-router";
import styles from "@/styles/settingsStyles";

export default function Settings() {
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const loadUserInfo = async () => {
      const name = await getFromSecureStore("nickname");
      setNickname(name || "User");
    };
    loadUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      await deleteFromSecureStore("nickname");
      await deleteFromSecureStore("email");
      router.replace("/");
    } catch (error: any) {
      console.log(error.message);
      Alert.alert("Logout failed", error.message || "Unknown error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {nickname}</Text>

      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowText}>Change Email</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowText}>Change Username</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowText}>Delete Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>LOG OUT</Text>
      </TouchableOpacity>
    </View>
  );
}
// to do: 1. store user attributes & email in expo-secure-store
// 2. Seetings page functions: display user nickname; change nickname/password/email; delete account; log out
