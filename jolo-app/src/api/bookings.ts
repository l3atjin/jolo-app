import { Database } from "../../lib/database.types";
import { supabase } from "../api/supabase";
import { PostType, RequestType, UserType } from "../types";
import { PostResponse, RequestResponse } from "../utils/requests";
import { getUserDetails } from "./users";
import { getPostAuthor, insertIntoTable } from "./utils";

export async function insertBookingRider(post: PostResponse[0] | null, message: string) {
  const user = await getUserDetails();
  const driver_id = await getPostAuthor(post?.id, "posts");
  if (user && post) {
    const newData =  { 
      post_id: post.id,
      driver_id: driver_id,
      rider_id: user.id,
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

export async function insertBookingDriver(driverPost: PostResponse[0] | null, message: string, riderRequest: RequestResponse[0] | null) {
  const user = await getUserDetails();

  if (user) {
    const rider_id = await getPostAuthor(riderRequest?.id, "requests");

    const newData =  { 
      post_id: driverPost?.id,
      request_id: riderRequest?.id,
      driver_id: user.id,
      rider_id: rider_id,
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

export async function fetchUserBookingsRequests(userType: UserType) {
  const user = await getUserDetails();
  type Post = Database["public"]["Tables"]["posts"]["Row"];
  type Booking = Database["public"]["Tables"]["bookings"]["Row"];
  type Profile = Database["public"]["Tables"]["profiles"]["Row"];

  if (user) {
    let query = supabase
      .from('bookings')
      .select(`
        id,
        post_id:posts (
          departure_location_id:locations!posts_departure_location_id_fkey(location_name),
          destination_location_id:locations!posts_destination_location_id_fkey(location_name),
          departure_day,
          time_of_day
        ),
        driver_id:profiles!bookings_driver_id_fkey (first_name),
        rider_id:profiles!bookings_rider_id_fkey (first_name),
        status,
        message
      `);

    if (userType === 'driver') {
      query = query
        .eq('driver_id', user.id)
        .is('request_id', null);
    } else if (userType === 'rider') {
      query = query
        .eq('rider_id', user.id)
        .not('request_id', "is", null);
    }

    const { data, error } = await query.returns<
      (Booking & {
        post: Post;
        driver_id: Profile;
        rider_id: Profile;
      })[]
    >();

    console.log("Ride Requests: ", JSON.stringify(data, null, 2));

    if (error) {
      console.error('Error fetching user bookings: ', error);
      return null;
    }
    // Separate bookings into two arrays based on status
    const pendingBookings = data.filter(b => b.status === 'PENDING');
    const acceptedBookings = data.filter(b => b.status === 'ACCEPTED');

    return { pendingBookings, acceptedBookings };
  } else {
    console.error('No user logged in');
    return null;
  }
}

export async function acceptBooking(bookingId: number) {
  // 1. Make a request to update the booking status
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'ACCEPTED' })
    .eq('id', bookingId);
  console.log("in acceptbooking");
  console.log("booking id is", bookingId);
  console.log(JSON.stringify(data, null, 2));
  // 2. Return the updated booking
  if (error) {
    console.error('Error accepting booking: ', error);
    return null;
  }
}

export async function rejectBooking(bookingId: number) {
  // 1. Make a request to update the booking status
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'REJECTED' })
    .eq('id', bookingId);
  console.log("in reject booking");
  console.log("booking id is", bookingId);
  console.log(JSON.stringify(data, null, 2));
  // 2. Return the updated booking
  if (error) {
    console.error('Error rejecting booking: ', error);
    return null;
  }
}