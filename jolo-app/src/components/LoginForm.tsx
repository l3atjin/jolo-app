import React, { useRef, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../api/supabase";
import { Button, FormControl, Input, Stack } from "native-base";
import OTPForm from "./OTPForm";
import { TextInput } from "react-native-gesture-handler";

export default function LoginForm() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [awaitingOTP, setAwaitingOTP] = useState(false);

  let phoneNumberRef = useRef<TextInput>();
  let passwordRef = useRef<TextInput>();

  async function signInWithPhone() {
    phoneNumberRef.current?.blur();
    passwordRef.current?.blur();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      phone,
      password,
    });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithPhone() {
    phoneNumberRef.current?.blur();
    passwordRef.current?.blur();
    setAwaitingOTP(true);
  }

  async function OTPSubmit(otp: string) {
    setLoading(true);
    setAwaitingOTP(false);
    if (otp == "1234") {
      const { error } = await supabase.auth.signUp({
        phone,
        password,
      });
      if (error) Alert.alert(error.message);
    } else {
      Alert.alert("Таны оруулсан код буруу байна.");
    }
    setLoading(false);
  }

  return (
    <Stack w="70%" mx="auto" mt="30%">
      <FormControl>
        <FormControl.Label _text={{ bold: true }}>
          Утасны дугаар
        </FormControl.Label>
        <Input
          ref={phoneNumberRef}
          onChangeText={(value) => setPhone(value)}
          keyboardType="numeric"
        />
      </FormControl>
      <FormControl>
        <FormControl.Label _text={{ bold: true }}>
          Нууц Үг
        </FormControl.Label>
        <Input
          ref={passwordRef}
          type="password"
          onChangeText={(value) => setPassword(value)}
        />
      </FormControl>
      <Button
        onPress={signInWithPhone}
        mt="5"
        colorScheme="primary"
        disabled={loading || phone.length != 11 || password.length == 0}
      >
        Log In
      </Button>
      <Button
        onPress={signUpWithPhone}
        mt="2"
        colorScheme="primary"
        disabled={loading || phone.length != 11 || password.length == 0}
      >
        Sign Up
      </Button>
      <OTPForm
        isOpen={awaitingOTP}
        onClose={() => setAwaitingOTP(false)}
        onSubmit={(otp) => OTPSubmit(otp)}
      />
    </Stack>
  );
}
