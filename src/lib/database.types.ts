
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "blocks": {
                  Row: {
                    "blocked_id": string,"blocker_id": string,"created_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "blocked_id": string,"blocker_id": string,"created_at"?: string
                  }
                  Update: {
                    "blocked_id"?: string,"blocker_id"?: string,"created_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "blocks_blocked_id_fkey"
      columns: ["blocked_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "blocks_blocked_id_fkey"
      columns: ["blocked_id"]
isOneToOne: false
      referencedRelation: "profiles_public"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "blocks_blocker_id_fkey"
      columns: ["blocker_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "blocks_blocker_id_fkey"
      columns: ["blocker_id"]
isOneToOne: false
      referencedRelation: "profiles_public"
      referencedColumns: ["id"]
    }
                  ]
                },"conversation_reads": {
                  Row: {
                    "conversation_id": string,"last_read_at": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "conversation_id": string,"last_read_at"?: string,"user_id": string
                  }
                  Update: {
                    "conversation_id"?: string,"last_read_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "conversation_reads_conversation_id_fkey"
      columns: ["conversation_id"]
isOneToOne: false
      referencedRelation: "conversations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "conversation_reads_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "conversation_reads_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles_public"
      referencedColumns: ["id"]
    }
                  ]
                },"conversations": {
                  Row: {
                    "created_at": string,"id": string,"interested_id": string,"last_message_at": string | null,"owner_id": string,"post_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"interested_id": string,"last_message_at"?: string | null,"owner_id": string,"post_id": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"interested_id"?: string,"last_message_at"?: string | null,"owner_id"?: string,"post_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "conversations_interested_id_fkey"
      columns: ["interested_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "conversations_interested_id_fkey"
      columns: ["interested_id"]
isOneToOne: false
      referencedRelation: "profiles_public"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "conversations_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "conversations_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: false
      referencedRelation: "profiles_public"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "conversations_post_id_fkey"
      columns: ["post_id"]
isOneToOne: false
      referencedRelation: "posts"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "conversations_post_id_fkey"
      columns: ["post_id"]
isOneToOne: false
      referencedRelation: "posts_public"
      referencedColumns: ["id"]
    }
                  ]
                },"interactions": {
                  Row: {
                    "action": Database["public"]['Enums']["interaction_action"],"created_at": string,"id": string,"post_id": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "action": Database["public"]['Enums']["interaction_action"],"created_at"?: string,"id"?: string,"post_id": string,"user_id": string
                  }
                  Update: {
                    "action"?: Database["public"]['Enums']["interaction_action"],"created_at"?: string,"id"?: string,"post_id"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "interactions_post_id_fkey"
      columns: ["post_id"]
isOneToOne: false
      referencedRelation: "posts"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "interactions_post_id_fkey"
      columns: ["post_id"]
isOneToOne: false
      referencedRelation: "posts_public"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "interactions_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "interactions_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles_public"
      referencedColumns: ["id"]
    }
                  ]
                },"messages": {
                  Row: {
                    "body": string,"conversation_id": string,"created_at": string,"id": string,"sender_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "body": string,"conversation_id": string,"created_at"?: string,"id"?: string,"sender_id": string
                  }
                  Update: {
                    "body"?: string,"conversation_id"?: string,"created_at"?: string,"id"?: string,"sender_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "messages_conversation_id_fkey"
      columns: ["conversation_id"]
isOneToOne: false
      referencedRelation: "conversations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "messages_sender_id_fkey"
      columns: ["sender_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "messages_sender_id_fkey"
      columns: ["sender_id"]
isOneToOne: false
      referencedRelation: "profiles_public"
      referencedColumns: ["id"]
    }
                  ]
                },"post_photos": {
                  Row: {
                    "created_at": string,"id": string,"position": number,"post_id": string,"url": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"position"?: number,"post_id": string,"url": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"position"?: number,"post_id"?: string,"url"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "post_photos_post_id_fkey"
      columns: ["post_id"]
isOneToOne: false
      referencedRelation: "posts"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "post_photos_post_id_fkey"
      columns: ["post_id"]
isOneToOne: false
      referencedRelation: "posts_public"
      referencedColumns: ["id"]
    }
                  ]
                },"posts": {
                  Row: {
                    "age": Database["public"]['Enums']["pet_age"] | null,"author_id": string,"created_at": string,"description": string,"event_date": string | null,"id": string,"location": unknown,"location_label": string,"pet_name": string | null,"resolved_at": string | null,"search_radius_km": number,"sex": Database["public"]['Enums']["pet_sex"],"size": Database["public"]['Enums']["pet_size"] | null,"species": Database["public"]['Enums']["pet_species"],"status": Database["public"]['Enums']["pet_status"],"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "age"?: Database["public"]['Enums']["pet_age"] | null,"author_id": string,"created_at"?: string,"description": string,"event_date"?: string | null,"id"?: string,"location": unknown,"location_label": string,"pet_name"?: string | null,"resolved_at"?: string | null,"search_radius_km"?: number,"sex"?: Database["public"]['Enums']["pet_sex"],"size"?: Database["public"]['Enums']["pet_size"] | null,"species": Database["public"]['Enums']["pet_species"],"status": Database["public"]['Enums']["pet_status"],"updated_at"?: string
                  }
                  Update: {
                    "age"?: Database["public"]['Enums']["pet_age"] | null,"author_id"?: string,"created_at"?: string,"description"?: string,"event_date"?: string | null,"id"?: string,"location"?: unknown,"location_label"?: string,"pet_name"?: string | null,"resolved_at"?: string | null,"search_radius_km"?: number,"sex"?: Database["public"]['Enums']["pet_sex"],"size"?: Database["public"]['Enums']["pet_size"] | null,"species"?: Database["public"]['Enums']["pet_species"],"status"?: Database["public"]['Enums']["pet_status"],"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "posts_author_id_fkey"
      columns: ["author_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "posts_author_id_fkey"
      columns: ["author_id"]
isOneToOne: false
      referencedRelation: "profiles_public"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "city": string | null,"created_at": string,"id": string,"name": string,"show_whatsapp": boolean,"updated_at": string,"whatsapp": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "city"?: string | null,"created_at"?: string,"id": string,"name": string,"show_whatsapp"?: boolean,"updated_at"?: string,"whatsapp"?: string | null
                  }
                  Update: {
                    "city"?: string | null,"created_at"?: string,"id"?: string,"name"?: string,"show_whatsapp"?: boolean,"updated_at"?: string,"whatsapp"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"reports": {
                  Row: {
                    "created_at": string,"details": string | null,"id": string,"post_id": string | null,"reason": string,"reported_user_id": string | null,"reporter_id": string,"resolved_at": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"details"?: string | null,"id"?: string,"post_id"?: string | null,"reason": string,"reported_user_id"?: string | null,"reporter_id": string,"resolved_at"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"details"?: string | null,"id"?: string,"post_id"?: string | null,"reason"?: string,"reported_user_id"?: string | null,"reporter_id"?: string,"resolved_at"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "reports_post_id_fkey"
      columns: ["post_id"]
isOneToOne: false
      referencedRelation: "posts"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_post_id_fkey"
      columns: ["post_id"]
isOneToOne: false
      referencedRelation: "posts_public"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_reported_user_id_fkey"
      columns: ["reported_user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_reported_user_id_fkey"
      columns: ["reported_user_id"]
isOneToOne: false
      referencedRelation: "profiles_public"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_reporter_id_fkey"
      columns: ["reporter_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_reporter_id_fkey"
      columns: ["reporter_id"]
isOneToOne: false
      referencedRelation: "profiles_public"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            "posts_public": {
                  Row: {
                    "age": Database["public"]['Enums']["pet_age"] | null,"author_city": string | null,"author_id": string | null,"author_name": string | null,"author_show_whatsapp": boolean | null,"author_whatsapp": string | null,"created_at": string | null,"description": string | null,"event_date": string | null,"id": string | null,"lat": number | null,"lng": number | null,"location_label": string | null,"pet_name": string | null,"photos": Json | null,"resolved_at": string | null,"search_radius_km": number | null,"sex": Database["public"]['Enums']["pet_sex"] | null,"size": Database["public"]['Enums']["pet_size"] | null,"species": Database["public"]['Enums']["pet_species"] | null,"status": Database["public"]['Enums']["pet_status"] | null,"updated_at": string | null
                  }
                  ComputedFields: never
                  Relationships: [
                    {
      foreignKeyName: "posts_author_id_fkey"
      columns: ["author_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "posts_author_id_fkey"
      columns: ["author_id"]
isOneToOne: false
      referencedRelation: "profiles_public"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles_public": {
                  Row: {
                    "city": string | null,"created_at": string | null,"id": string | null,"name": string | null,"show_whatsapp": boolean | null,"whatsapp": string | null
                  }
                  ComputedFields: never
                  Insert: {
                           "city"?: string | null,"created_at"?: string | null,"id"?: string | null,"name"?: string | null,"show_whatsapp"?: never,"whatsapp"?: never
                         }
                        Update: {
                           "city"?: string | null,"created_at"?: string | null,"id"?: string | null,"name"?: string | null,"show_whatsapp"?: never,"whatsapp"?: never
                         }
                        Relationships: [
                    
                  ]
                }
          }
          Functions: {
            "create_post":
{ Args: { "p_age": Database["public"]['Enums']["pet_age"],"p_description": string,"p_event_date": string,"p_lat": number,"p_lng": number,"p_location_label": string,"p_pet_name": string,"p_search_radius_km": number,"p_sex": Database["public"]['Enums']["pet_sex"],"p_size": Database["public"]['Enums']["pet_size"],"p_species": Database["public"]['Enums']["pet_species"],"p_status": Database["public"]['Enums']["pet_status"] }; Returns: string
                           },
"mark_conversation_read":
{ Args: { "p_conversation_id": string }; Returns: undefined
                           },
"my_conversations":
{ Args: Record<PropertyKey, never>; Returns: {
              "created_at": string,"id": string,"last_message": string,"last_message_at": string,"other_city": string,"other_id": string,"other_name": string,"other_show_whatsapp": boolean,"other_whatsapp": string,"post_id": string,"post_photo": string,"post_status": Database["public"]['Enums']["pet_status"],"post_title": string,"unread_count": number
            }[]
                           },
"nearby_posts":
{ Args: { "p_age"?: Database["public"]['Enums']["pet_age"],"p_lat"?: number,"p_lng"?: number,"p_radius_km"?: number,"p_sex"?: Database["public"]['Enums']["pet_sex"],"p_size"?: Database["public"]['Enums']["pet_size"],"p_species"?: Database["public"]['Enums']["pet_species"],"p_status": Database["public"]['Enums']["pet_status"],"p_viewer_id"?: string }; Returns: {
              "age": Database["public"]['Enums']["pet_age"],"author_city": string,"author_id": string,"author_name": string,"author_show_whatsapp": boolean,"author_whatsapp": string,"created_at": string,"description": string,"distance_km": number,"event_date": string,"id": string,"lat": number,"lng": number,"location_label": string,"pet_name": string,"photos": Json,"resolved_at": string,"search_radius_km": number,"sex": Database["public"]['Enums']["pet_sex"],"size": Database["public"]['Enums']["pet_size"],"species": Database["public"]['Enums']["pet_species"],"status": Database["public"]['Enums']["pet_status"],"updated_at": string
            }[]
                           },
"send_message":
{ Args: { "p_body": string,"p_conversation_id": string }; Returns: {
              "body": string,
"conversation_id": string,
"created_at": string,
"id": string,
"sender_id": string
            }
                          SetofOptions: {
        from: "*"
        to: "messages"
        isOneToOne: true
        isSetofReturn: false
      } },
"swipe_post":
{ Args: { "p_action": Database["public"]['Enums']["interaction_action"],"p_post_id": string }; Returns: string
                           },
"unread_count":
{ Args: Record<PropertyKey, never>; Returns: number
                           },
"update_post":
{ Args: { "p_age": Database["public"]['Enums']["pet_age"],"p_description": string,"p_event_date": string,"p_id": string,"p_lat": number,"p_lng": number,"p_location_label": string,"p_pet_name": string,"p_search_radius_km": number,"p_sex": Database["public"]['Enums']["pet_sex"],"p_size": Database["public"]['Enums']["pet_size"] }; Returns: boolean
                           }
          }
          Enums: {
            "interaction_action": "like"|"pass","pet_age": "baby"|"young"|"adult"|"senior","pet_sex": "male"|"female"|"unknown","pet_size": "small"|"medium"|"large","pet_species": "cat"|"dog"|"other","pet_status": "lost"|"found"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "interaction_action": ["like", "pass"],"pet_age": ["baby", "young", "adult", "senior"],"pet_sex": ["male", "female", "unknown"],"pet_size": ["small", "medium", "large"],"pet_species": ["cat", "dog", "other"],"pet_status": ["lost", "found"]
          }
        }
} as const
