import { supabase } from "../api/supabase"
import { PostType, RequestType } from  "../types"

export async function insertRequest(params:RequestType) {
  console.log("PARAMS ARE:", params)
  const { data: { user } } = await supabase.auth.getUser()
  console.log("after auth.user()")
  console.log("user is", user)
  console.log("user id is", user.id)

  if (user) {
    // Get the IDs for the departure and destination locations
    const { data: departureData, error: departureError } = await supabase
      .from('locations')
      .select('id')
      .eq('location_name', params.departure);
      
    const { data: destinationData, error: destinationError } = await supabase
      .from('locations')
      .select('id')
      .eq('location_name', params.destination);
    
    if (departureError || destinationError || !departureData.length || !destinationData.length) {
      console.error('Error getting location IDs');
      console.error(departureError);
      console.error(destinationError);
      console.log(departureData)
      console.log(destinationData)
      return;
    }

    const departureId = departureData[0].id;
    const destinationId = destinationData[0].id;

    const { data, error } = await supabase
    .from('requests')
    .insert([
      { user_id: user.id, departure_location_id: departureId, destination_location_id: destinationId },
    ]);

    // handle response
    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
  } else {
    // handle case where no user is logged in
    console.error('No user logged in');
  }
}

export async function insertPost(params:PostType) {
  
}