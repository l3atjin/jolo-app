import React, { useState } from 'react'
import { View, Text, Button, FlatList, TextInput } from 'react-native'

export default function SearchPage( { navigation } ) {
  const [searchParams, setSearchParams] = useState({
    departure: '',
    destination: '',
    date: '',
    //...add more search parameters as needed
  });

  const [posts, setPosts] = useState([]);

  async function submitSearch() {
    const newPosts = await fetchPosts(searchParams);
    setPosts(newPosts);
  }

  const handleChange = (name, value) => {
    setSearchParams(prevParams => ({
      ...prevParams,
      [name]: value,
    }));
  };

  return (
    <View>
      <TextInput
        placeholder="Departure"
        value={searchParams.departure}
        onChangeText={(text) => handleChange('departure', text)}
      />
      <TextInput
        placeholder="Destination"
        value={searchParams.destination}
        onChangeText={(text) => handleChange('destination', text)}
      />
      <TextInput
        placeholder="Date"
        value={searchParams.date}
        onChangeText={(text) => handleChange('date', text)}
      />
      <Button title="Search" onPress={submitSearch} />

      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Text>{item.title} {item.description}</Text>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

async function fetchPosts(searchParams) {
  // Make an API request to fetch posts based on the search parameters.
  // Replace this with your actual API request.
  const response = await fetch(`/api/posts?departure=${searchParams.departure}&destination=${searchParams.destination}&date=${searchParams.date}`);
  const posts = await response.json();

  return posts;
}
