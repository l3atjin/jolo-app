import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import LoginPage from '../screens/LoginPage'
import ProfilePage from '../screens/ProfilePage'
import SearchPage from '../screens/SearchPage'


const Tab = createBottomTabNavigator();

export default function MainNavigation() {
    return (
        <Tab.Navigator initialRouteName='Search' screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Search" component={SearchPage} />
            <Tab.Screen name="Profile" component={ProfilePage} />
        </Tab.Navigator>
      )
}
