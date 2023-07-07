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
  Select,
} from "native-base";
import Post from "../components/Post";
import { PostType, RequestType } from "../types";
import { useUserType } from "../context/UserTypeProvider";
import { fetchAllPosts, fetchUserPosts, insertBookingDriver, insertBookingRider } from "../utils/requests";
import SearchForm from "../components/SearchForm";
import { SearchParams } from "./types";


export default function SearchPage({ }) {
  const [userType] = useUserType();
  const [data, setData] = useState<PostType[] | RequestType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostType | RequestType | null>(null);
  const [rideDetails, setRideDetails] = useState("");
  const [selectedDriverPost, setSelectedDriverPost] = useState<PostType | null>(null);
  const [driverPosts, setDriverPosts] = useState<any[] | null>(null);


  // Fetch posts on component mount
  useEffect(() => {
    async function fetchInitialData() {
      const initialPosts = await fetchAllPosts(userType);
      setData(initialPosts);
      const userPosts = await fetchUserPosts(userType);
      setDriverPosts(userPosts);
      setIsLoading(false);
    }
    fetchInitialData();
  }, []);

  console.log("User type is", userType);

  async function submitSearch(searchParams: SearchParams) {
    setIsLoading(true);
    alert("Pressed Search!");
    const newData = await fetchAllPosts(userType, searchParams);
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
    insertBookingRider(selectedPost, rideDetails);

  };

  const submitInvite = async () => {
    console.log("Clicked invite to ride");
    // check if the driver has any active posts
    if (driverPosts) {
      // have driver choose which post he wants to invite to
      insertBookingDriver(selectedDriverPost, rideDetails, selectedPost);
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
              { userType === "driver" ? (isLoading ? (
                <Spinner />
              ) : (
                driverPosts?.map((item) => <Post key={item.id} post={item} onClick={ () => setSelectedDriverPost(item)}/>)
              )) : <></> }
              
              
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

