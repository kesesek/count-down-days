import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import { fetchAuthSession } from "aws-amplify/auth";
import styles from "@/styles/homeStyles";

// Note: don't use react-native-dotenv. It's incompatible with expo-router.
// However, as Expo official document said: Do not store sensitive info, such as private keys, in EXPO_PUBLIC_ variables. These variables will be visible in plain-text in your compiled application.
// To do: find another way to store env variables.
const base_url = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
const url = `${base_url}/get-events`;

function getDaysDiff(target: string) {
  const today = new Date();
  const targetDate = new Date(target);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getDiffPrefix(daysDiff: number): string {
  if (daysDiff > 0) return "In";
  if (daysDiff < 0) return "Past";
  return "";
}

function getDayText(daysDiff: number): string {
  if (daysDiff === 0) return "Today";
  return `day${Math.abs(daysDiff) === 1 ? "" : "s"}`;
}

function getDiffLabel(daysDiff: number): string {
  if (daysDiff > 0) return `In ${daysDiff} days`;
  if (daysDiff < 0) return `Past ${Math.abs(daysDiff)} days`;
  return "Today";
}

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (
        response.ok &&
        response.headers.get("content-type")?.includes("application/json")
      ) {
        const data = await response.json();

        const enriched = data
          .map((e: any) => ({
            ...e,
            daysDiff: getDaysDiff(e.target_date),
            createdAt: new Date(e.created_at),
          }))
          .sort((a: any, b: any) => {
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          });

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

  useEffect(() => {
    fetchEvents();
  }, []);

  // update evnets
  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

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
          <View style={styles.diffRow}>
            {topEvent.daysDiff === 0 ? (
              <Text style={styles.diffHintText}>Today</Text>
            ) : (
              <>
                <Text style={styles.diffHintText}>
                  {getDiffPrefix(topEvent.daysDiff)}{" "}
                </Text>
                <Text style={styles.daysText}>
                  {Math.abs(topEvent.daysDiff)}
                </Text>
                <Text style={styles.diffHintText}>
                  {` ${getDayText(topEvent.daysDiff)}`}
                </Text>
              </>
            )}
          </View>

          <Text style={styles.eventName}>{topEvent.title}</Text>
          <Text style={styles.eventDate}>
            Target date: {topEvent.target_date}
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
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowDate}>Target: {item.target_date}</Text>
            </View>
            <Text style={styles.rowDiff}>{getDiffLabel(item.daysDiff)}</Text>
          </View>
        )}
      />
    </View>
  );
}
