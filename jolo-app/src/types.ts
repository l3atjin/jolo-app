export type PostType = BasePostType & {
  availableSeats: string;
  fee: string;
}

export type BasePostType = {
  id: any;
  departure: string;
  destination: string;
  date: Date;
  timeOfDay: string;
  exactTime: string;
  description: string;
  authorName: string;
}

export type RequestType = BasePostType;

export type UserType = "rider" | "driver";

export type UserTypeContextType = [UserType, React.Dispatch<React.SetStateAction<UserType>>];