export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      idea_agreements: {
        Row: {
          agreed_at: string
          id: string
          idea_id: string
          investor_id: string
        }
        Insert: {
          agreed_at?: string
          id?: string
          idea_id: string
          investor_id: string
        }
        Update: {
          agreed_at?: string
          id?: string
          idea_id?: string
          investor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_agreements_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_followers: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          investor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          investor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          investor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_followers_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_followers_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ideas: {
        Row: {
          business_stage: Database["public"]["Enums"]["business_stage"]
          category: string
          created_at: string
          description: string
          funding_needed: number
          funding_type: Database["public"]["Enums"]["funding_type"]
          id: string
          location: string | null
          pitch_deck_url: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          video_url: string | null
          views_count: number | null
        }
        Insert: {
          business_stage: Database["public"]["Enums"]["business_stage"]
          category: string
          created_at?: string
          description: string
          funding_needed: number
          funding_type?: Database["public"]["Enums"]["funding_type"]
          id?: string
          location?: string | null
          pitch_deck_url?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          video_url?: string | null
          views_count?: number | null
        }
        Update: {
          business_stage?: Database["public"]["Enums"]["business_stage"]
          category?: string
          created_at?: string
          description?: string
          funding_needed?: number
          funding_type?: Database["public"]["Enums"]["funding_type"]
          id?: string
          location?: string | null
          pitch_deck_url?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          video_url?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ideas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      investment_interests: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          investor_id: string
          message: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          investor_id: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          investor_id?: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_interests_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_name: string | null
          account_number: string | null
          approval_status: string | null
          avatar_storage_path: string | null
          avatar_url: string | null
          bank_completed: boolean | null
          bank_name: string | null
          bio: string | null
          business_address: string | null
          bvn: string | null
          contact_completed: boolean | null
          contact_phone: string | null
          created_at: string
          facebook: string | null
          full_name: string
          home_address: string | null
          id: string
          id_document_url: string | null
          id_number: string | null
          id_type: string | null
          industry: string | null
          instagram: string | null
          interests: string[] | null
          investment_range_max: number | null
          investment_range_min: number | null
          kyc_completed: boolean | null
          linkedin: string | null
          location: string | null
          nin: string | null
          organization: string | null
          stage: Database["public"]["Enums"]["business_stage"] | null
          startup_name: string | null
          twitter: string | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          approval_status?: string | null
          avatar_storage_path?: string | null
          avatar_url?: string | null
          bank_completed?: boolean | null
          bank_name?: string | null
          bio?: string | null
          business_address?: string | null
          bvn?: string | null
          contact_completed?: boolean | null
          contact_phone?: string | null
          created_at?: string
          facebook?: string | null
          full_name: string
          home_address?: string | null
          id?: string
          id_document_url?: string | null
          id_number?: string | null
          id_type?: string | null
          industry?: string | null
          instagram?: string | null
          interests?: string[] | null
          investment_range_max?: number | null
          investment_range_min?: number | null
          kyc_completed?: boolean | null
          linkedin?: string | null
          location?: string | null
          nin?: string | null
          organization?: string | null
          stage?: Database["public"]["Enums"]["business_stage"] | null
          startup_name?: string | null
          twitter?: string | null
          updated_at?: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          approval_status?: string | null
          avatar_storage_path?: string | null
          avatar_url?: string | null
          bank_completed?: boolean | null
          bank_name?: string | null
          bio?: string | null
          business_address?: string | null
          bvn?: string | null
          contact_completed?: boolean | null
          contact_phone?: string | null
          created_at?: string
          facebook?: string | null
          full_name?: string
          home_address?: string | null
          id?: string
          id_document_url?: string | null
          id_number?: string | null
          id_type?: string | null
          industry?: string | null
          instagram?: string | null
          interests?: string[] | null
          investment_range_max?: number | null
          investment_range_min?: number | null
          kyc_completed?: boolean | null
          linkedin?: string | null
          location?: string | null
          nin?: string | null
          organization?: string | null
          stage?: Database["public"]["Enums"]["business_stage"] | null
          startup_name?: string | null
          twitter?: string | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          idea_id: string | null
          report_type: string
          reported_by: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          idea_id?: string | null
          report_type: string
          reported_by: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          idea_id?: string | null
          report_type?: string
          reported_by?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_idea_views: { Args: { idea_id: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      business_stage: "idea" | "mvp" | "revenue" | "scaling"
      funding_type: "investor" | "crowdfunding"
      user_type: "entrepreneur" | "investor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      business_stage: ["idea", "mvp", "revenue", "scaling"],
      funding_type: ["investor", "crowdfunding"],
      user_type: ["entrepreneur", "investor"],
    },
  },
} as const
