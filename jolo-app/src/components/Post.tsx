import React from 'react'
import { View, Text, Image } from 'react-native';

interface PostType {
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

const Post: React.FC<{ post: PostType }> = ({ post }) => {
return (
    <View>
        <Text>{post.authorName}</Text>
        <Text>{post.authorType}</Text>
        <Text>{post.departure}</Text>
        <Text>{post.destination}</Text>
        <Text>{post.date}</Text>
        <Text>{post.time}</Text>
        <Text>{post.fee}</Text>
    </View>
);
};

export default Post;
