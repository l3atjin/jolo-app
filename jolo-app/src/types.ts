export interface PostType {
  id: any;
  fee: number;
  available_seats: number;
  departure: string;
  destination: string;
  date: string;
  timeOfDate: string;
  description: string;
}

export interface RequestType {
  departure: string;
  destination: string;
  date: string;
  timeOfDate: string;
  description: string;
}
