import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { fetchAuthSession } from "aws-amplify/auth";
import styles from "@/styles/homeStyles";

const today = new Date();

function getDaysDiff(target: string) {
  const targetDate = new Date(target);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        const response = await fetch(
          "https://1qfztd2il1.execute-api.ap-southeast-2.amazonaws.com/prod/get-events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const contentType = response.headers.get("content-type");

        if (response.ok && contentType?.includes("application/json")) {
          const data = await response.json();
          console.log("Fetched data:", data);

          const enriched = data
            .map((e: any) => ({
              ...e,
              daysDiff: getDaysDiff(e.targetDate),
            }))
            .sort(
              (a: any, b: any) => Math.abs(a.daysDiff) - Math.abs(b.daysDiff)
            );

          setEvents(enriched);
        } else {
          const text = await response.text();
          console.error("Non-JSON or error response:", text);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const topEvent = events.length > 0 ? events[0] : null;

  return (
    <View style={styles.container}>
      {/* top summary: the most urgent event */}
      {topEvent ? (
        <View style={styles.topSummary}>
          <Text style={styles.daysText}>{topEvent.daysDiff}</Text>
          <Text style={styles.eventName}>{topEvent.name}</Text>
          <Text style={styles.eventDate}>
            Target date: {topEvent.targetDate}
          </Text>
        </View>
      ) : (
        <Text>No events found.</Text>
      )}

      {/* divider */}
      <View style={styles.divider} />

      {/* event list */}
      <FlatList
        data={events}
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
