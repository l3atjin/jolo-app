import { Database } from "../../lib/database.types";
import { supabase } from "../api/supabase";
import { PostType, RequestType, UserType } from "../types";
import { getUserDetails } from "./users";
import { getLocationId, insertIntoTable } from "./utils";

export async function fetchUserRequests(userType: UserType) {
  const { data: { user } } = await supabase.auth.getUser();
  let query = supabase
    .from("requests")
    .select(`
      id,
      departure_time,
      author: profiles (first_name, avatar_url),
      departure_location:locations!requests_departure_location_id_fkey (location_name),
      destination_location:locations!requests_destination_location_id_fkey (location_name),
      departure_day,
      time_of_day,
      description
    `)
    .eq("user_id", user?.id);
  
  type Request = Database["public"]["Tables"]["requests"]["Row"];
  type Profile = Database["public"]["Tables"]["profiles"]["Row"];
  type Location = Database["public"]["Tables"]["locations"]["Row"];

  const { data, error } = await query.returns<
    (Request & {
      author: Profile;
      departure_location: Location;
      destination_location: Location;
    })[]
  >();
  
  console.log("User requests:", JSON.stringify(data, null, 2))

  if (error) {
    console.log("Error fetching user requests: ", error);
    throw error;
  }

  return data;
}

export async function insertRequest(params: RequestType) {
  console.log("PARAMS ARE:", params);
  const user = await getUserDetails();
  console.log("user id is", user?.id);

  if (user) {
    const departureId = await getLocationId(params.departure);
    const destinationId = await getLocationId(params.destination);

    const time = params.exactTime.toLocaleTimeString();
    console.log("Time is", params.exactTime.toTimeString().split(" ")[0]);
    console.log("Type is", time);

    const newData =  { 
      user_id: user.id,
      departure_location_id: departureId,
      destination_location_id: destinationId,
      description: params.description,
      ...(params.timeOfDay !== "Цаг оруулах" &&
        { time_of_day: params.timeOfDay }),
      departure_day: params.date,
      ...(params.timeOfDay === "Цаг оруулах" && { departure_time: params.exactTime.toTimeString().split(' ')[0] })
    }
    insertIntoTable("requests", newData);

    console.log("inserted ", newData);
  } else {
    // handle case where no user is logged in
    console.error("No user logged in");
  }
}

export async function fetchRequests(
  searchParams?: {
    departure?: string;
    destination?: string;
    date?: Date;
    timeOfDay?: string;
    sortBy?: "departure_day";
  },
) {
  type Request = Database["public"]["Tables"]["requests"]["Row"];
  type Profile = Database["public"]["Tables"]["profiles"]["Row"];
  type Location = Database["public"]["Tables"]["locations"]["Row"];

  let query = supabase
    .from("requests")
    .select(`
      id,
      departure_time,
      author:profiles (first_name, avatar_url),
      departure_location:locations!requests_departure_location_id_fkey (location_name),
      destination_location:locations!requests_destination_location_id_fkey (location_name),
      departure_day,
      time_of_day,
      description
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

    // Sort the results if a sortBy option is provided...
    if (searchParams.sortBy) {
      query = query.order(searchParams.sortBy, { ascending: false });
    }
  }

  const { data, error } = await query.returns<
    (Request & {
      author: Profile;
      departure_location: Location;
      destination_location: Location;
    })[]
  >();

  console.log("fetched requests are: ", JSON.stringify(data, 2, null));

  if (error) {
    console.log("Error: ", error);
    throw error;
  }

  return data;
}