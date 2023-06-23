import React from 'react'
import Account from '../components/Account';
import { useAuth } from '../context/AuthProvider'
import { useUserType } from "../context/UserTypeProvider";
import { Box, Button, Heading } from "native-base";
import { View } from 'react-native';

export default function ProfilePage() {
  const { session, user } = useAuth();
  const [userType, setUserType] = useUserType();
  const handleClick = () => {
    if (userType === "rider") {
      setUserType?.("driver");
    } else {
      setUserType("rider");
    }
    
  };
  return (
    <View>
      <Account/>
      <Button onPress={handleClick}>SWITCH</Button>
    </View>
  );
}
