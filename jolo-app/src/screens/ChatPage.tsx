import React, { useEffect, useState } from "react";
import { Box, VStack, Input, Button, ScrollView, HStack, Text } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchMessages, sendMessage } from "../api/messages";

const ChatPage = () => {
  const route = useRoute();
  const { conversation } = route.params;
  console.log("passed in props are: ", JSON.stringify(conversation, null, 2));
  const [messages, setMessages] = useState(conversation.messages);
  const [newMessage, setNewMessage] = useState('');
  const navigation = useNavigation();

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') {
      return;
    }
    
    const messageData = await sendMessage(newMessage, conversation.otherUser.id);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage('');
  };

  return (
    <Box flex={1}>
      <Button mt = {20} onPress={() => navigation.goBack()}>Back to Inbox</Button>
      <ScrollView>
        <VStack p="2">
          {messages.map((message, index) => (
            <HStack key={index} alignItems="center" space={2} my="2">
              <Text>{message.sender.first_name}:</Text>
              <Text>{message.content}</Text>
            </HStack>
          ))}
        </VStack>
      </ScrollView>
      <Box>
        <Input
          placeholder="New Message"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button onPress={handleSendMessage}>Send Message</Button>
      </Box>
    </Box>
  );
};

export default ChatPage;
