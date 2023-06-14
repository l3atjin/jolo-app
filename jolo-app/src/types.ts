export interface PostType {
  id: any;
  fee: number;
  available_seats: number;
  departure_time: Date;
  author_name: string;
  departure_name: string;
  destination_name: string;
}

export interface RequestType {
  departure: string;
  destination: string;
  date: string;
  timeOfDate: string;
  description: string;
}
