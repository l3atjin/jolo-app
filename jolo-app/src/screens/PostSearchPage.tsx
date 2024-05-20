import React, { useEffect, useState } from "react";
import { Box, FlatList, Heading, Spinner, VStack } from "native-base";
import Post from "../components/Post";
import { useUserType } from "../context/UserTypeProvider";
import SearchForm from "../components/SearchForm";
import { SearchParams } from "./types";
import { fetchPosts } from "../api/posts";
import { PostResponse } from "../api/types";
import { insertBookingRider } from "../api/bookings";
import { PostModal } from "../components/PostModal";

export default function PostSearchPage( {navigation} ) {
  const [userType] = useUserType();
  const [data, setData] = useState<PostResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostResponse[0] | null>(
    null,
  );
  const [rideDetails, setRideDetails] = useState("");
  

  // Fetch posts on component mount
  useEffect(() => {
    async function fetchInitialData() {
      if (userType == "rider") {
        const initialData: PostResponse = await fetchPosts();
        setData(initialData);
      }
      setIsLoading(false);
    }
    fetchInitialData();
  }, []);

  async function submitSearch(searchParam: SearchParams) {
    setIsLoading(true);
    if (userType == "rider") {
      const newData: PostResponse = await fetchPosts(searchParam);
      setData(newData);
    }
    setIsLoading(false);
  }

  const handlePostClick = (post: PostResponse[0]) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    setRideDetails("");
  };

  const submitRequest = () => {
    console.log("Clicked book");
    // insert a new booking with pending status
    insertBookingRider(selectedPost, rideDetails);

  };

  const openChat = () => {
    navigation.navigate("InboxNavigation");
  }

  return (
    <Box p="5" bg="#F5F5F5" flex={1}>
      <VStack space={3}>
        <Heading>Хаа хүрэх гэж байна?</Heading>
        <SearchForm onSearchSubmit={submitSearch} />
        {isLoading ? <Spinner /> : (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <Post
                post={item}
                onClick={() => handlePostClick(item)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
        <PostModal
          post={selectedPost}
          handleClose={handleCloseModal}
          rideDetails={rideDetails}
          setRideDetails={setRideDetails}
          submitRequest={submitRequest}
          openChat={openChat}
        />
      </VStack>
    </Box>
  );
}
