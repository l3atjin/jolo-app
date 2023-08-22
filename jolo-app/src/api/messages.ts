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
  
  return conversations;
}

export async function sendMessage(newMessage, sender_id, receiver_id) {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        content: newMessage,
        sender_id: sender_id,
        receiver_id: receiver_id
      }
    ]);

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }

  // data will contain the newly inserted message data
  // const message = {
  //   id: data[0].id,
  //   content: data[0].content,
  //   created_at: data[0].created_at,
  //   sender: {
  //     id: data[0].sender_id,
  //     first_name: data[0].sender.first_name,
  //     avatar_url: data[0].sender.avatar_url
  //   },
  //   receiver: {
  //     id: data[0].receiver_id,
  //     first_name: data[0].receiver.first_name,
  //     avatar_url: data[0].receiver.avatar_url
  //   }
  // };

  // return message;
}
