import React from 'react'
import Account from '../components/Account';
import { useAuth } from '../context/Auth'
import { useUserType } from "../context/UserTypeProvider";
import { Box, Button, Heading } from "native-base";

export default function ProfilePage() {
  const { session, user } = useAuth();
  const [userType, setUserType] = useUserType();
  const handleClick = () => {
    if (userType === "rider") {
      setUserType("driver");
    } else {
      setUserType("rider");
    }
    
  };
  return (
    <Box mt="30" flex = {1}>
      <Account key={user?.id}></Account>
      <Heading>Таны профайл</Heading>
      <Button onPress={handleClick}>
        Солих
      </Button>
    </Box>
  );
}
