import { Database } from "../../lib/database.types";
import { supabase } from "../api/supabase";
import { PostType, RequestType } from "../types";

async function getUserDetails() {
  const { data: { user } } = await supabase.auth.getUser();
  console.log("in getUserDetails()", user);
  return user;
}

async function getLocationId(locationName: string) {
  const { data: locationData, error } = await supabase
    .from("locations")
    .select("id")
    .eq("location_name", locationName);

  if (error || !locationData.length) {
    console.error("Error getting location ID for", locationName, error);
    return null;
  }

  return locationData[0].id;
}

async function insertIntoTable(tableName: string, data: any, user_id: string) {
  const { data: response, error } = await supabase
    .from(tableName)
    .insert([
      {
        user_id: user_id,
        ...data,
      },
    ]);

  // handle response
  if (error) {
    console.error(error);
  } else {
    console.log(response);
  }
}

export async function insertRequest(params: RequestType) {
  console.log("PARAMS ARE:", params);
  const user = await getUserDetails();
  console.log("user id is", user.id);

  if (user) {
    const departureId = await getLocationId(params.departure);
    const destinationId = await getLocationId(params.destination);

    const time = params.exactTime.toLocaleTimeString();
    console.log("Time is", params.exactTime.toTimeString().split(" ")[0]);
    console.log("Type is", time);

    const newData = {
      departure_location_id: departureId,
      destination_location_id: destinationId,
      description: params.description,
      ...(params.timeOfDay !== "Цаг оруулах" &&
        { time_of_day: params.timeOfDay }),
      departure_day: params.date,
      ...(params.timeOfDay === "Цаг оруулах" &&
        { departure_time: params.exactTime.toTimeString().split(" ")[0] }),
    };
    insertIntoTable("requests", newData, user.id);

    console.log("inserted ", newData);
  } else {
    // handle case where no user is logged in
    console.error("No user logged in");
  }
}

export async function insertPost(params: PostType) {
  const user = await getUserDetails();

  if (user) {
    const departureId = await getLocationId(params.departure);
    const destinationId = await getLocationId(params.destination);

    const newData = {
      departure_location_id: departureId,
      destination_location_id: destinationId,
      available_seats: params.availableSeats,
      fee: params.fee,
      description: params.description,
      time_of_day: params.timeOfDay,
      departure_day: params.date,
      ...(params.timeOfDay === "Цаг оруулах" &&
        { departure_time: params.exactTime }),
    };
    insertIntoTable("posts", newData, user.id);

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

  return data;
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
      author:profiles,
      author: profiles (first_name, avatar_url),
      departure_location:locations!posts_departure_location_id_fkey (location_name),
      destination_location:locations!posts_destination_location_id_fkey (location_name),
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

  if (error) {
    console.log("Error: ", error);
    throw error;
  }

  return data;
}

// export return types so that they can be used by components
export type PostResponse = Awaited<ReturnType<typeof fetchPosts>>;
export type RequestResponse = Awaited<ReturnType<typeof fetchRequests>>;
