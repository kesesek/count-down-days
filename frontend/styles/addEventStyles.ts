import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flex: 1,
  },
  row: {
    height: 55,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    padding: 8,
    minWidth: "55%",
    fontSize: 16,
    fontWeight: "500",
  },
  dateText: {
    padding: 8,
    minWidth: 120,
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
