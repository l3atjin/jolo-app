import { Avatar, Box, HStack, Spacer, Text, VStack } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PostResponse } from "../utils/requests";

interface PostComponentProps {
  post: PostResponse[0];
  onClick: (post: PostResponse[0]) => void;
}

const Post: React.FC<PostComponentProps> = ({ post, onClick }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onClick(post);
      }}
    >
      <Box bg="white" p="3" rounded="lg" my="2" shadow="2">
        <HStack space={5}>
          <Avatar
            size="lg"
            source={{
              uri: post.author.avatar_url ||
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
            }}
          />
          <VStack alignItems="left">
            <Text fontWeight="bold" fontSize="md">
              {post.author.first_name}
            </Text>
            <Text>
              {post.departure_location.location_name} -{" "}
              {post.destination_location.location_name}
            </Text>
            <Spacer />
            <Text>{post.departure_day}</Text>
            <Text>Суудал: {post.available_seats}</Text>
            <Text>Үнэ: {post.fee}</Text>
          </VStack>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
};

export default Post;
