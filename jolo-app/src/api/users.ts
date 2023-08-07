import { Database } from "../../lib/database.types";
import { supabase } from "../api/supabase";
import { PostType, RequestType, UserType } from "../types";

// fetches the profile from the db wither id=userId and returns it
export async function getUserDetails(userId: string) {
  type Profile = Database["public"]["Tables"]["profiles"]["Row"];
  let query = supabase
    .from("profiles")
    .select(`*`)
    .eq("id", userId);
  
  const { data, error } = await query.returns<Profile>();
  if (error) {
    console.error("error getting user details");
  }

  return data;
}

export async function fetchUserPosts(userType: UserType) {
  const { data: { user } } = await supabase.auth.getUser();
  console.log("in fetchUserPosts()", user);

  let query = supabase
    .from("posts")
    .select(`
      id,
      departure_time,
      author: profiles (first_name, avatar_url),
      departure_location:locations!posts_departure_location_id_fkey (location_name),
      destination_location:locations!posts_destination_location_id_fkey (location_name),
      departure_day,
      time_of_day,
      description,
      fee,
      available_seats
    `)
    .eq("user_id", user?.id);
  
  type Post = Database["public"]["Tables"]["posts"]["Row"];
  type Profile = Database["public"]["Tables"]["profiles"]["Row"];
  type Location = Database["public"]["Tables"]["locations"]["Row"];

  const { data, error } = await query.returns<
    (Post & {
      author: Profile;
      departure_location: Location;
      destination_location: Location;
    })[]
  >();
  
  console.log("User posts:", JSON.stringify(data, null, 2))

  if (error) {
    console.log("Error fetching user posts: ", error);
    throw error;
  }

  return data;
}
