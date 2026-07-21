import { create } from 'zustand'
import type { ProfessionalRoleId } from '@/lib/roles'

type ThemeMode = 'light' | 'dark'

export type FeedComment = {
  id: string
  postId: string
  authorName: string
  body: string
  createdAt: string
}

export type HomeNotice = {
  id: string
  message: string
  tone: 'success' | 'info'
}

type AppState = {
  theme: ThemeMode
  activeRoleId: ProfessionalRoleId
  activeStoryId: string | null
  likedIds: string[]
  savedIds: string[]
  followedProfileIds: string[]
  sharedPostIds: string[]
  commentsByPost: Record<string, FeedComment[]>
  homeNotice: HomeNotice | null
  toggleTheme: () => void
  setActiveRoleId: (roleId: ProfessionalRoleId) => void
  openStory: (storyId: string) => void
  closeStory: () => void
  toggleLike: (id: string) => void
  toggleSave: (id: string) => void
  toggleFollow: (profileId: string) => void
  addComment: (postId: string, body: string, authorName: string) => void
  recordShare: (postId: string) => void
  showHomeNotice: (message: string, tone?: HomeNotice['tone']) => void
  dismissHomeNotice: () => void
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useAppStore = create<AppState>((set) => ({
  theme: getInitialTheme(),
  activeRoleId: 'bespoke-client',
  activeStoryId: null,
  likedIds: [],
  savedIds: [],
  followedProfileIds: [],
  sharedPostIds: [],
  commentsByPost: {},
  homeNotice: null,
  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === 'light' ? 'dark' : 'light'
      document.documentElement.classList.toggle('dark', theme === 'dark')
      return { theme }
    }),
  setActiveRoleId: (activeRoleId) => set({ activeRoleId }),
  openStory: (storyId) => set({ activeStoryId: storyId }),
  closeStory: () => set({ activeStoryId: null }),
  toggleLike: (id) =>
    set((state) => ({
      likedIds: state.likedIds.includes(id)
        ? state.likedIds.filter((item) => item !== id)
        : [...state.likedIds, id],
    })),
  toggleSave: (id) =>
    set((state) => {
      const saved = state.savedIds.includes(id)
      return {
        savedIds: saved ? state.savedIds.filter((item) => item !== id) : [...state.savedIds, id],
        homeNotice: {
          id: `${id}-${Date.now()}`,
          message: saved ? 'Removed from saved looks.' : 'Saved to your style board.',
          tone: 'success',
        },
      }
    }),
  toggleFollow: (profileId) =>
    set((state) => {
      const following = state.followedProfileIds.includes(profileId)
      return {
        followedProfileIds: following
          ? state.followedProfileIds.filter((item) => item !== profileId)
          : [...state.followedProfileIds, profileId],
        homeNotice: {
          id: `${profileId}-${Date.now()}`,
          message: following ? 'Unfollowed profile.' : 'Following creator. Their drops will appear higher in Home.',
          tone: 'success',
        },
      }
    }),
  addComment: (postId, body, authorName) =>
    set((state) => {
      const trimmed = body.trim()
      if (!trimmed) {
        return state
      }

      const nextComment: FeedComment = {
        id: `${postId}-comment-${Date.now()}`,
        postId,
        authorName,
        body: trimmed,
        createdAt: new Date().toISOString(),
      }

      return {
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: [...(state.commentsByPost[postId] ?? []), nextComment],
        },
        homeNotice: {
          id: nextComment.id,
          message: 'Comment added to the conversation.',
          tone: 'success',
        },
      }
    }),
  recordShare: (postId) =>
    set((state) => ({
      sharedPostIds: state.sharedPostIds.includes(postId) ? state.sharedPostIds : [...state.sharedPostIds, postId],
      homeNotice: {
        id: `${postId}-share-${Date.now()}`,
        message: 'Share link prepared for this look.',
        tone: 'info',
      },
    })),
  showHomeNotice: (message, tone = 'info') =>
    set({
      homeNotice: {
        id: `notice-${Date.now()}`,
        message,
        tone,
      },
    }),
  dismissHomeNotice: () => set({ homeNotice: null }),
}))

if (typeof document !== 'undefined') {
  document.documentElement.classList.toggle('dark', getInitialTheme() === 'dark')
}
