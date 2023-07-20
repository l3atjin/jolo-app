import { Box, Heading, Input } from "native-base";
import React, { useState } from "react";
import { useUserActivity } from "../context/UserPostsProvider";
import { PostType } from "../types";
import { insertPost } from "../api/posts";
import PostForm from "./PostForm";

export default function DriverForm() {
  const [availableSeats, setAvailableSeats] = useState("");
  const [fee, setFee] = useState("");
  const { refreshUserActivity } = useUserActivity();

  const handleSubmit = async (data: PostType) => {
    // Handle submission specifically for Driver
    // add a check here to see if driver went through backrgound check
    data.availableSeats = availableSeats;
    data.fee = fee;
    await insertPost(data);
    await refreshUserActivity();
  };

  return (
    <Box mt="20">
      <Heading>Зорчигч хайж байна уу?</Heading>
      <PostForm onSubmit={handleSubmit}>
        <Input
          variant="rounded"
          placeholder="Хэдэн суудал байгаа вэ?"
          value={availableSeats}
          onChangeText={setAvailableSeats}
        />
        <Input
          variant="rounded"
          placeholder="Хэдээр явах вэ?"
          value={fee}
          onChangeText={setFee}
        />
      </PostForm>
    </Box>
  );
}
