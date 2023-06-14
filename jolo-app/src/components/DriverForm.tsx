import { Box, Heading, Input } from "native-base";
import React, { useState } from "react";
import { insertPost } from "../utils/requests";
import PostForm from "./PostForm";

export default function DriverForm() {
  const [availableSeats, setAvailableSeats] = useState("");
  const [fee, setFee] = useState("");

  const handleSubmit = (data) => {
    // Handle submission specifically for Driver
    data.availableSeats = availableSeats;
    data.fee = fee;
    insertPost(data);
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
