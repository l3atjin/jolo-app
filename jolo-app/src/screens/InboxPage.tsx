import React, { useEffect, useState } from 'react'
import { Heading, Spinner, View, VStack } from 'native-base'
import { useNavigation } from "@react-navigation/native";
import Message from "../components/Message";
import { fetchConversations } from "../api/messages"; 
import { supabase } from "../api/supabase";
import { getUserDetails } from '../api/users';
import { useIsFocused } from '@react-navigation/native';

export default function InboxPage() {
  const [conversations, setConversations] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function getConversations() {
      console.log("fetching conversations in inbox page ...");
      const conversationsData = await fetchConversations();
      setConversations(conversationsData);
      setIsLoading(false);
    }
    async function fetchUser() {
      const user = await supabase.auth.getUser();
      setUser(user);
    }
    

    getConversations();
    fetchUser();
    const channel = supabase
    .channel('postgresChangesChannel')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages'
    }, 
    async (payload) => {
      const { new: newMessage } = payload; // new message from the payload
      const otherUserId = newMessage.sender_id !== user!.id ? newMessage.sender_id : newMessage.receiver_id;
      const otherUserDetails = await getUserDetails(otherUserId);
      
      setConversations(prevConversations => {
        if(prevConversations[otherUserId]) {
          // If conversation with the user already exists, append new message
          return {
            ...prevConversations,
            [otherUserId]: {
              ...prevConversations[otherUserId],
              messages: [...prevConversations[otherUserId].messages, newMessage]
            }
          }
        } else {
          // If conversation with the user does not exist, create a new one
          return {
            ...prevConversations,
            [otherUserId]: {
              otherUser: newMessage.sender_id === user.id ? newMessage.receiver : newMessage.sender,
              messages: [newMessage]
            }
          }
        }
      });
    })
    .subscribe()

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isFocused]);

  const handleConversationClick = (conversation: any) => {
    navigation.navigate("Chat", { conversation });
  };
  return (
    <VStack p="5" flex={1}>
      <Heading>Inbox</Heading>
      {isLoading ? (
        <Spinner />
      ) : (
        Object.values(conversations).map((conversation, index) => (
          <Message key={index} conversation={conversation} onClick={handleConversationClick} />
        ))
      )}
    </VStack>
  )
}
