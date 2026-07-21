export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type Row = {
  id: string
  created_at: string
  updated_at?: string
  deleted_at?: string | null
  [key: string]: Json | undefined
}

type TableDefinition<T extends Row = Row> = {
  Row: T
  Insert: Partial<T>
  Update: Partial<T>
  Relationships: []
}

type PublicTables = {
  profiles: TableDefinition
  professional_role_catalog: TableDefinition
  profile_professional_roles: TableDefinition
  vendor_profiles: TableDefinition
  follows: TableDefinition
  posts: TableDefinition
  post_media: TableDefinition
  reels: TableDefinition
  stories: TableDefinition
  likes: TableDefinition
  comments: TableDefinition
  saves: TableDefinition
  hashtags: TableDefinition
  messages: TableDefinition
  conversations: TableDefinition
  conversation_members: TableDefinition
  live_streams: TableDefinition
  stream_viewers: TableDefinition
  measurements: TableDefinition
  garments: TableDefinition
  designs: TableDefinition
  remixes: TableDefinition
  moodboards: TableDefinition
  moodboard_cards: TableDefinition
  moodboard_swipes: TableDefinition
  products: TableDefinition
  orders: TableDefinition
  order_items: TableDefinition
  guild_orders: TableDefinition
  guild_participants: TableDefinition
  milestones: TableDefinition
  escrow_ledger: TableDefinition
  auctions: TableDefinition
  bids: TableDefinition
  fabric_catalog: TableDefinition
  cost_estimates: TableDefinition
  reviews: TableDefinition
  notifications: TableDefinition
  embeddings: TableDefinition
}

export type Database = {
  public: {
    Tables: PublicTables
    Views: Record<string, never>
    Functions: {
      match_vendors_by_embedding: {
        Args: { query_embedding: string; match_count: number }
        Returns: {
          vendor_id: string
          profile_id: string
          studio_name: string
          location_region: string
          similarity: number
        }[]
      }
    }
    Enums: {
      app_role: 'customer' | 'artisan' | 'designer' | 'mua' | 'seller' | 'admin'
      milestone_status: 'pending' | 'approved' | 'released' | 'disputed'
      payment_provider: 'paystack' | 'mtn_momo' | 'stripe'
    }
    CompositeTypes: Record<string, never>
  }
}
