import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { useAuth } from "../context/Auth";
import AccountAvatar from "./AccountAvatar";
import { decode } from "base64-arraybuffer";

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [avatarUri, setAvatarUri] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
    <View style={styles.container}>
      <AccountAvatar
        avatarUri={avatarUri}
        onUpload={(imageUri, imageBase64) => {
          setImageBase64(imageBase64);
          setAvatarUri(imageUri);
        }}
      />
      <View style={styles.verticallySpaced}>
        <Input
          label="First Name"
          value={firstName || ""}
          onChangeText={(text) => setFirstName(text)}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Input
          label="Phone Number"
          value={phoneNumber || ""}
          onChangeText={(text) => setFirstName(text)}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? "Loading ..." : "Update"}
          onPress={() =>
            updateProfile()
          }
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
