import { Bell, Camera, Compass, Home, LogOut, MessageCircle, Moon, Palette, Search, Shirt, ShoppingBag, Sparkles, Sun, UserRound, Video } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { notifications, profiles } from '@/data/seed'
import { clearPreviewAuthenticated } from '@/lib/auth'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/useAppStore'

const navItems = [
  { to: '/app', label: 'Home', icon: Home },
  { to: '/app/reels', label: 'Reels', icon: Video },
  { to: '/app/search', label: 'Search', icon: Search },
  { to: '/app/messages', label: 'Messages', icon: MessageCircle },
  { to: '/app/live', label: 'Live', icon: Video },
  { to: '/app/studio', label: 'AI Studio', icon: Sparkles },
  { to: '/app/commerce', label: 'Commerce', icon: ShoppingBag },
  { to: '/app/auctions', label: 'Auctions', icon: ShoppingBag },
  { to: '/app/guild-orders', label: 'Guilds', icon: Compass },
  { to: '/app/wardrobe', label: 'Wardrobe', icon: Shirt },
  { to: '/app/moodboards', label: 'Moodboards', icon: Palette },
  { to: '/app/passport/7a8ef9f2-2c60-4f02-8d43-f1d8a79f18d6', label: 'Passport', icon: Camera },
  { to: '/app/profile/profile-ama', label: 'Profile', icon: UserRound },
] as const

const mobileItems = [
  { to: '/app', label: 'Home', icon: Home },
  { to: '/app/reels', label: 'Reels', icon: Video },
  { to: '/app/search', label: 'Search', icon: Search },
  { to: '/app/messages', label: 'Messages', icon: MessageCircle },
  { to: '/app/studio', label: 'Studio', icon: Sparkles },
] as const

export function AppShell() {
  const navigate = useNavigate()
  const theme = useAppStore((state) => state.theme)
  const toggleTheme = useAppStore((state) => state.toggleTheme)
  const unreadCount = notifications.filter((notification) => !notification.read).length
  const currentProfile = profiles[3]

  async function handleSignOut() {
    clearPreviewAuthenticated()
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut()
    }
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f7fbff] bg-grain bg-[length:18px_18px] text-ink dark:bg-atelier-black dark:text-ink-inverse">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-black/[0.08] bg-white/[0.82] p-5 backdrop-blur-xl xl:block dark:border-white/10 dark:bg-white/[0.04]">
          <NavLink to="/app" className="mb-8 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center bg-atelier-black font-display text-xl font-black text-atelier-green shadow-[0_14px_34px_rgba(0,184,107,0.18)] dark:bg-atelier-green dark:text-atelier-black">
              A
            </span>
            <div>
              <p className="font-display text-2xl font-black">Atelier</p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted dark:text-white/[0.55]">by Dripup</p>
            </div>
          </NavLink>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-12 items-center gap-3 px-4 text-sm font-black text-ink-muted transition-all hover:bg-[#eef5ff] hover:text-atelier-blue dark:text-white/[0.60] dark:hover:bg-white/10 dark:hover:text-white',
                    isActive && 'bg-atelier-black text-white shadow-[0_14px_34px_rgba(5,8,6,0.18)] dark:bg-white/[0.14] dark:text-white',
                  )
                }
              >
                <item.icon size={19} />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-6 border border-black/[0.08] bg-atelier-black p-4 text-ink-inverse shadow-[0_18px_48px_rgba(5,8,6,0.22)]">
            <Palette className="mb-3 text-atelier-green" size={22} />
            <p className="font-display text-xl font-bold">Creative AI studio</p>
            <p className="mt-2 text-sm text-white/[0.68]">Draft, remix, estimate, fit-check, and collaborate from one command center.</p>
          </div>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="mt-3 flex min-h-12 w-full items-center gap-3 border border-black/[0.08] bg-white px-4 text-sm font-black text-ink-muted transition hover:border-atelier-blue/[0.45] hover:text-atelier-blue dark:border-white/10 dark:bg-white/[0.06] dark:text-white/[0.70]"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </aside>

        <div className="min-w-0 flex-1 pb-24 xl:pb-0">
          <header className="sticky top-0 z-30 border-b border-black/[0.08] bg-[#f7fbff]/[0.88] px-4 py-3 backdrop-blur-xl md:px-6 dark:border-white/10 dark:bg-atelier-black/[0.88]">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
              <NavLink to="/app" className="flex items-center gap-2 xl:hidden">
                <span className="grid h-10 w-10 place-items-center bg-atelier-black font-display text-lg font-black text-atelier-green dark:bg-atelier-green dark:text-atelier-black">
                  A
                </span>
                <span className="font-display text-2xl font-black">Atelier</span>
              </NavLink>
              <div className="hidden min-w-0 flex-1 md:block">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-atelier-blue dark:text-atelier-green">Fashion lifestyle super-app</p>
                <p className="truncate font-display text-2xl font-bold">Social, commerce, studio, passports</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="icon" onClick={toggleTheme} aria-label="Toggle dark mode">
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </Button>
                <Button variant="secondary" size="icon" aria-label="Notifications" className="relative">
                  <Bell size={18} />
                  {unreadCount ? (
                    <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-atelier-blue text-[10px] font-black text-white">
                      {unreadCount}
                    </span>
                  ) : null}
                </Button>
                <Button variant="secondary" size="icon" onClick={() => void handleSignOut()} aria-label="Sign out" className="xl:hidden">
                  <LogOut size={18} />
                </Button>
                <Avatar src={currentProfile.avatarUrl} name={currentProfile.displayName} verified={currentProfile.verified} />
              </div>
            </div>
          </header>
          <motion.main
            className="mx-auto w-full max-w-5xl px-4 py-5 md:px-6 md:py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.24 }}
          >
            <Outlet />
          </motion.main>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/[0.08] bg-white/[0.92] px-2 py-2 backdrop-blur-xl xl:hidden dark:border-white/10 dark:bg-atelier-black/[0.92]">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {mobileItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'grid min-h-14 place-items-center text-[11px] font-black text-ink-muted transition dark:text-white/[0.60]',
                  isActive && 'bg-atelier-black text-white dark:bg-white/[0.14]',
                )
              }
            >
              <item.icon size={19} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
