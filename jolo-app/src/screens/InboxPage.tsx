import React, { useEffect, useState } from 'react'
import { Heading, Spinner, View, VStack } from 'native-base'
import { useNavigation } from "@react-navigation/native";
import Message from "../components/Message";
import { fetchConversations } from "../api/messages"; 

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
  }, []);

  const handleConversationClick = (conversationId: string) => {
    navigation.navigate("Chat", { conversationId });
  };
  return (
    <VStack p="5" flex={1}>
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
