import 'react-native-gesture-handler';
import React from 'react'
import LoginPage from '../screens/LoginPage';
import SearchPage from '../screens/SearchPage';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();

console.log("In root navigator")

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Login'>
        <Tab.Screen name="Login" component={LoginPage} />
        <Tab.Screen name="Search" component={SearchPage} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

