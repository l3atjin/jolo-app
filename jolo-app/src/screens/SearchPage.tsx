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
  Input,
} from "native-base";
import Post from "../components/Post";
import { PostType, RequestType } from "../types";
import { useUserType } from "../context/UserTypeProvider";
import { fetchData, fetchUserPosts, insertBooking } from "../utils/requests";
import SearchForm from "../components/SearchForm";
import { SearchParams } from "./types";


export default function SearchPage({ }) {
  const [userType] = useUserType();
  const [data, setData] = useState<PostType[] | RequestType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostType | RequestType | null>(null);
  const [rideDetails, setRideDetails] = useState("");


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

  const submitRequest = () => {
    console.log("Clicked book");
    // insert a new booking with pending status
    insertBooking(selectedPost, rideDetails, userType);

  };

  const submitInvite = async () => {
    console.log("Clicked invite to ride");
    // check if the driver has any active posts
    const userPosts = await fetchUserPosts(userType);
    if (userPosts) {
      insertBooking(selectedPost, rideDetails, userType);
    } else {
      alert("Create a post first!");
    }
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
              <Text>{userType === "rider" ? "Жолоочийн нэр" : "Зорчигчийн нэр"}: {selectedPost?.authorName}</Text>
              <Text>Хаанаас: {selectedPost?.departure}</Text>
              <Text>Хаашаа: {selectedPost?.destination}</Text>
              <Text>Өдөр: {selectedPost?.date}</Text>
              <Text>Хэзээ: {selectedPost?.timeOfDay}</Text>
              { selectedPost?.availableSeats && <Text>Суудлын тоо: {selectedPost?.availableSeats}</Text> }
              { selectedPost?.fee && <Text>Төлбөр: {selectedPost?.fee}</Text>}
              {/* Add more details... */}
              <Input
                placeholder="Enter ride details or ask a question..."
                value={rideDetails}
                onChangeText={setRideDetails}
              />
            </Modal.Body>
            <Modal.Footer>
              {userType === "driver" && <Button onPress={submitInvite}>Суучих</Button>}
              {userType === "rider" && <Button onPress={submitRequest}>Явяаа</Button>}
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </VStack>
    </Box>
  );
}

