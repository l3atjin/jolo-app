import React, { useEffect, useRef, useState } from "react";
import { Box, VStack, Input, Button, ScrollView, HStack, Text } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import { sendMessage } from "../api/messages";
import { supabase } from "../api/supabase";
import { getUserDetails } from "../api/users";
import { useAuth } from "../context/AuthProvider";
import { Header } from "@react-navigation/stack";

type UserDetails = {
  id: string;
  first_name: string;
  avatar_url: string;
} | null;

type Message = {
  id: string;
  content: string;
  created_at: string;
  sender: UserDetails;
  receiver: UserDetails;
};

type Conversation = {
  otherUser: UserDetails;
  messages: Message[];
};

const ChatPage = () => {
  const route = useRoute();
  const { conversation }: { conversation: Conversation } = route.params;
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [newMessage, setNewMessage] = useState<string>('');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { user } = useAuth();

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !user || !conversation.otherUser) {
      return;
    }

    try {
      await sendMessage(newMessage, user.id, conversation.otherUser.id);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };


  useEffect(() => {
    const getUserDetailsAndSubscribe = async () => {
      // console.log(JSON.stringify(user, null, 2));

      if (!user) {
        throw new Error('Login first');
      }

      const details = await getUserDetails(user.id);
      //console.log("Userdetails", JSON.stringify(userDetails, null, 2));
      setIsLoading(false);
      //console.log("detalils", details);

      const channel = supabase
        .channel('postgresChangesChannel')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
        },
        (payload) => {
            const { new: newMessage } = payload;
            if([user?.id, conversation.otherUser!.id].includes(newMessage.sender_id) && 
              [user?.id, conversation.otherUser!.id].includes(newMessage.receiver_id)) {
                // If the new message is related to the current conversation, update messages
                const tempDetails = {
                  id: details[0].id,
                  first_name: details[0].first_name,
                  avatar_url: details[0].avatar_url
                };
                //console.log("tempdetails:", JSON.stringify(tempDetails, null, 2));
                newMessage.sender = newMessage.sender_id === conversation.otherUser.id ? conversation.otherUser : tempDetails;
                newMessage.receiver = newMessage.receiver_id === conversation.otherUser.id ? conversation.otherUser : tempDetails;
                //console.log("newmessage: ", JSON.stringify(newMessage, null, 2));
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        })
        .subscribe()
      return () => {
        supabase.removeChannel(channel);
      };
    }

    getUserDetailsAndSubscribe();
  }, [user]);

  return (
    <Box flex={1}>
      <Button mt={20} onPress={() => navigation.goBack()}>
        Back to Inbox
      </Button>
      {!isLoading ? ( // Check if user details are loaded before displaying messages
        <ScrollView>
          <VStack p="2">
            {messages.map((message, index) => (
              <HStack key={index} alignItems="center" space={2} my="2">
                <Text>{message.sender!.first_name}:</Text>
                <Text>{message.content}</Text>
              </HStack>
            ))}
          </VStack>
        </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}
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