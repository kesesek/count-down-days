import { Stack, router } from "expo-router";
import { Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Mark A Day",
          headerLeft: () => (
            <Pressable
              onPress={() => router.push("/home/settings")}
              style={{
                paddingHorizontal: 12,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign name="ellipsis1" size={24} color="black" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/home/addEvent")}
              style={{
                paddingHorizontal: 12,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign name="plus" size={24} color="black" />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTintColor: "black",
          headerBackTitle: "Back",
          headerStyle: { backgroundColor: "#f5f5f5" },
          presentation: "card",
          animation: "slide_from_left",
        }}
      />
      <Stack.Screen
        name="addEvent"
        options={{
          title: "Add an event",
          headerTintColor: "black",
          headerStyle: { backgroundColor: "#f5f5f5" },
          presentation: "modal",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
