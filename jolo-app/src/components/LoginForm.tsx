import React, { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../api/supabase";
import { Button, FormControl, Input, Stack } from "native-base";

export default function LoginForm() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithPhone() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      phone,
      password,
    });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithPhone() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      phone,
      password,
    });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <Stack w="70%" mx="auto">
      <FormControl>
        <FormControl.Label _text={{ bold: true }}>
          Утасны дугаар
        </FormControl.Label>
        <Input onChangeText={(value) => setPhone(value)} />
      </FormControl>
      <FormControl>
        <FormControl.Label _text={{ bold: true }}>
          Нууц Үг
        </FormControl.Label>
        <Input
          type="password"
          onChangeText={(value) => setPassword(value)}
        />
      </FormControl>
      <Button onPress={signInWithPhone} mt="5" colorScheme="primary">
        Log In
      </Button>
      <Button onPress={signUpWithPhone} mt="2" colorScheme="primary">
        Sign Up
      </Button>
    </Stack>
  );
}
