import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from '@/routes/AppShell'
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
import { SearchPage } from '@/features/feed/SearchPage'
import { StudioPage } from '@/features/dream-to-draft/StudioPage'
import { WardrobePage } from '@/features/wardrobe/WardrobePage'

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="auth" element={<AuthPage />} />
        <Route path="login" element={<AuthPage />} />
        <Route path="signup" element={<AuthPage />} />
        <Route path="phone-login" element={<AuthPage />} />
        <Route path="forgot-password" element={<AuthPage />} />
        <Route element={<AppShell />}>
          <Route index element={<FeedPage />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
