import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react'
import { View, Text, Button, FlatList, TextInput } from 'react-native'
import Post from '../components/Post';
import {SUPABASE_URL} from '@env'
import {SUPABASE_ANON_KEY} from '@env'
import { PostType } from '../types';

export default function SearchPage( { navigation } ) {
  const [searchParams, setSearchParams] = useState({
    departure: '',
    destination: '',
    date: '',
    //...add more search parameters as needed
  });


  const [posts, setPosts] = useState<PostType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch posts on component mount
  useEffect(() => {
    async function fetchInitialPosts() {
      const initialPosts = await fetchPosts(searchParams);
      setPosts(initialPosts);
      setIsLoading(false); 
    }

    fetchInitialPosts();
  }, []);

  async function submitSearch() {
    setIsLoading(true);
    const newPosts = await fetchPosts(searchParams);
    setPosts(newPosts)
    setIsLoading(false);
    console.log("After state init")
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

      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <Post post = {item} />)
          }
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}

async function fetchPosts(searchParams: { departure: string, destination: string, date: string }): Promise<PostType[] | null> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      fee,
      available_seats,
      departure_time,
      user_id:profiles (first_name),  
      departure_location_id:locations!posts_departure_location_id_fkey(location_name),
      destination_location_id:locations!posts_destination_location_id_fkey(location_name)
    `)

  if (error) {
    console.log('Error: ', error)
    return null;
  }

  
  
  const transformedData: PostType[] = data.map(post => {
    return {
      id: post.id,
      fee: post.fee,
      available_seats: post.available_seats,
      departure_time: post.departure_time,
      author_name: post.user_id.first_name,
      departure_name: post.departure_location_id.location_name,
      destination_name: post.destination_location_id.location_name
    };
  });
  
  console.log(JSON.stringify(transformedData, null, 2))
  console.log(JSON.stringify(data, null, 2))

  return transformedData;
}
