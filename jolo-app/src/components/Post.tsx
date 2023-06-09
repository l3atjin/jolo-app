import React from 'react'
import { View, Text, Image } from 'react-native';

interface PostType {
  id: any;
  fee: number;
  available_seats: number;
  departure_time: Date;
  author_name: string;
  departure_name: string;
  destination_name: string;
}

const Post: React.FC<{ post: PostType }> = ({ post }) => {
return (
	<View>
		<Text>{post.author_name}</Text>
		<Text>{post.departure_name}</Text>
		<Text>{post.destination_name}</Text>
		<Text>{post.departure_time}</Text>
		<Text>{post.available_seats}</Text>
		<Text>{post.fee}</Text>
	</View>

	);
};

export default Post;
