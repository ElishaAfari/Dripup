import { useQuery } from '@tanstack/react-query'
import type { Json } from '@/types/database'
import type { MediaAsset, Post, Profile, Reel, Story, VendorProfile } from '@/types/domain'
import { getProfile as getSeedProfile, posts, profiles, reels, stories, vendors } from '@/data/seed'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

type RecordRow = Record<string, Json | undefined> & {
  id: string
  created_at?: string
}

type SocialData = {
  profiles: Profile[]
  vendors: VendorProfile[]
  posts: Post[]
  reels: Reel[]
  stories: Story[]
}

const seedSocialData: SocialData = {
  profiles,
  vendors,
  posts,
  reels,
  stories,
}

export function useSocialData() {
  return useQuery({
    queryKey: ['atelier-social-data', isSupabaseConfigured()],
    queryFn: loadSocialData,
    initialData: seedSocialData,
  })
}

export function useProfileBundle(profileId: string | undefined) {
  const social = useSocialData()
  const profile = social.data.profiles.find((item) => item.id === profileId) ?? social.data.profiles[0]
  const vendor = social.data.vendors.find((item) => item.profileId === profile.id)
  const portfolio = social.data.posts.filter((post) => post.authorId === profile.id)

  return {
    ...social,
    profile,
    vendor,
    portfolio,
  }
}

export function getProfileFromSocial(data: SocialData, profileId: string) {
  return data.profiles.find((profile) => profile.id === profileId) ?? getSeedProfile(profileId)
}

async function loadSocialData(): Promise<SocialData> {
  if (!isSupabaseConfigured()) {
    return seedSocialData
  }

  try {
    const [profileResult, vendorResult, postResult, mediaResult, reelResult, storyResult] = await Promise.all([
      supabase.from('profiles').select('id, username, display_name, avatar_url, cover_url, bio, region, city, roles'),
      supabase.from('vendor_profiles').select('id, profile_id, studio_name, specialties, services, location_region, location_city, price_min, price_max, rating, review_count, verified, availability'),
      supabase.from('posts').select('id, author_id, caption, like_count, comment_count, save_count, created_at'),
      supabase.from('post_media').select('id, post_id, bucket, path, media_type, alt'),
      supabase.from('reels').select('id, author_id, video_path, poster_path, caption, sound, like_count, comment_count, share_count'),
      supabase.from('stories').select('id, author_id, media_path, title, expires_at'),
    ])

    const error = profileResult.error ?? vendorResult.error ?? postResult.error ?? mediaResult.error ?? reelResult.error ?? storyResult.error
    if (error) {
      console.warn('Falling back to seed data because Supabase read failed:', error.message)
      return seedSocialData
    }

    const profileRows = asRows(profileResult.data)
    const vendorRows = asRows(vendorResult.data)
    const mediaRows = asRows(mediaResult.data)
    const postRows = asRows(postResult.data)
    const reelRows = asRows(reelResult.data)
    const storyRows = asRows(storyResult.data)

    const liveProfiles = profileRows.map(mapProfile)
    const liveVendors = vendorRows.map(mapVendor)
    const mediaByPost = new Map<string, MediaAsset[]>()
    mediaRows.forEach((row) => {
      const postId = text(row, 'post_id')
      if (!postId) {
        return
      }
      const existing = mediaByPost.get(postId) ?? []
      existing.push(mapMedia(row))
      mediaByPost.set(postId, existing)
    })

    return {
      profiles: liveProfiles.length ? liveProfiles : profiles,
      vendors: liveVendors.length ? liveVendors : vendors,
      posts: postRows.length ? postRows.map((row) => mapPost(row, mediaByPost.get(row.id) ?? [])) : posts,
      reels: reelRows.length ? reelRows.map(mapReel) : reels,
      stories: storyRows.length ? storyRows.map(mapStory) : stories,
    }
  } catch (error) {
    console.warn('Falling back to seed data because Supabase read threw:', error)
    return seedSocialData
  }
}

function asRows(value: unknown): RecordRow[] {
  return Array.isArray(value) ? value.filter(isRecordRow) : []
}

function isRecordRow(value: unknown): value is RecordRow {
  return typeof value === 'object' && value !== null && 'id' in value && typeof (value as { id?: unknown }).id === 'string'
}

