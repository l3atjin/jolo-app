import 'react-native-gesture-handler';
import React from 'react'
import LoginPage from '../screens/LoginPage';
import SearchPage from '../screens/SearchPage';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();
console.log("In root navigator")
export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={LoginPage}></Stack.Screen>
        <Stack.Screen name="Search" component={SearchPage}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    
  )
}
