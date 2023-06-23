import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Fab,
  FlatList,
  Heading,
  Icon,
  Input,
  Spinner,
  VStack,
} from "native-base";
import Post from "../components/Post";
import { PostType, RequestType } from "../types";
import { useUserType } from "../context/UserTypeProvider";
import { fetchData } from "../utils/requests";
import SearchForm from "../components/SearchForm";
import { SearchParams } from "./types";


export default function SearchPage({ navigation }) {
  const [userType] = useUserType();
  const [data, setData] = useState<PostType[] | RequestType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch posts on component mount
  useEffect(() => {
    async function fetchInitialData() {
      const initialPosts = await fetchData(userType);
      setData(initialPosts);
      setIsLoading(false);
    }
    fetchInitialData();
  }, []);

  console.log("User type is", userType);

  async function submitSearch(searchParams: SearchParams) {
    setIsLoading(true);
    alert("Pressed Search!");
    const newData = await fetchData(userType, searchParams);
    setData(newData);
    setIsLoading(false);
  }

  return (
    <Box p="5" bg="#F5F5F5" flex={1}>
      <VStack space={3}>
        <Heading>Хаа хүрэх гэж байна?</Heading>
        <SearchForm onSearchSubmit={submitSearch}/>

        {isLoading ? (
          <Spinner />
        ) : (
          <FlatList
            data={data}
            renderItem={({ item }) => <Post post={item} />}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </VStack>
    </Box>
  );
}

