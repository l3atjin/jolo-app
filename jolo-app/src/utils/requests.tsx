import { supabase } from "../api/supabase";
import { PostType, RequestType, UserType } from "../types";

async function getUserDetails() {
  const { data: { user } } = await supabase.auth.getUser();
  console.log("in getUserDetails()", user)
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
        ...data
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

    const newData =  { 
      departure_location_id: departureId,
      destination_location_id: destinationId 
    }
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

    const newData =  { 
      departure_location_id: departureId,
      destination_location_id: destinationId,
      available_seats: params.available_seats,
      fee: params.fee
    }
    insertIntoTable("posts", newData, user.id);

    console.log("inserted ", newData);
  } else {
    // handle case where no user is logged in
    console.error("No user logged in");
  }
}

export async function fetchData(
  searchParams: { departure: string; destination: string; date: string },
  userType: UserType
): Promise<PostType[] | RequestType[] | null> {
  const table = userType === "rider" ? "posts" : "requests";
  const additionalFields = userType === "rider" ? ", fee, available_seats" : "";
  
  const { data, error } = await supabase
    .from(table)
    .select(`
      id,
      departure_time,
      user_id:profiles (first_name),
      departure_location_id:locations!${table}_departure_location_id_fkey(location_name),
      destination_location_id:locations!${table}_destination_location_id_fkey(location_name)
      ${additionalFields}
    `);

  if (error) {
    console.log("Error: ", error);
    return null;
  }

  const transformedData = data.map((post: any) => {
    const baseData = {
      id: post.id,
      departure_time: post.departure_time,
      authorName: post.user_id.first_name,
      departure: post.departure_location_id.location_name,
      destination: post.destination_location_id.location_name,
    };

    if (userType === "rider") {
      return {
        ...baseData,
        fee: post.fee,
        availableSeats: post.available_seats,
      };
    }

    return baseData;
  });

  console.log(JSON.stringify(transformedData, null, 2));
  console.log(JSON.stringify(data, null, 2));

  return transformedData;
}
