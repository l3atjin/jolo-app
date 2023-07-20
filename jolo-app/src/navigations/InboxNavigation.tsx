import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import Chat from '../screens/Chat';
import InboxPage from "../screens/InboxPage"

const Stack = createStackNavigator();

export default function InboxNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="Inbox"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Inbox" component={InboxPage} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  )
}
