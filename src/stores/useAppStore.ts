import { create } from 'zustand'

type ThemeMode = 'light' | 'dark'

type AppState = {
  theme: ThemeMode
  activeStoryId: string | null
  likedIds: string[]
  toggleTheme: () => void
  openStory: (storyId: string) => void
  closeStory: () => void
  toggleLike: (id: string) => void
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useAppStore = create<AppState>((set) => ({
  theme: getInitialTheme(),
  activeStoryId: null,
  likedIds: [],
  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === 'light' ? 'dark' : 'light'
      document.documentElement.classList.toggle('dark', theme === 'dark')
      return { theme }
    }),
  openStory: (storyId) => set({ activeStoryId: storyId }),
  closeStory: () => set({ activeStoryId: null }),
  toggleLike: (id) =>
    set((state) => ({
      likedIds: state.likedIds.includes(id)
        ? state.likedIds.filter((item) => item !== id)
        : [...state.likedIds, id],
    })),
}))

if (typeof document !== 'undefined') {
  document.documentElement.classList.toggle('dark', getInitialTheme() === 'dark')
}
