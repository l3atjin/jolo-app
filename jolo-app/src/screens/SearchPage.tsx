import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  FlatList,
  Heading,
  Modal,
  Spinner,
  VStack,
} from "native-base";
import Post from "../components/Post";
import { PostType, RequestType } from "../types";
import { useUserType } from "../context/UserTypeProvider";
import { fetchData } from "../utils/requests";
import SearchForm from "../components/SearchForm";
import { SearchParams } from "./types";


export default function SearchPage({ }) {
  const [userType] = useUserType();
  const [data, setData] = useState<PostType[] | RequestType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostType | RequestType | null>(null);


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

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

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
            renderItem={({ item }) => <Post post={item} onClick={() => handlePostClick(item) }/>}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
        <Modal isOpen={selectedPost !== null} onClose={handleCloseModal}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Мэдээлэл</Modal.Header>
            <Modal.Body>
              {/* Display your post details here */}
              <Text>Departure: {selectedPost?.departure}</Text>
              <Text>Destination: {selectedPost?.destination}</Text>
              <Text>Date: {selectedPost?.date}</Text>
              <Text>Time of day: {selectedPost?.timeOfDay}</Text>
              { selectedPost?.availableSeats && <Text>Available seats: {selectedPost?.availableSeats}</Text> }
              { selectedPost?.fee && <Text>Fee: {selectedPost?.fee}</Text>}
              {/* Add more details... */}
            </Modal.Body>
            <Modal.Footer>
              <Button onPress={handleCloseModal}>Close</Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </VStack>
    </Box>
  );
}

