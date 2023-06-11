import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  Pressable,
} from "react-native";
import Post from "../components/Post";
import { PostType } from "../types";
import { StyleSheet } from "react-native";
import { useUserType } from "../context/UserTypeProvider";
import { supabase } from "../api/supabase";

export default function SearchPage({ navigation }) {
  const [userType] = useUserType();
  const [searchParams, setSearchParams] = useState({
    departure: "",
    destination: "",
    date: "",
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

  console.log("User type is", userType);

  async function submitSearch() {
    setIsLoading(true);
    const newPosts = await fetchPosts(searchParams);
    setPosts(newPosts);
    setIsLoading(false);
    console.log("After state init");
  }

  const handleChange = (name: string, value: string) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Departure"
        value={searchParams.departure}
        onChangeText={(text) => handleChange("departure", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Destination"
        value={searchParams.destination}
        onChangeText={(text) => handleChange("destination", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={searchParams.date}
        onChangeText={(text) => handleChange("date", text)}
      />
      <Button
        title="Search"
        onPress={submitSearch}
        color={styles.button.color}
      />

      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          style={styles.flatList}
          data={posts}
          renderItem={({ item }) => <Post post={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    color: "#fff",
    textAlign: "center",
    padding: 10,
    marginBottom: 10,
  },
  loadingText: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 18,
    color: "#000",
  },
  flatList: {
    marginTop: 20,
  },
});

async function fetchPosts(searchParams: {
  departure: string;
  destination: string;
  date: string;
}): Promise<PostType[] | null> {

  const { data, error } = await supabase.from("posts").select(`
      id,
      fee,
      available_seats,
      departure_time,
      user_id:profiles (first_name),  
      departure_location_id:locations!posts_departure_location_id_fkey(location_name),
      destination_location_id:locations!posts_destination_location_id_fkey(location_name)
    `);

  if (error) {
    console.log("Error: ", error);
    return null;
  }

  const transformedData: PostType[] = data.map((post) => {
    return {
      id: post.id,
      fee: post.fee,
      available_seats: post.available_seats,
      departure_time: post.departure_time,
      author_name: post.user_id.first_name,
      departure_name: post.departure_location_id.location_name,
      destination_name: post.destination_location_id.location_name,
    };
  });

  console.log(JSON.stringify(transformedData, null, 2));
  console.log(JSON.stringify(data, null, 2));

  return transformedData;
}
