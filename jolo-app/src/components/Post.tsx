import { Box, HStack, Spacer, Text } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PostResponse } from "../utils/requests";

interface PostComponentProps {
  post: PostResponse[0];
  onClick: (post: PostResponse[0]) => void;
}

const Post: React.FC<PostComponentProps> = ({ post, onClick }) => {
  return (
    <TouchableOpacity onPress={() => {onClick(post)}}>
      <Box bg="white" p="3" rounded="lg" my="2" shadow="2">
        <HStack space={3} alignItems="center">
          <Text fontWeight="bold" fontSize="md">
            {post.author.first_name}
          </Text>
          <Text>
            {post.departure_location.location_name} - {post.destination_location.location_name}
          </Text>
          <Spacer />
          <Text>{post.departure_day}</Text>
          <Text>{post.available_seats}</Text>
          <Text>{post.fee}</Text>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
};

export default Post;
