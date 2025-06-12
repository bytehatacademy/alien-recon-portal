export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          points: number | null
          title: string
          type: Database["public"]["Enums"]["activity_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          points?: number | null
          title: string
          type: Database["public"]["Enums"]["activity_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          points?: number | null
          title?: string
          type?: Database["public"]["Enums"]["activity_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_completions: {
        Row: {
          attempts: number | null
          completed_at: string | null
          created_at: string | null
          flag_submitted: string
          hints_used: number | null
          id: string
          ip_address: string | null
          mission_id: string | null
          points_earned: number
          time_spent: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          flag_submitted: string
          hints_used?: number | null
          id?: string
          ip_address?: string | null
          mission_id?: string | null
          points_earned: number
          time_spent?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          flag_submitted?: string
          hints_used?: number | null
          id?: string
          ip_address?: string | null
          mission_id?: string | null
          points_earned?: number
          time_spent?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mission_completions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          category: Database["public"]["Enums"]["mission_category"]
          created_at: string | null
          description: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          estimated_time: string
          file_url: string | null
          flag: string
          hints: Json | null
          id: string
          is_active: boolean | null
          mission_order: number
          points: number
          title: string
          unlock_requirement: string | null
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["mission_category"]
          created_at?: string | null
          description: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          estimated_time: string
          file_url?: string | null
          flag: string
          hints?: Json | null
          id: string
          is_active?: boolean | null
          mission_order: number
          points: number
          title: string
          unlock_requirement?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["mission_category"]
          created_at?: string | null
          description?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          estimated_time?: string
          file_url?: string | null
          flag?: string
          hints?: Json | null
          id?: string
          is_active?: boolean | null
          mission_order?: number
          points?: number
          title?: string
          unlock_requirement?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "missions_unlock_requirement_fkey"
            columns: ["unlock_requirement"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          completed_missions: string[] | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login: string | null
          name: string
          rank: Database["public"]["Enums"]["user_rank"] | null
          score: number | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          completed_missions?: string[] | null
          created_at?: string | null
          email: string
          id: string
          is_active?: boolean | null
          last_login?: string | null
          name: string
          rank?: Database["public"]["Enums"]["user_rank"] | null
          score?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          completed_missions?: string[] | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          rank?: Database["public"]["Enums"]["user_rank"] | null
          score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: Database["public"]["Enums"]["skill_category"]
          color: string
          created_at: string | null
          description: string
          icon: string
          id: string
          is_active: boolean | null
          max_level: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["skill_category"]
          color: string
          created_at?: string | null
          description: string
          icon: string
          id?: string
          is_active?: boolean | null
          max_level?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["skill_category"]
          color?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          is_active?: boolean | null
          max_level?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          id: string
          last_updated: string | null
          progress: number | null
          skill_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          last_updated?: string | null
          progress?: number | null
          skill_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          last_updated?: string | null
          progress?: number | null
          skill_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type:
        | "mission_completed"
        | "rank_promoted"
        | "hint_used"
        | "login"
        | "skill_improved"
        | "flag_submission"
      difficulty_level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
      mission_category:
        | "OSINT"
        | "Network Analysis"
        | "Digital Forensics"
        | "Threat Intelligence"
        | "Malware Analysis"
        | "Cryptography"
      skill_category:
        | "Technical"
        | "Analytical"
        | "Intelligence"
        | "Forensics"
        | "Security"
      user_rank:
        | "Recon Trainee"
        | "Cipher Cadet"
        | "Gamma Node"
        | "Sigma-51"
        | "Command Entity"
        | "Delta Agent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: [
        "mission_completed",
        "rank_promoted",
        "hint_used",
        "login",
        "skill_improved",
        "flag_submission",
      ],
      difficulty_level: ["Beginner", "Intermediate", "Advanced", "Expert"],
      mission_category: [
        "OSINT",
        "Network Analysis",
        "Digital Forensics",
        "Threat Intelligence",
        "Malware Analysis",
        "Cryptography",
      ],
      skill_category: [
        "Technical",
        "Analytical",
        "Intelligence",
        "Forensics",
        "Security",
      ],
      user_rank: [
        "Recon Trainee",
        "Cipher Cadet",
        "Gamma Node",
        "Sigma-51",
        "Command Entity",
        "Delta Agent",
      ],
    },
  },
} as const
