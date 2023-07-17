import { Box, Heading } from "native-base";
import React from "react";
import { useUserActivity } from "../context/UserPostsProvider";
import { RequestType } from "../types";
import { insertRequest } from "../utils/requests";
import PostForm from "./PostForm";

export default function RiderForm() {
  const { refreshUserActivity } = useUserActivity();
  const handleSubmit = async (data: RequestType) => {
    // Handle submission specifically for Rider
    await insertRequest(data);
    await refreshUserActivity();
  };

  return (
    <Box mt="20">
      <Heading>Унаа хайж байна уу?</Heading>
      <PostForm onSubmit={handleSubmit} children={<></>}></PostForm>
    </Box>
  );
}
