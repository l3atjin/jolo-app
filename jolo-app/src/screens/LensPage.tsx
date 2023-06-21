import React from "react";
import { Box, Button, Center, Text } from "native-base";
import { useUserType } from "../context/UserTypeProvider";

export default function LensPage({ navigation }) {
  const [userType, setUserType] = useUserType();

  const onPressRider = () => {
    setUserType("rider");
    return navigation.navigate("MainNavigation");
  };

  const onPressDriver = () => {
    setUserType("driver");
    return navigation.navigate("MainNavigation");
  };

  return (
    <Center flex={1}>
      <Button mb={2} onPress={onPressRider} variant="solid" colorScheme="blue">
        <Text color="white" bold>
          Зорчигч
        </Text>
      </Button>
      <Button onPress={onPressDriver} variant="solid" colorScheme="blue">
        <Text color="white" bold>
          Жолооч
        </Text>
      </Button>
    </Center>
  );
}
