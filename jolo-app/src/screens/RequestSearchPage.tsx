import React, { useEffect, useState } from "react";
import { Box, FlatList, Heading, Spinner, VStack } from "native-base";
import Request from "../components/Request"; // make sure you have this component
import { useUserType } from "../context/UserTypeProvider";
import SearchForm from "../components/SearchForm";
import { SearchParams } from "./types";
import { fetchRequests, RequestResponse, insertBookingDriver, PostResponse, fetchUserPosts } from "../utils/requests"; // create these functions
import { RequestModal } from "../components/RequestModal";
import Post from "../components/Post";

export default function RequestSearchPage() {
  const [userType] = useUserType();
  const [data, setData] = useState<RequestResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RequestResponse[0] | null>(
    null,
  );
  const [selectedPost, setSelectedPost] = useState<PostResponse[0] | null>(
    null,
  );
  const [rideDetails, setRideDetails] = useState("");
  const [userPosts, setUserPosts] = useState<PostResponse | null>(
    null,
  );
  // Fetch requests on component mount
  useEffect(() => {
    async function fetchInitialData() {
      const initialData: RequestResponse = await fetchRequests();
      setData(initialData);
      const initialUserPosts = await fetchUserPosts(userType);
      setUserPosts(initialUserPosts);
      setIsLoading(false);
    }
    fetchInitialData();
  }, []);

  async function submitSearch(searchParam: SearchParams) {
    setIsLoading(true);
    if (userType == "driver") {
      const newData: RequestResponse = await fetchRequests(searchParam);
      setData(newData);
    }
    setIsLoading(false);
  }

  const handleRequestClick = (request: RequestResponse[0]) => {
    setSelectedRequest(request);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
    setSelectedPost(null);
    setRideDetails("");
  };

  const submitInvite = async () => {
    console.log("Clicked invite to ride");
    // check if the driver has any active posts
    if (userPosts) {
      // have driver choose which post he wants to invite to
      if (!selectedPost) {
        alert("Pick a post to invite to!");
      }
      insertBookingDriver(selectedPost, rideDetails, selectedRequest);
    } else {
      alert("Create a post first!");
    }
  };

  return (
    <Box p="5" bg="#F5F5F5" flex={1}>
      <VStack space={3}>
        <Heading>Хүн хайж байна уу?</Heading>
        <SearchForm onSearchSubmit={submitSearch} />
        {isLoading ? <Spinner /> : (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <Request
                request={item}
                onClick={() => handleRequestClick(item)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
        <RequestModal
          request={selectedRequest}
          handleClose={handleCloseModal}
          rideDetails={rideDetails}
          setRideDetails={setRideDetails}
          submitRequest={submitInvite}>
        { userType === "driver" ? (isLoading ? (
            <Spinner />
          ) : (
            userPosts?.map((item) => <Post key={item.id} post={item} onClick={ () => setSelectedPost(item)}/>)
          )) : <></> }
        </RequestModal>
      </VStack>
    </Box>
  );
}
