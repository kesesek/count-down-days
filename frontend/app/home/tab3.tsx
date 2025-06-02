import { View, Text, Button } from "react-native";
import { signOut } from "aws-amplify/auth";
import { router } from "expo-router";
export default function Tab3() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>setting</Text>
      <Button
        title="Log Out"
        onPress={async () => {
          await signOut();
          router.replace("/");
        }}
      />
    </View>
  );
}
