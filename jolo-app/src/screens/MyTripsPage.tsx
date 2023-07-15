import { ScrollView, Box, Heading } from 'native-base';
import React, { useEffect, useState } from 'react';
import Booking from '../components/Booking';
import Post from '../components/Post';
import { UserTypeProvider, useUserType } from '../context/UserTypeProvider';
import { BasePostType, PostType, RequestType } from '../types';
import { fetchUserPosts, fetchUserBookingsRequests, updateBooking, acceptBooking, rejectBooking } from '../utils/requests';

export default function MyTripsPage() {
  const [userPosts, setUserPosts] = useState<PostType[] | RequestType[] | null>(null);
  const [userType] = useUserType();
  const [pendingUserBookings, setPendingUserBookings] = useState<any[]>([]);
  const [acceptedUserBookings, setAcceptedUserBookings] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function getUserData() {
      const userPosts = await fetchUserPosts(userType);
      const { pendingBookings, acceptedBookings } = await fetchUserBookingsRequests(userType);
      setUserPosts(userPosts);
      setPendingUserBookings(pendingBookings);
      setAcceptedUserBookings(acceptedBookings);
    }

    getUserData();
  }, [refreshKey]);

  async function makePayment(booking: any) {
    return true;
  }

  const handleAccept = async (booking: any) => {
    // Here, makePayment is a placeholder
    const paymentSuccessful = await makePayment(booking);
  
    if (paymentSuccessful) {
      await acceptBooking(booking.id);
      setRefreshKey(refreshKey + 1);
    } else {
      // Handle failed payment
    }
  }
  

  const handleReject = async (booking: any) => {
    // delete booking or just update the status
    await rejectBooking(booking.id);
    setRefreshKey(refreshKey + 1);
  }

  const handlePostClick = (post) => {
    // should show post details here
    console.log("post clicked");
  }

  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Heading mt={20}>My Posts and Bookings</Heading>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Heading mt={20}>Pending Booking Requests:</Heading>
        {pendingUserBookings?.map((booking) => (
          <Booking key={booking.id} booking={booking} onAccept={handleAccept} onReject={handleReject} isPending={true}/>
        ))}
        <Heading mt={20}>Accepted Bookings:</Heading>
        {acceptedUserBookings?.map((booking) => (
          <Booking key={booking.id} booking={booking} onAccept={handleAccept} onReject={handleReject} isPending={false}/>
        ))}
        <Heading mt={20}>{userType === "driver" ? "My Posts:" : "My Requests"}</Heading>
        {userPosts?.map((post) => (
          <Post key={post.id} post={post} onClick={() => handlePostClick(post)} />
        ))}
      </ScrollView>
    </Box>
  )
}
