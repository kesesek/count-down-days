import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  topSummary: {
    alignItems: "center",
    marginBottom: 4,
  },
  daysText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },

  diffHintText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 4,
  },
  eventName: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 4,
  },
  eventDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 12,
  },
  eventRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  rowDate: {
    fontSize: 12,
    color: "#666",
  },
  rowDiff: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    alignSelf: "center",
  },
})