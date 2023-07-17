import { ScrollView, Box, Heading } from 'native-base';
import React, { useEffect, useState } from 'react';
import Booking from '../components/Booking';
import Post from '../components/Post';
import Request from '../components/Request';
import { useUserActivity } from '../context/UserPostsProvider';
import { useUserType } from '../context/UserTypeProvider';
import { fetchUserBookingsRequests, acceptBooking, rejectBooking } from '../utils/requests';

export default function MyTripsPage() {
  const [userType] = useUserType();
  const [pendingUserBookings, setPendingUserBookings] = useState<any[]>([]);
  const [acceptedUserBookings, setAcceptedUserBookings] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const {userPosts, userRequests, refreshUserActivity} = useUserActivity();

  useEffect(() => {
    async function getUserData() {
      await refreshUserActivity();
      const { pendingBookings, acceptedBookings } = await fetchUserBookingsRequests(userType);
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
        {userPosts &&
          <Box>
            <Heading mt={20}>My Posts</Heading>
            {userPosts.map((post) => (
              <Post key={post.id} post={post} onClick={() => handlePostClick(post)} />
            ))}
          </Box>
        }

        {userRequests &&
          <Box>
            <Heading mt={20}>My Requests</Heading>
            {userRequests.map((request) => (
              <Request key={request.id} request={request} onClick={() => handlePostClick(request)} />
            ))}
          </Box>
        }
        
        {userPosts?.map((post) => (
          <Post key={post.id} post={post} onClick={() => handlePostClick(post)} />
        ))}
      </ScrollView>
    </Box>
  )
}
