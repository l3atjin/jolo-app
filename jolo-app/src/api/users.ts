import { Database } from "../../lib/database.types";
import { supabase } from "../api/supabase";
import { PostType, RequestType, UserType } from "../types";

export async function getUserDetails() {
  const { data: { user } } = await supabase.auth.getUser();
  console.log("in getUserDetails()", user);
  return user;
}