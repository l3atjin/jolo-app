import { fetchUserBookingsRequests } from "./bookings";
import { fetchPosts } from "./posts";
import { fetchRequests } from "./requests";

export type PostResponse = Awaited<ReturnType<typeof fetchPosts>>;
export type RequestResponse = Awaited<ReturnType<typeof fetchRequests>>;
export type BookingResponse = Awaited<ReturnType<typeof fetchUserBookingsRequests>>;