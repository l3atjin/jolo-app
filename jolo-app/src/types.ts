export type PostType = BasePostType & {
  availableSeats: string;
  fee: number;
}

export type BasePostType = {
  id: any;
  departure: string;
  destination: string;
  date: string;
  timeOfDay: string;
  description: string;
  authorName: string;
}

export type RequestType = BasePostType;

export type UserType = "rider" | "driver";
