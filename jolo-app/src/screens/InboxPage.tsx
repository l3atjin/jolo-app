import React, { useEffect, useState } from 'react'
import { Heading, Spinner, View, VStack } from 'native-base'
import { useNavigation } from "@react-navigation/native";
import Message from "../components/Message";
import { fetchConversations } from "../api/messages"; 
import { supabase } from "../api/supabase";

export default function InboxPage() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    async function getConversations() {
      const conversationsData = await fetchConversations();
      setConversations(conversationsData);
      setIsLoading(false);
    }

    getConversations();
    const channel = supabase
    .channel('postgresChangesChannel')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages'
    }, payload => console.log("message added: ", payload))
    .subscribe()

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleConversationClick = (conversation: any) => {
    navigation.navigate("Chat", { conversation });
  };
  return (
    <VStack p="5" flex={1}>
      <Heading>Inbox</Heading>
      {isLoading ? (
        <Spinner />
      ) : (
        conversations.map((conversation, index) => (
          <Message key={index} conversation={conversation} onClick={handleConversationClick} />
        ))
      )}
    </VStack>
  )
}
