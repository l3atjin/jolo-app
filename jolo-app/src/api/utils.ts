import { Database } from "../../lib/database.types";
import { supabase } from "../api/supabase";
import { PostType, RequestType, UserType } from "../types";

export async function getLocationId(locationName: string) {
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

export async function getPostAuthor(post_id: string | undefined, table: string) {
  const { data: author, error } = await supabase
    .from(table)
    .select("user_id")
    .eq("id", post_id);

  if (error || !author.length) {
    console.error("Error getting author ID for", error);
    return null;
  }

  return author[0].user_id;
}

export async function insertIntoTable(tableName: string, data: any) {
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