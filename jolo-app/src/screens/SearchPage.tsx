import { createClient } from '@supabase/supabase-js';
import React, { useState } from 'react'
import { View, Text, Button, FlatList, TextInput } from 'react-native'
import Post from '../components/Post';
import {SUPABASE_URL} from '@env'
import {SUPABASE_ANON_KEY} from '@env'

export default function SearchPage( { navigation } ) {
  const [searchParams, setSearchParams] = useState({
    departure: '',
    destination: '',
    date: '',
    //...add more search parameters as needed
  });

  const tempPost = {
    id: "007",
    authorName: "Batjin",
    departure: "Darkhan",
    destination: "Ulaanbaatar",
    date: "Jun 5th",
    time: "Morning",
    fee: 25000,
  }

  const [posts, setPosts] = useState([tempPost]);

  async function submitSearch() {
    const newPosts = await fetchPosts(searchParams);
    setPosts(newPosts);
  }

  const handleChange = (name: string, value: string) => {
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
          <Post post = {item} />)
        }
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

async function fetchPosts(searchParams) {
  // Make an API request to fetch posts based on the search parameters.
  // Replace this with your actual API request.
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


  const { data, error } = await supabase
    .from('posts')
    .select(`
      fee,
      available_seats,
      departure_time,
      user_id:profiles (first_name),
      departure_location_id:locations (location_name),
      destination_location_id:locations (location_name)`)

  if (error) console.log('Error: ', error)
  else console.log('Posts: ', data)


  return posts;
}
