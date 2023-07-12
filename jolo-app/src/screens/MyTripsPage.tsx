import { ScrollView, Box, Heading } from 'native-base';
import React, { useEffect, useState } from 'react';
import Booking from '../components/Booking';
import Post from '../components/Post';
import { UserTypeProvider, useUserType } from '../context/UserTypeProvider';
import { BasePostType, PostType, RequestType } from '../types';
import { fetchUserPosts, fetchUserBookingsRequests } from '../utils/requests';

export default function MyTripsPage() {
  const [userPosts, setUserPosts] = useState<PostType[] | RequestType[] | null>(null);
  const [userBookings, setUserBookings] = useState<any[]>([]);  // set initial state to an empty array
  const [userType] = useUserType();

  useEffect(() => {
    async function getUserData() {
      const userPosts = await fetchUserPosts(userType);
      const userBookings = await fetchUserBookingsRequests(userType);  // new request

      setUserPosts(userPosts);
      setUserBookings(userBookings);  // update state
    }

    getUserData();
  }, []);

  const handleAccept = (booking: any) => {
    // they should be redirected to the payment page
  }

  const handleReject = (booking: any) => {
    // delete booking or just update the status
  }

  const handlePostClick = (post) => {
    // should show post details here
    console.log("post clicked");
  }

  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Heading mt={20}>My Posts and Bookings</Heading>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Heading mt={20}>Booking Requests:</Heading>
        {userBookings?.map((booking) => (
          <Booking key={booking.id} booking={booking} onAccept={handleAccept} onReject={handleReject}/>  // render each booking request
        ))}
        <Heading mt={20}>{userType === "driver" ? "My Posts:" : "My Requests"}</Heading>
        {userPosts?.map((post) => (
          <Post key={post.id} post={post} onClick={() => handlePostClick(post)} />
        ))}
      </ScrollView>
    </Box>
  )
}
