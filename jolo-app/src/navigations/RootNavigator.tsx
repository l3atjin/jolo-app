import React from 'react'

import LoginPage from '../screens/LoginPage';
import SearchPage from '../screens/SearchPage';
import ProfilePage from '../screens/ProfilePage';

import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginPage}></Stack.Screen>
        <Stack.Screen name="Search" component={SearchPage}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    
  )
}
