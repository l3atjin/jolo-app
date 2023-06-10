import React from 'react'
import { Pressable, View, Text, StyleSheet } from 'react-native'

export default function LensPage({ navigation }) {

  const onPressHandler = () => {
    return navigation.navigate("MainNavigation")
  }

  return (
    <View style={styles.container}>
       <Pressable style={styles.button} onPress = {onPressHandler}>
        <Text style={styles.buttonText}>
          Зорчигч
        </Text>
       </Pressable>
       <Pressable style={styles.button} onPress = {onPressHandler}>
        <Text style={styles.buttonText}>
          Жолооч
        </Text>
       </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginBottom: 10,
    padding: 10,
    minWidth: 200,
    backgroundColor: '#1e90ff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
