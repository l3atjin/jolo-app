import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import { useAuth } from "../context/Auth";
import AccountAvatar from "./AccountAvatar";
import { Alert } from "react-native";
import { decode } from "base64-arraybuffer";
import { Button, FormControl, Input, VStack } from "native-base";

export default function Account() {
  const [loading, setLoading] = useState<boolean>(true);
  const [firstName, setFirstName] = useState<string>("");
  const [avatarUri, setAvatarUri] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string | null | undefined>(
    null,
  );
  const { session } = useAuth();

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`first_name, phone_number, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFirstName(data.first_name);
        setAvatarUri(data.avatar_url);
        setPhoneNumber(data.phone_number);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // uploads a newly selected avatar
  async function updateAvatar(): Promise<string | null> {
    if (!imageBase64) return null;

    const fileExt = "jpg";
    const filePath = `${Math.random()}.${fileExt}`;
    let { error } = await supabase.storage.from("avatars").upload(
      filePath,
      decode(imageBase64),
      {
        contentType: "image/jpg",
      },
    );

    if (error) {
      throw error;
    }

    const { data } = supabase
      .storage
      .from("avatars")
      .getPublicUrl(filePath);

    return data.publicUrl || null;
  }

  // save new updates to supabase
  async function updateProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        first_name: firstName,
        avatar_url: await updateAvatar() || avatarUri,
        phone_number: phoneNumber,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <VStack width="70%" mx="auto">
      <AccountAvatar
        avatarUri={avatarUri}
        onUpload={(imageUri, imageBase64) => {
          setImageBase64(imageBase64);
          setAvatarUri(imageUri);
        }}
      />
      <FormControl>
        <FormControl.Label _text={{ bold: true }}>
          Таны Нэр
        </FormControl.Label>
        <Input
          onChangeText={(value) => setFirstName(value)}
          value={firstName || ""}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label _text={{ bold: true }}>
          Утасны дугаар
        </FormControl.Label>
        <Input
          onChangeText={(value) => setPhoneNumber(value)}
          value={phoneNumber || ""}
        />
      </FormControl>
      <Button
        onPress={updateProfile}
        mt="5"
        disabled={loading}
        colorScheme="primary"
      >
        {loading ? "Уншиж байна" : "Шинэчлэх"}
      </Button>
      <Button
        onPress={() => supabase.auth.signOut()}
        mt="2"
        colorScheme="primary"
      >
        Гарах
      </Button>
    </VStack>
  );
}
