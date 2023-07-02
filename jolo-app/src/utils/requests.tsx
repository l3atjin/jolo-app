import { User } from "@supabase/supabase-js";
import { supabase } from "../api/supabase";
import { PostType, RequestType, UserType } from "../types";

async function getUserDetails() {
  const { data: { user } } = await supabase.auth.getUser();
  console.log("in getUserDetails()", user)
  return user;
}

export async function fetchUserPosts(userType: UserType) {
  const { data: { user } } = await supabase.auth.getUser();
  console.log("in fetchUserPosts()", user);
  const table = userType === "driver" ? "posts" : "requests";
  const additionalFields = userType === "driver" ? ", fee, available_seats" : "";

  let query = supabase
    .from(table)
    .select(`
      id,
      departure_time,
      user_id:profiles (first_name),
      departure_location_id:locations!${table}_departure_location_id_fkey(location_name),
      destination_location_id:locations!${table}_destination_location_id_fkey(location_name),
      departure_day,
      time_of_day,
      description
      ${additionalFields}
    `)
    .eq("user_id", user?.id);

  const { data, error } = await query;
  
  console.log("User posts:", JSON.stringify(data, null, 2))

  return transformedData(data, userType);
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

async function getPostAuthor(post_id: string) {
  const { data: author, error } = await supabase
    .from("requests")
    .select("user_id")
    .eq("id", post_id);

  if (error || !author.length) {
    console.error("Error getting author ID for", error);
    return null;
  }

  return author[0].user_id;
}

async function insertIntoTable(tableName: string, data: any) {
  const { data: response, error } = await supabase
    .from(tableName)
    .insert(data);

  // handle response
  if (error) {
    console.error(error);
  } else {
    console.log(response);
  }
}

export async function insertBooking(post: PostType | RequestType | null, message: string, userType: UserType) {
  const user = await getUserDetails();

  if (user && post) {
    const riderId = (userType === "rider") ? user.id : await getPostAuthor(post.id);

    const newData =  { 
      post_id: post.id,
      rider_id: riderId,
      initiated_by: userType.toUpperCase(),
      status: "PENDING",
      message: message
    }
    insertIntoTable("bookings", newData);

    console.log("inserted ", newData);
  } else {
    // handle case where no user is logged in
    console.error("No user logged in or post ");
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
    console.log("Time is", params.exactTime.toTimeString().split(' ')[0])
    console.log("Type is", time)

    const newData =  { 
      user_id: user.id,
      departure_location_id: departureId,
      destination_location_id: destinationId,
      description: params.description,
      ...(params.timeOfDay !== "Цаг оруулах" && { time_of_day: params.timeOfDay }),
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

export async function insertPost(params: PostType) {
  const user = await getUserDetails();

  if (user) {
    const departureId = await getLocationId(params.departure);
    const destinationId = await getLocationId(params.destination);

    const newData =  { 
      user_id: user.id,
      departure_location_id: departureId,
      destination_location_id: destinationId,
      available_seats: params.availableSeats,
      fee: params.fee,
      description: params.description,
      time_of_day: params.timeOfDay,
      departure_day: params.date,
      ...(params.timeOfDay === "Цаг оруулах" && { departure_time: params.exactTime })
    }
    insertIntoTable("posts", newData);

    console.log("inserted ", newData);
  } else {
    // handle case where no user is logged in
    console.error("No user logged in");
  }
}

export async function fetchAllPosts(
  userType: UserType,
  searchParams?: {
    departure?: string;
    destination?: string;
    date?: Date;
    timeOfDay?: string;
    availableSeats?: number;
    sortBy?: "date" | "availableSeats";
  },
): Promise<any> {
  const table = userType === "rider" ? "posts" : "requests";
  const additionalFields = userType === "rider" ? ", fee, available_seats" : "";

  let query = supabase
    .from(table)
    .select(`
      id,
      departure_time,
      user_id:profiles (first_name),
      departure_location_id:locations!${table}_departure_location_id_fkey(location_name),
      destination_location_id:locations!${table}_destination_location_id_fkey(location_name),
      departure_day,
      time_of_day,
      description
      ${additionalFields}
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

    // Add more conditions for other search parameters...
    // if (searchParams.date) {
    //   query = query.eq("date", searchParams.date);
    // }
    if (userType === "rider" && searchParams.availableSeats) {
      query = query.gt("available_seats", searchParams.availableSeats);
    }

    // Sort the results if a sortBy option is provided...
    if (searchParams.sortBy) {
      query = query.order(searchParams.sortBy, { ascending: false });
    }
  }

  const { data, error } = await query;

  if (error) {
    console.log("Error: ", error);
    return null;
  }

  console.log(JSON.stringify(transformedData(data, userType), null, 2));

  return transformedData(data, userType);
}

function transformedData(data: any, userType: UserType) {
  return data.map((post: any) => {
    const baseData = {
      id: post.id,
      exactTime: post.departure_time,
      authorName: post.user_id.first_name,
      departure: post.departure_location_id.location_name,
      destination: post.destination_location_id.location_name,
      description: post.description,
      date: post.departure_day,
      timeOfDay: post.time_of_day
    };

    if (userType === "rider") {
      return {
        ...baseData,
        fee: post.fee,
        availableSeats: post.available_seats,
      };
    }

    return baseData;
  })
}
