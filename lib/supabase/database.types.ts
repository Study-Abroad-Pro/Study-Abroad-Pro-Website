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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_audit: {
        Row: {
          action: string
          actor: string | null
          actor_email: string | null
          after: Json | null
          at: string
          before: Json | null
          entity: string | null
          entity_id: string | null
          id: number
          summary: string | null
        }
        Insert: {
          action: string
          actor?: string | null
          actor_email?: string | null
          after?: Json | null
          at?: string
          before?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: never
          summary?: string | null
        }
        Update: {
          action?: string
          actor?: string | null
          actor_email?: string | null
          after?: Json | null
          at?: string
          before?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: never
          summary?: string | null
        }
        Relationships: []
      }
      admin_profiles: {
        Row: {
          created_at: string
          full_name: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          body_md: string
          category: string | null
          cover_path: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          body_md?: string
          category?: string | null
          cover_path?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          body_md?: string
          category?: string | null
          cover_path?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          blurb: string | null
          code: string
          content: Json
          created_at: string
          flag_path: string | null
          headline: string | null
          hero_path: string | null
          id: string
          intro: string | null
          is_published: boolean
          lat: number
          lede: string | null
          levels_summary: string | null
          lon: number
          meta_description: string | null
          meta_title: string | null
          name: string
          programmes: string[]
          short: string | null
          slug: string
          sort_order: number
          stats: Json
          study_areas: string | null
          updated_at: string
        }
        Insert: {
          blurb?: string | null
          code: string
          content?: Json
          created_at?: string
          flag_path?: string | null
          headline?: string | null
          hero_path?: string | null
          id?: string
          intro?: string | null
          is_published?: boolean
          lat: number
          lede?: string | null
          levels_summary?: string | null
          lon: number
          meta_description?: string | null
          meta_title?: string | null
          name: string
          programmes?: string[]
          short?: string | null
          slug: string
          sort_order?: number
          stats?: Json
          study_areas?: string | null
          updated_at?: string
        }
        Update: {
          blurb?: string | null
          code?: string
          content?: Json
          created_at?: string
          flag_path?: string | null
          headline?: string | null
          hero_path?: string | null
          id?: string
          intro?: string | null
          is_published?: boolean
          lat?: number
          lede?: string | null
          levels_summary?: string | null
          lon?: number
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          programmes?: string[]
          short?: string | null
          slug?: string
          sort_order?: number
          stats?: Json
          study_areas?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string
          content: Json | null
          created_at: string | null
          headline: string | null
          id: string
          intro: string | null
          is_published: boolean | null
          lede: string | null
          levels: string[] | null
          meta_description: string | null
          meta_title: string | null
          name: string
          slug: string
          sort_order: number | null
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          content?: Json | null
          created_at?: string | null
          headline?: string | null
          id?: string
          intro?: string | null
          is_published?: boolean | null
          lede?: string | null
          levels?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          slug: string
          sort_order?: number | null
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: Json | null
          created_at?: string | null
          headline?: string | null
          id?: string
          intro?: string | null
          is_published?: boolean | null
          lede?: string | null
          levels?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          slug?: string
          sort_order?: number | null
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          assigned_to: string | null
          budget: string | null
          contacted_at: string | null
          created_at: string
          current_location: string | null
          email: string
          english_test: string | null
          form_type: string
          full_name: string
          id: string
          intake: string | null
          message: string | null
          notes: string | null
          phone: string
          preferred_country: string | null
          preferred_course: string | null
          qualification: string | null
          score: string | null
          source_path: string | null
          status: string
          utm: Json | null
          year_completed: number | null
        }
        Insert: {
          assigned_to?: string | null
          budget?: string | null
          contacted_at?: string | null
          created_at?: string
          current_location?: string | null
          email: string
          english_test?: string | null
          form_type: string
          full_name: string
          id?: string
          intake?: string | null
          message?: string | null
          notes?: string | null
          phone: string
          preferred_country?: string | null
          preferred_course?: string | null
          qualification?: string | null
          score?: string | null
          source_path?: string | null
          status?: string
          utm?: Json | null
          year_completed?: number | null
        }
        Update: {
          assigned_to?: string | null
          budget?: string | null
          contacted_at?: string | null
          created_at?: string
          current_location?: string | null
          email?: string
          english_test?: string | null
          form_type?: string
          full_name?: string
          id?: string
          intake?: string | null
          message?: string | null
          notes?: string | null
          phone?: string
          preferred_country?: string | null
          preferred_course?: string | null
          qualification?: string | null
          score?: string | null
          source_path?: string | null
          status?: string
          utm?: Json | null
          year_completed?: number | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          contact: Json
          forms: Json
          homepage: Json
          id: boolean
          updated_at: string
        }
        Insert: {
          contact?: Json
          forms?: Json
          homepage?: Json
          id?: boolean
          updated_at?: string
        }
        Update: {
          contact?: Json
          forms?: Json
          homepage?: Json
          id?: boolean
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
