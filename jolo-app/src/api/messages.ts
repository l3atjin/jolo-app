import { Database } from "../../lib/database.types";
import { supabase } from "../api/supabase";

export async function fetchConversations() {
  const { data: { user } } = await supabase.auth.getUser();
  type Profile = Database["public"]["Tables"]["profiles"]["Row"];

  let query = supabase
    .from("messages")
    .select(`
      id,
      content,
      sender: profiles!messages_sender_id_fkey (id, first_name, avatar_url),
      receiver: profiles!messages_receiver_id_fkey (id, first_name, avatar_url),
      created_at
    `)
    .or(`sender_id.eq.${user?.id}, receiver_id.eq.${user?.id}`)
    .order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.log("Error fetching user posts: ", error);
    throw error;
  }

  const conversations = {};
  
  // this groups the messages into conversations based on the logged in user
  data.forEach((message) => {
    const otherUserId = message.sender.id === user?.id ? message.receiver.id : message.sender.id;
    
    if (!conversations[otherUserId]) {
      conversations[otherUserId] = {
        otherUser: message.sender.id === user?.id ? message.receiver : message.sender,
        messages: [message]
      };
    } else {
      conversations[otherUserId].messages.push(message);
    }

    // Sorting messages by created_at timestamp in each conversation
    conversations[otherUserId].messages.sort((a, b) => {
      return new Date(a.created_at) - new Date(b.created_at);
    });
  });
  
  return Object.values(conversations);
}
