// app/home/_layout.tsx
import { Tabs } from "expo-router";

export default function HomeLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "to do" }} />
      <Tabs.Screen name="tab2" options={{ title: "completed" }} />
      <Tabs.Screen name="tab3" options={{ title: "setting" }} />
    </Tabs>
  );
}