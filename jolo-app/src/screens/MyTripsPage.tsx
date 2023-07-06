import { ScrollView, Box, Heading } from 'native-base'
import React, { useEffect, useState } from 'react'
import Booking from '../components/Booking';
import Post from '../components/Post';
import { UserTypeProvider, useUserType } from '../context/UserTypeProvider';
import { BasePostType, PostType, RequestType } from '../types';
import { fetchUserPosts, fetchUserBookings } from '../utils/requests';  // new function

export default function MyTripsPage() {
  const [userPosts, setUserPosts] = useState<PostType[] | RequestType[] | null>(null);
  const [userBookings, setUserBookings] = useState<any[]>([]);  // set initial state to an empty array
  const [userType] = useUserType();

  useEffect(() => {
    async function getUserData() {
      const userPosts = await fetchUserPosts(userType);
      const userBookings = await fetchUserBookings(userType);  // new request

      setUserPosts(userPosts);
      setUserBookings(userBookings);  // update state
    }

    getUserData();
  }, []);

  const handleClick = (post: any) => {
    // Handle click
  }

  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Heading mt={20}>My posts:</Heading>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Heading mt={20}>Booking Requests:</Heading>
        {userBookings?.map((booking) => (
          <Booking key={booking.id} booking={booking} onClick={handleClick}/>  // render each booking request
        ))}
        <Heading mt={20}>My Posts:</Heading>
        {userPosts?.map((post) => (
          <Post key={post.id} post={post} onClick={() => handleClick(post)} />
        ))}
      </ScrollView>
    </Box>
  )
}
