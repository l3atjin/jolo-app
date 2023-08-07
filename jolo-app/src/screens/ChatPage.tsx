import React, { useEffect, useRef, useState } from "react";
import { Box, VStack, Input, Button, ScrollView, HStack, Text } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchMessages, sendMessage } from "../api/messages";
import { supabase } from "../api/supabase";
import { getUserDetails } from "../api/users";

type UserDetails = {
  id: string;
  first_name: string;
  avatar_url: string;
} | null;

const ChatPage = () => {
  const route = useRoute();
  const { conversation } = route.params;
  const [messages, setMessages] = useState(conversation.messages);
  const [newMessage, setNewMessage] = useState('');
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState<UserDetails>(null);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') {
      return;
    }
    
    const messageData = await sendMessage(newMessage, conversation.otherUser.id);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage('');
  };

  useEffect(() => {
    const getUserDetailsAndSubscribe = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const details = await getUserDetails(user?.id);
      setUserDetails(details);

      const channel = supabase
        .channel('postgresChangesChannel')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
        },
        (payload) => {
            const { new: newMessage } = payload;
            console.log("payload is:", JSON.stringify(newMessage, null, 2));
            console.log('userDetails.id:', userDetails?.id);
            console.log('otherUser.id:', conversation.otherUser.id);
            console.log('newMessage.sender_id:', newMessage.sender_id);
            console.log('newMessage.receiver_id:', newMessage.receiver_id);
            if([userDetails?.id, conversation.otherUser.id].includes(newMessage.sender_id) && 
              [userDetails?.id, conversation.otherUser.id].includes(newMessage.receiver_id)) {
                // If the new message is related to the current conversation, update messages
                newMessage.sender = newMessage.sender_id === conversation.otherUser.id ? conversation.otherUser : userDetails;
                newMessage.receiver = newMessage.receiver_id === conversation.otherUser.id ? conversation.otherUser : userDetails;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel);
      };
    }

    getUserDetailsAndSubscribe();
  }, [userDetails]);

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
