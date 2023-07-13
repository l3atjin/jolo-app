import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useUserType } from "../context/UserTypeProvider";
import CreatePostPage from "../screens/CreatePostPage";
import ProfilePage from "../screens/ProfilePage";
import PostSearchPage from "../screens/PostSearchPage";
import RequestSearchPage from "../screens/RequestSearchPage";

const Tab = createBottomTabNavigator();

export default function MainNavigation() {
  const [userType] = useUserType();

  return (
    <Tab.Navigator
      initialRouteName="Search"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Search" component={userType == 'rider' ? PostSearchPage : RequestSearchPage} />
      <Tab.Screen name="CreatePostPage" component={CreatePostPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}
