export type Database = {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          budget: string | null;
          created_at: string;
          status: string;
        };
        Insert: {
          name: string;
          email: string;
          subject: string;
          message: string;
          budget?: string | null;
          created_at?: string;
          status?: string;
        };
        Update: {
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          budget?: string | null;
          created_at?: string;
          status?: string;
        };
        Relationships: [];
      };
      guestbook_entries: {
        Row: {
          id: string;
          name: string;
          message: string;
          created_at: string;
        };
        Insert: {
          name: string;
          message: string;
          id?: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          message?: string;
          id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      rate_limits: {
        Row: {
          id: string;
          ip_hash: string;
          action: string;
          created_at: string;
        };
        Insert: {
          ip_hash: string;
          action: string;
          id?: string;
          created_at?: string;
        };
        Update: {
          ip_hash?: string;
          action?: string;
          id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Convenience types derived from Database
export type ContactSubmission =
  Database["public"]["Tables"]["contact_submissions"]["Row"];
export type GuestbookEntry =
  Database["public"]["Tables"]["guestbook_entries"]["Row"];
export type RateLimit = Database["public"]["Tables"]["rate_limits"]["Row"];
