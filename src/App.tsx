import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from '@/routes/AppShell'
import { hasPreviewAuthentication } from '@/lib/auth'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { AuthPage } from '@/features/auth/AuthPage'
import { AuctionsPage } from '@/features/auctions/AuctionsPage'
import { CommercePage } from '@/features/escrow/CommercePage'
import { FeedPage } from '@/features/feed/FeedPage'
import { GuildOrdersPage } from '@/features/guild-orders/GuildOrdersPage'
import { LivePage } from '@/features/live/LivePage'
import { MessagingPage } from '@/features/messaging/MessagingPage'
import { MoodboardsPage } from '@/features/moodboards/MoodboardsPage'
import { PassportPage } from '@/features/passport/PassportPage'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { ReelsPage } from '@/features/reels/ReelsPage'
import { RoleSuitesPage } from '@/features/role-suites/RoleSuitesPage'
import { SearchPage } from '@/features/feed/SearchPage'
import { StudioPage } from '@/features/dream-to-draft/StudioPage'
import { WardrobePage } from '@/features/wardrobe/WardrobePage'

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<AuthPage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="login" element={<AuthPage />} />
        <Route path="signup" element={<AuthPage />} />
        <Route path="phone-login" element={<AuthPage />} />
        <Route path="forgot-password" element={<AuthPage />} />
        <Route
          path="app"
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route index element={<FeedPage />} />
          <Route path="suites" element={<RoleSuitesPage />} />
          <Route path="reels" element={<ReelsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="messages" element={<MessagingPage />} />
          <Route path="live" element={<LivePage />} />
          <Route path="studio" element={<StudioPage />} />
          <Route path="commerce" element={<CommercePage />} />
          <Route path="auctions" element={<AuctionsPage />} />
          <Route path="guild-orders" element={<GuildOrdersPage />} />
          <Route path="passport/:passportId" element={<PassportPage />} />
          <Route path="wardrobe" element={<WardrobePage />} />
          <Route path="moodboards" element={<MoodboardsPage />} />
          <Route path="profile/:profileId" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

type AuthGateState = 'checking' | 'allowed' | 'blocked'

function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [authState, setAuthState] = useState<AuthGateState>(() => {
    if (!isSupabaseConfigured()) {
      return hasPreviewAuthentication() ? 'allowed' : 'blocked'
    }
    return 'checking'
  })

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthState(hasPreviewAuthentication() ? 'allowed' : 'blocked')
      return undefined
    }

    let active = true
    void supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setAuthState(data.session ? 'allowed' : 'blocked')
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(session ? 'allowed' : 'blocked')
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  if (authState === 'checking') {
    return (
      <main className="grid min-h-screen place-items-center bg-atelier-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center bg-atelier-green font-display text-3xl font-black text-atelier-black">
            A
          </div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-white/[0.62]">Opening Atelier</p>
        </div>
      </main>
    )
  }

  if (authState === 'blocked') {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  return children
}
