import React from "react";
import { View } from "react-native";
import DriverForm from "../components/DriverForm";
import RiderForm from "../components/RiderForm";
import { useUserType } from "../context/UserTypeProvider";

export default function CreatePostPage({ }) {
  const [userType] = useUserType();

  console.log("in create post");
  console.log("userType is", userType);
  return (
    <View>
      {userType === "rider" && <RiderForm />}
      {userType === "driver" && <DriverForm />}
    </View>
  );
}
