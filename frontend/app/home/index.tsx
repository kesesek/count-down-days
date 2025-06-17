import React from "react";
import { View, Text, FlatList } from "react-native";
import styles from "@/styles/homeStyles";

//sample data
const events = [
  { name: "Doctor Appointment", targetDate: "2025-06-20" },
  { name: "Project Deadline", targetDate: "2025-06-30" },
  { name: "Anniversary", targetDate: "2025-07-10" },
];

const today = new Date();

function getDaysDiff(target: string) {
  const targetDate = new Date(target);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

const sortedEvents = [...events]
  .map((e) => ({ ...e, daysDiff: getDaysDiff(e.targetDate) }))
  .sort((a, b) => Math.abs(a.daysDiff) - Math.abs(b.daysDiff));

export default function Home() {
  const topEvent = sortedEvents[0];

  return (
    <View style={styles.container}>
      {/* top summary: the most urgent event */}
      <View style={styles.topSummary}>
        <Text style={styles.daysText}>{topEvent.daysDiff}</Text>
        <Text style={styles.eventName}>{topEvent.name}</Text>
        <Text style={styles.eventDate}>
          Target date: {topEvent.targetDate}
        </Text>
      </View>

      {/* divider */}
      <View style={styles.divider} />

      {/* event list */}
      <FlatList
        data={sortedEvents}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventRow}>
            <View>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={styles.rowDate}>Target: {item.targetDate}</Text>
            </View>
            <Text style={styles.rowDiff}>
              {item.daysDiff > 0 ? `${item.daysDiff} days` : "Today"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}