import React from "react";
import { Platform, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { FancyAlert } from "react-native-expo-fancy-alerts";
import { Ionicons } from "@expo/vector-icons";

const ErrorPopup = ({ error, setError, errorText }) => {
  return (
    <FancyAlert
      style={styles.alert}
      icon={
        <View style={[styles.icon, { borderRadius: 32, overflow: 'hidden', background: 'transparent' }]}>
          <Ionicons
            name={Platform.select({ ios: "ios-close", android: "md-close" })}
            size={36}
            color="#FFFFFF"
          />
        </View>
      }
      visible={error}
    >
      <View style={styles.content}>
        <Text style={styles.contentText}>{errorText} </Text>

        <TouchableOpacity style={styles.btn} onPress={() => setError(false)}>
          <Text style={styles.btnText}>OK  </Text>
        </TouchableOpacity>
      </View>
    </FancyAlert>
  );
};

const styles = StyleSheet.create({
  alert: {
    backgroundColor: "#EEEEEE",
  },
  icon: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C3272B",
    width: "100%",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -16,
    marginBottom: 16,
  },
  contentText: {
    textAlign: "center",
    fontWeight:400,
    fontSize: 12
  },
  btn: {
    borderRadius: 32,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignSelf: "stretch",
    backgroundColor: "#C3272B",
    marginTop: 16,
    minWidth: "50%",
    paddingHorizontal: 16,
  },
  btnText: {
    color: "#FFFFFF",
  },
});

export default ErrorPopup;
