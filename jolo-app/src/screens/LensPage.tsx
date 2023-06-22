import React from "react";
import { Button, Center, Text } from "native-base";
import { useUserType } from "../context/UserTypeProvider";
import { StackNavigationProp } from "@react-navigation/stack";

type LensPageProp = {
  navigation: StackNavigationProp<any>; // replace `any` with your Navigator param list if you have defined one
};

export default function LensPage({ navigation }: LensPageProp) {
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
