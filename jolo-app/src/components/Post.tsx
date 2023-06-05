import React from 'react'
import { View, Text, Image } from 'react-native';

interface PostProps {
    id: string;
    authorName: string;
    authorPicture: string;
    authorType: string;
    departure: string;
    destination: string;
    date: string;
    time: string;
    fee: number;
  }

  const Post: React.FC<PostProps> = ({
    id,
    authorName,
    authorPicture,
    authorType,
    departure,
    destination,
    date,
    time,
    fee,
  }) => {
    return (
      <View>
        <Image source={{ uri: authorPicture }} />
        <Text>{authorName}</Text>
        <Text>{authorType}</Text>
        <Text>{departure}</Text>
        <Text>{destination}</Text>
        <Text>{date}</Text>
        <Text>{time}</Text>
        <Text>{fee}</Text>
      </View>
    );
  };

  export default Post;
