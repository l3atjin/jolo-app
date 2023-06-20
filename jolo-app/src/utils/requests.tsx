import { supabase } from "../api/supabase";
import { PostType, RequestType } from "../types";

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
