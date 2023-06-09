import React from 'react'
import { View, Text, Image } from 'react-native';
import { PostType } from '../types';

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
