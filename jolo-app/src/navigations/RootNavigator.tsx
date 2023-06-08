import 'react-native-gesture-handler';
import React from 'react'
import LoginPage from '../screens/LoginPage';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigation from './MainNavigation';


const Stack = createStackNavigator();

console.log("In root navigator")

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="MainNavigation" component={MainNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

