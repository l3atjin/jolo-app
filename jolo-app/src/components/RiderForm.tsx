import { Box, Heading } from 'native-base';
import React from 'react'
import { RequestType } from '../types';
import { insertRequest } from '../utils/requests';
import PostForm from './PostForm';

export default function RiderForm() {
  const handleSubmit = (data: RequestType) => {
    // Handle submission specifically for Rider
    insertRequest(data);
  };

  return (
    <Box mt="20">
      <Heading>Унаа хайж байна уу?</Heading>
      <PostForm onSubmit={handleSubmit}>    
      </PostForm>
    </Box>
  )
}
