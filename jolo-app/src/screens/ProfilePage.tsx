import { Box, Button, Heading } from "native-base";
import React from "react";
import { useUserType } from "../context/UserTypeProvider";

export default function ProfilePage() {
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
      <Heading>Таны профайл</Heading>
      <Button onPress={handleClick}>
        Солих
      </Button>
    </Box>
  );
}
