export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string | null
          driver_id: string
          id: string
          post_id: string | null
          request_id: string | null
          rider_id: string
          status: Database["public"]["Enums"]["status_enum"] | null
        }
        Insert: {
          created_at?: string | null
          driver_id: string
          id?: string
          post_id?: string | null
          request_id?: string | null
          rider_id: string
          status?: Database["public"]["Enums"]["status_enum"] | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string
          id?: string
          post_id?: string | null
          request_id?: string | null
          rider_id?: string
          status?: Database["public"]["Enums"]["status_enum"] | null
        }
      }
      locations: {
        Row: {
          id: string
          location_name: string
        }
        Insert: {
          id?: string
          location_name: string
        }
        Update: {
          id?: string
          location_name?: string
        }
      }
      otps: {
        Row: {
          booking_id: string
          created_at: string | null
          expires_at: string
          id: string
          otp: string
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          otp: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          otp?: string
        }
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string | null
          id: string
          invoice_id: string | null
          status: Database["public"]["Enums"]["payment_status_enum"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          status: Database["public"]["Enums"]["payment_status_enum"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          status?: Database["public"]["Enums"]["payment_status_enum"]
          updated_at?: string | null
        }
      }
      posts: {
        Row: {
          available_seats: number
          created_at: string | null
          departure_day: string
          departure_location_id: string
          departure_time: string | null
          description: string | null
          destination_location_id: string
          fee: number
          id: string
          is_exact_time: boolean
          pickup: boolean | null
          time_of_day: Database["public"]["Enums"]["time_of_day_enum"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          available_seats: number
          created_at?: string | null
          departure_day: string
          departure_location_id: string
          departure_time?: string | null
          description?: string | null
          destination_location_id: string
          fee: number
          id?: string
          is_exact_time?: boolean
          pickup?: boolean | null
          time_of_day?: Database["public"]["Enums"]["time_of_day_enum"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          available_seats?: number
          created_at?: string | null
          departure_day?: string
          departure_location_id?: string
          departure_time?: string | null
          description?: string | null
          destination_location_id?: string
          fee?: number
          id?: string
          is_exact_time?: boolean
          pickup?: boolean | null
          time_of_day?: Database["public"]["Enums"]["time_of_day_enum"] | null
          updated_at?: string | null
          user_id?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          first_name: string | null
          id: string
          phone_number: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          first_name?: string | null
          id: string
          phone_number: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          first_name?: string | null
          id?: string
          phone_number?: string
          updated_at?: string | null
        }
      }
      requests: {
        Row: {
          created_at: string | null
          departure_day: string
          departure_location_id: string
          departure_time: string | null
          description: string | null
          destination_location_id: string
          fee: number
          id: string
          is_exact_time: boolean
          time_of_day: Database["public"]["Enums"]["time_of_day_enum"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          departure_day: string
          departure_location_id: string
          departure_time?: string | null
          description?: string | null
          destination_location_id: string
          fee: number
          id?: string
          is_exact_time?: boolean
          time_of_day?: Database["public"]["Enums"]["time_of_day_enum"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          departure_day?: string
          departure_location_id?: string
          departure_time?: string | null
          description?: string | null
          destination_location_id?: string
          fee?: number
          id?: string
          is_exact_time?: boolean
          time_of_day?: Database["public"]["Enums"]["time_of_day_enum"] | null
          updated_at?: string | null
          user_id?: string
        }
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string
          created_at: string | null
          id: string
          rating: number
        }
        Insert: {
          booking_id: string
          comment: string
          created_at?: string | null
          id?: string
          rating: number
        }
        Update: {
          booking_id?: string
          comment?: string
          created_at?: string | null
          id?: string
          rating?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      payment_status_enum: "Pending" | "Paid" | "Failed" | "Refunded"
      status_enum: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED"
      time_of_day_enum: "morning" | "afternoon" | "evening" | "night"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