function mapProfile(row: RecordRow): Profile {
  const roles = stringArray(row, 'roles')
  return {
    id: row.id,
    username: text(row, 'username', 'atelier.user'),
    displayName: text(row, 'display_name', 'Atelier User'),
    role: parseRole(roles[0]),
    avatarUrl: assetUrl(text(row, 'avatar_url'), 'avatars'),
    coverUrl: assetUrl(text(row, 'cover_url'), 'posts'),
    city: text(row, 'city', 'Accra'),
    region: text(row, 'region', 'Greater Accra'),
    bio: text(row, 'bio'),
    followers: 0,
    following: 0,
    verified: roles.includes('admin'),
  }
}

function mapVendor(row: RecordRow): VendorProfile {
  const priceMin = numeric(row, 'price_min')
  const priceMax = numeric(row, 'price_max')
  return {
    id: row.id,
    profileId: text(row, 'profile_id'),
    studioName: text(row, 'studio_name', 'Atelier Studio'),
    specialties: stringArray(row, 'specialties'),
    services: stringArray(row, 'services'),
    priceRange: priceMax > 0 ? `GHS ${priceMin.toLocaleString()} - ${priceMax.toLocaleString()}` : 'Quote on request',
    rating: numeric(row, 'rating'),
    reviewCount: numeric(row, 'review_count'),
    verified: Boolean(row.verified),
    availability: parseAvailability(text(row, 'availability')),
    location: `${text(row, 'location_city', 'Accra')}, ${text(row, 'location_region', 'Greater Accra')}`,
  }
}

function mapMedia(row: RecordRow): MediaAsset {
  const bucket = text(row, 'bucket', 'posts')
  return {
    id: row.id,
    kind: text(row, 'media_type') === 'video' ? 'video' : 'image',
    url: assetUrl(text(row, 'path'), bucket),
    alt: text(row, 'alt', 'Atelier media'),
  }
}

function mapPost(row: RecordRow, media: MediaAsset[]): Post {
  return {
    id: row.id,
    authorId: text(row, 'author_id'),
    caption: text(row, 'caption'),
    media,
    hashtags: extractHashtags(text(row, 'caption')),
    likes: numeric(row, 'like_count'),
    comments: numeric(row, 'comment_count'),
    saves: numeric(row, 'save_count'),
    createdAt: text(row, 'created_at', new Date().toISOString()),
  }
}

function mapReel(row: RecordRow): Reel {
  const posterPath = text(row, 'poster_path') || text(row, 'video_path')
  return {
    id: row.id,
    authorId: text(row, 'author_id'),
    videoUrl: assetUrl(text(row, 'video_path'), 'reels'),
    posterUrl: assetUrl(posterPath, 'reels'),
    caption: text(row, 'caption'),
    sound: text(row, 'sound', 'Atelier studio sound'),
    likes: numeric(row, 'like_count'),
    comments: numeric(row, 'comment_count'),
    shares: numeric(row, 'share_count'),
  }
}

function mapStory(row: RecordRow): Story {
  return {
    id: row.id,
    authorId: text(row, 'author_id'),
    mediaUrl: assetUrl(text(row, 'media_path'), 'posts'),
    title: text(row, 'title', 'Story'),
    expiresAt: text(row, 'expires_at', new Date(Date.now() + 86_400_000).toISOString()),
  }
}

function text(row: RecordRow, key: string, fallback = '') {
  const value = row[key]
  return typeof value === 'string' ? value : fallback
}

function numeric(row: RecordRow, key: string, fallback = 0) {
  const value = row[key]
  return typeof value === 'number' ? value : fallback
}

function stringArray(row: RecordRow, key: string) {
  const value = row[key]
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

function parseRole(value: string | undefined): Profile['role'] {
  const roles: Profile['role'][] = ['customer', 'artisan', 'designer', 'mua', 'seller', 'admin']
  return roles.find((role) => role === value) ?? 'customer'
}

function parseAvailability(value: string): VendorProfile['availability'] {
  if (value === 'limited' || value === 'offline') {
    return value
  }
  return 'available'
}

function extractHashtags(caption: string) {
  return caption.match(/#[a-z0-9_]+/gi)?.map((tag) => tag.slice(1).toLowerCase()) ?? []
}

function assetUrl(path: string, fallbackBucket: string) {
  if (!path) {
    return 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80'
  }

  if (path.startsWith('http')) {
    return path
  }

  const [maybeBucket, ...parts] = path.split('/')
  const bucket = parts.length ? maybeBucket : fallbackBucket
  const objectPath = parts.length ? parts.join('/') : path
  return supabase.storage.from(bucket).getPublicUrl(objectPath).data.publicUrl
}
