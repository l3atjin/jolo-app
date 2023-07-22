import React from "react";
import { Avatar, Box, HStack, Text, VStack, Spacer } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";

interface MessageProps {
  conversation: {
    otherUser: {
      first_name: string;
      avatar_url: string;
    },
    messages: {
      content: string;
      created_at: string;
    }[],
  },
  onClick: (otherUserId: string) => void;
}

const Message: React.FC<MessageProps> = ({ conversation, onClick }) => {
  const handleOnClick = () => {
    onClick(conversation);
  };

  return (
    <TouchableOpacity onPress={handleOnClick}>
      <Box bg="white" p="3" rounded="lg" my="2" shadow="2">
        <HStack space={5}>
          <Avatar source={{ uri: conversation.otherUser.avatar_url }} />
          <VStack alignItems="start">
            <Text bold>{conversation.otherUser.first_name}</Text>
            <Text>{conversation.messages[0].content}</Text>
          </VStack>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
};

export default Message;
