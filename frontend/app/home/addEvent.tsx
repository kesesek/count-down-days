import React, { useState, useRef } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { fetchAuthSession } from "aws-amplify/auth";
import styles from "@/styles/addEventStyles";
import { API_BASE_URL } from "@env";

const url = `${API_BASE_URL}/create-event`;

export default function AddEvent() {
  const inputRef = useRef<TextInput>(null);
  const [eventname, setEventName] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date: Date) => {
    const formatted = format(date, "yyyy-MM-dd");
    setTargetDate(formatted);
    hideDatePicker();
  };

  const handleAddEvent = async () => {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          title: eventname,
          target_date: targetDate,
          is_pinned: isPinned,
        }),
      });

      if (response.ok) {
        // Alert.alert("Sucess", "Event added.");
        // Go back to the last page
        router.back();
      } else {
        const error = await response.text();
        Alert.alert("Error", error);
      }
    } catch (error: any) {
      Alert.alert("Error", error);
    }
    console.log({ eventname, targetDate, isPinned });
  };

  return (
    <View style={styles.container}>
      {/* make TextInput get input focus */}
      <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
        <View style={styles.row}>
          <TextInput
            ref={inputRef}
            value={eventname}
            onChangeText={setEventName}
            style={styles.input}
            placeholder="Enter event name"
            maxLength={30}
          />
        </View>
      </TouchableWithoutFeedback>

      <TouchableOpacity onPress={showDatePicker}>
        <View style={styles.row}>
          <Text style={styles.dateText}>
            {targetDate || "Select target date"}
          </Text>
        </View>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <View style={styles.row}>
        <Text style={styles.label}>Pin this event</Text>
        <Switch value={isPinned} onValueChange={setIsPinned} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddEvent}>
        <Text style={styles.buttonText}>Add Event</Text>
      </TouchableOpacity>
    </View>
  );
}