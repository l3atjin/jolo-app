import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { useUserType } from "../context/UserTypeProvider";

export default function LensPage({ navigation }) {
  const [userType, setUserType] = useUserType();

  const onPressRider = () => {
    setUserType("rider");
    return navigation.navigate("MainNavigation");
  };

  const onPressDriver = () => {
    setUserType("driver");
    return navigation.navigate("MainNavigation");
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onPressRider}>
        <Text style={styles.buttonText}>Зорчигч</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={onPressDriver}>
        <Text style={styles.buttonText}>Жолооч</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginBottom: 10,
    padding: 10,
    minWidth: 200,
    backgroundColor: "#1e90ff",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
