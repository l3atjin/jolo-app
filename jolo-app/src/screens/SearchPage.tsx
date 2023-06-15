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
import DateTimePicker from '@react-native-community/datetimepicker';
import Post from "../components/Post";
import { PostType, RequestType } from "../types";
import { useUserType } from "../context/UserTypeProvider";
import { fetchData } from "../utils/requests";

export default function SearchPage({ navigation }) {
  const [userType] = useUserType();
  const [searchParams, setSearchParams] = useState({
    departure: "",
    destination: "",
    date: "",
    //...add more search parameters as needed
  });

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

  async function submitSearch() {
    setIsLoading(true);
    alert("Pressed Search!");
    const newData = await fetchData(userType, searchParams);
    setData(newData);
    setIsLoading(false);
  }

  const handleChange = (name: string, value: string) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  return (
    <Box p="5" bg="#F5F5F5" flex={1}>
      <VStack space={3}>
        <Heading>Хаа хүрэх гэж байна?</Heading>
        <Input
          variant="outline"
          placeholder="Хаанаас"
          value={searchParams.departure}
          onChangeText={(text) => handleChange("departure", text)}
        />
        <Input
          variant="outline"
          placeholder="Хаашаа"
          value={searchParams.destination}
          onChangeText={(text) => handleChange("destination", text)}
        />
        <Input
          variant="outline"
          placeholder="Өдөр"
          value={searchParams.date}
          onChangeText={(text) => handleChange("date", text)}
        />
        <Button onPress={submitSearch}>
          Хайх
        </Button>

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

