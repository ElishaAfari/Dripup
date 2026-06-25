export type Role = 'customer' | 'artisan' | 'designer' | 'mua' | 'seller' | 'admin'

export type MediaKind = 'image' | 'video'

export type MediaAsset = {
  id: string
  kind: MediaKind
  url: string
  alt: string
}

export type Profile = {
  id: string
  username: string
  displayName: string
  role: Role
  avatarUrl: string
  coverUrl: string
  city: string
  region: string
  bio: string
  followers: number
  following: number
  verified: boolean
}

export type VendorProfile = {
  id: string
  profileId: string
  studioName: string
  specialties: string[]
  services: string[]
  priceRange: string
  rating: number
  reviewCount: number
  verified: boolean
  availability: 'available' | 'limited' | 'offline'
  location: string
}

export type Post = {
  id: string
  authorId: string
  caption: string
  media: MediaAsset[]
  hashtags: string[]
  likes: number
  comments: number
  saves: number
  createdAt: string
}

export type Reel = {
  id: string
  authorId: string
  videoUrl: string
  posterUrl: string
  caption: string
  sound: string
  likes: number
  comments: number
  shares: number
}

export type Story = {
  id: string
  authorId: string
  mediaUrl: string
  title: string
  expiresAt: string
}

export type Message = {
  id: string
  senderId: string
  body: string
  createdAt: string
  read: boolean
  attachmentUrl?: string
}

export type Conversation = {
  id: string
  title: string
  memberIds: string[]
  messages: Message[]
  typingNames: string[]
}

export type MilestoneStatus = 'complete' | 'active' | 'locked' | 'disputed'

export type Milestone = {
  id: string
  label: string
  amount: number
  status: MilestoneStatus
  proofUrl?: string
}

export type Measurement = {
  id: string
  ownerName: string
  version: number
  heightCm: number
  chestCm: number
  waistCm: number
  hipsCm: number
  shoulderCm: number
  inseamCm: number
  sleeveCm: number
  confidence: number
}

export type Design = {
  id: string
  prompt: string
  imageUrl: string
  status: 'draft' | 'broadcast' | 'saved'
  matchedVendors: number
}

export type Remix = {
  id: string
  beforeUrl: string
  afterUrl: string
  title: string
  sustainabilityNote: string
}

export type Fabric = {
  id: string
  name: string
  pricePerYard: number
  origin: string
  tags: string[]
}

export type CostEstimate = {
  id: string
  garmentType: string
  fabricId: string
  yardage: number
  trims: number
  labour: number
  total: number
}

export type Auction = {
  id: string
  title: string
  imageUrl: string
  sizeRange: {
    chest: [number, number]
    waist: [number, number]
    hips: [number, number]
  }
  currentBid: number
  endsAt: string
  bidCount: number
  sellerId: string
}

export type Bid = {
  id: string
  auctionId: string
  bidderName: string
  amount: number
  createdAt: string
}

export type GuildParticipant = {
  id: string
  vendorId: string
  role: string
  quote: number
  milestone: string
}

export type GuildOrder = {
  id: string
  title: string
  clientId: string
  participants: GuildParticipant[]
  total: number
  status: 'quoting' | 'approved' | 'in_progress' | 'delivered'
}

export type Garment = {
  id: string
  passportId: string
  ownerId: string
  makerId: string
  name: string
  imageUrl: string
  materials: string[]
  care: string
  fitNotes: string[]
  createdAt: string
}

export type MoodboardCard = {
  id: string
  imageUrl: string
  title: string
  tags: string[]
  matched: boolean
}

export type Moodboard = {
  id: string
  title: string
  clientId: string
  artisanId: string
  cards: MoodboardCard[]
}

export type Notification = {
  id: string
  title: string
  body: string
  kind: 'follow' | 'bid' | 'milestone' | 'guild' | 'message'
  read: boolean
  createdAt: string
}
