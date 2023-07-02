import { ScrollView, Box, Heading } from 'native-base'
import React, { useEffect, useState } from 'react'
import Post from '../components/Post';
import { UserTypeProvider, useUserType } from '../context/UserTypeProvider';
import { BasePostType, PostType, RequestType } from '../types';
import { fetchUserPosts } from '../utils/requests';

export default function MyTripsPage() {
  const [userPosts, setUserPosts] = useState<PostType[] | RequestType[] | null>(null);
  const [userType] = useUserType();

  useEffect(() => {
    async function getUserPosts () {
      const initialPosts = await fetchUserPosts(userType);
      setUserPosts(initialPosts);
    }
    getUserPosts();
  }, []);

  const handleClick = (post: any) => {
    // Handle click
  }

  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Heading mt={20}>My posts:</Heading>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        {userPosts?.map((post) => (
          <Post key={post.id} post={post} onClick={() => handleClick(post)} />
        ))}
      </ScrollView>
    </Box>
  )
}
