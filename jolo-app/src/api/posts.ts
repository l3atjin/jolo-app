import { Database } from "../../lib/database.types";
import { supabase } from "../api/supabase";
import { PostType, RequestType, UserType } from "../types";
import { getLocationId, insertIntoTable } from "./utils";

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

export async function insertPost(params: PostType) {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const departureId = await getLocationId(params.departure);
    const destinationId = await getLocationId(params.destination);
    const time = params.exactTime.toLocaleTimeString();

    const newData =  { 
      user_id: user.id,
      departure_location_id: departureId,
      destination_location_id: destinationId,
      available_seats: params.availableSeats,
      fee: params.fee,
      description: params.description,
      ...(params.timeOfDay !== "Цаг оруулах" &&
        { time_of_day: params.timeOfDay }),
      departure_day: params.date,
      ...(params.timeOfDay === "Цаг оруулах" && { departure_time: params.exactTime.toTimeString().split(' ')[0] })
    }
    insertIntoTable("posts", newData);

    console.log("inserted ", newData);
  } else {
    // handle case where no user is logged in
    console.error("No user logged in");
  }
}

export async function fetchPosts(
  searchParams?: {
    departure?: string;
    destination?: string;
    date?: Date;
    timeOfDay?: string;
    availableSeats?: number;
    sortBy?: "departure_day" | "available_seats";
  },
) {
  type Post = Database["public"]["Tables"]["posts"]["Row"];
  type Profile = Database["public"]["Tables"]["profiles"]["Row"];
  type Location = Database["public"]["Tables"]["locations"]["Row"];

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
    `);

  if (searchParams) {
    if (searchParams.departure) {
      const departure_id = await getLocationId(searchParams.departure);
      query = query.eq("departure_location_id", departure_id);
    }

    if (searchParams.destination) {
      const destination_id = await getLocationId(searchParams.destination);
      query = query.eq("destination_location_id", destination_id);
    }

    if (searchParams.availableSeats) {
      query = query.gt("available_seats", searchParams.availableSeats);
    }

    if (searchParams.sortBy) {
      query = query.order(searchParams.sortBy, { ascending: false });
    }
  }

  const { data, error } = await query.returns<
    (Post & {
      author: Profile;
      departure_location: Location;
      destination_location: Location;
    })[]
  >();

  if (error) {
    console.log("Error: ", error);
    throw error;
  }
  console.log("posts are", JSON.stringify(data, null, 2));

  return data;
}