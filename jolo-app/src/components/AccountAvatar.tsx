import React from "react";
import { Avatar, Center, Pressable } from "native-base";
import * as ImagePicker from "expo-image-picker";

interface AvatarProps {
  avatarUri: string;
  onUpload: (imageUri: string, imageBase64: string | null | undefined) => void;
}

export default function AccountAvatar({
  avatarUri,
  onUpload,
}: AvatarProps) {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
      base64: true,
    });

    if (!result || !result.assets || result.assets.length == 0) {
      return;
    }

    if (!result.canceled) {
      onUpload(result.assets[0].uri, result.assets[0].base64);
    }
  };

  return (
    <Center>
      <Pressable onPress={pickImage}>
        <Avatar
          alignSelf="center"
          bg="gray.500"
          size="xl"
          source={{
            uri: avatarUri ||
              "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
          }}
        />
      </Pressable>
    </Center>
  );
}
