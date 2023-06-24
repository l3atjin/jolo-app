import { Box, HStack, Spacer, Text } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PostType, RequestType } from "../types";

interface PostComponentProps {
  post: PostType | RequestType;
  onClick: (post: PostType | RequestType) => void;
}

const Post: React.FC<PostComponentProps> = ({ post, onClick }) => {
  return (
    <TouchableOpacity onPress={() => {onClick(post)}}>
      <Box bg="white" p="3" rounded="lg" my="2" shadow="2">
        <HStack space={3} alignItems="center">
          <Text fontWeight="bold" fontSize="md">
            {post.authorName}
          </Text>
          <Text>
            {post.departure} - {post.destination}
          </Text>
          <Spacer />
          <Text>{post.timeOfDay}</Text>
          {(post as PostType).availableSeats && <Text>{(post as PostType).availableSeats}</Text>}
          {(post as PostType).fee && <Text>{(post as PostType).fee}</Text>}
        </HStack>
      </Box>
    </TouchableOpacity>
   
  );
};

export default Post;
