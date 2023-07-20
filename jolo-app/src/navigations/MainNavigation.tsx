import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useUserType } from "../context/UserTypeProvider";
import CreatePostPage from "../screens/CreatePostPage";
import MyTripsPage from "../screens/MyTripsPage";
import ProfilePage from "../screens/ProfilePage";
import PostSearchPage from "../screens/PostSearchPage";
import RequestSearchPage from "../screens/RequestSearchPage";
import { UserPostsProvider } from "../context/UserPostsProvider";
import InboxNavigation from "./InboxNavigation";

const Tab = createBottomTabNavigator();

export default function MainNavigation() {
  const [userType] = useUserType();

  return (
    <UserPostsProvider>
      <Tab.Navigator
        initialRouteName="Search"
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Search" component={userType == 'rider' ? PostSearchPage : RequestSearchPage} />
        <Tab.Screen name="CreatePostPage" component={CreatePostPage} />
        <Tab.Screen name="MyTrips" component={MyTripsPage} />
        <Tab.Screen name="InboxNavigation" component={InboxNavigation} />
        <Tab.Screen name="Profile" component={ProfilePage} />
      </Tab.Navigator>
    </UserPostsProvider>
  );
}
