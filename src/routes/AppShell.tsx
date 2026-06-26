import { Bell, Camera, Compass, Home, LogIn, MessageCircle, Moon, Palette, Search, Shirt, ShoppingBag, Sparkles, Sun, UserRound, Video } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { notifications, profiles } from '@/data/seed'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/useAppStore'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/auth', label: 'Auth', icon: LogIn },
  { to: '/reels', label: 'Reels', icon: Video },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
  { to: '/live', label: 'Live', icon: Video },
  { to: '/studio', label: 'AI Studio', icon: Sparkles },
  { to: '/commerce', label: 'Commerce', icon: ShoppingBag },
  { to: '/auctions', label: 'Auctions', icon: ShoppingBag },
  { to: '/guild-orders', label: 'Guilds', icon: Compass },
  { to: '/wardrobe', label: 'Wardrobe', icon: Shirt },
  { to: '/moodboards', label: 'Moodboards', icon: Palette },
  { to: '/passport/7a8ef9f2-2c60-4f02-8d43-f1d8a79f18d6', label: 'Passport', icon: Camera },
  { to: '/profile/profile-ama', label: 'Profile', icon: UserRound },
] as const

const mobileItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/reels', label: 'Reels', icon: Video },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
  { to: '/studio', label: 'Studio', icon: Sparkles },
] as const

export function AppShell() {
  const theme = useAppStore((state) => state.theme)
  const toggleTheme = useAppStore((state) => state.toggleTheme)
  const unreadCount = notifications.filter((notification) => !notification.read).length
  const currentProfile = profiles[3]

  return (
    <div className="min-h-screen bg-canvas bg-grain bg-[length:18px_18px] text-ink dark:bg-canvas-dark dark:text-ink-inverse">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-atelier-mist/80 bg-canvas/80 p-5 backdrop-blur xl:block dark:border-white/10 dark:bg-canvas-dark/80">
          <NavLink to="/" className="mb-8 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-atelier-charcoal font-display text-xl font-black text-atelier-saffron dark:bg-atelier-saffron dark:text-atelier-charcoal">
              A
            </span>
            <div>
              <p className="font-display text-2xl font-black">Atelier</p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted dark:text-white/55">by Dripup</p>
            </div>
          </NavLink>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-bold text-ink-muted transition-colors hover:bg-white dark:text-white/60 dark:hover:bg-white/10',
                    isActive && 'bg-atelier-charcoal text-ink-inverse shadow-soft dark:bg-white/15 dark:text-ink-inverse',
                  )
                }
              >
                <item.icon size={19} />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-6 rounded-2xl bg-atelier-charcoal p-4 text-ink-inverse">
            <Palette className="mb-3 text-atelier-saffron" size={22} />
            <p className="font-display text-xl font-bold">Creative AI studio</p>
            <p className="mt-2 text-sm text-white/65">Dream-to-Draft, Remix, fit-check, cost, and measurement flows are live in demo mode.</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1 pb-24 xl:pb-0">
          <header className="sticky top-0 z-30 border-b border-atelier-mist/80 bg-canvas/88 px-4 py-3 backdrop-blur md:px-6 dark:border-white/10 dark:bg-canvas-dark/88">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
              <NavLink to="/" className="flex items-center gap-2 xl:hidden">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-atelier-charcoal font-display text-lg font-black text-atelier-saffron dark:bg-atelier-saffron dark:text-atelier-charcoal">
                  A
                </span>
                <span className="font-display text-2xl font-black">Atelier</span>
              </NavLink>
              <div className="hidden min-w-0 flex-1 md:block">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted dark:text-white/55">Fashion lifestyle super-app</p>
                <p className="truncate font-display text-2xl font-bold">Social, commerce, studio, passports</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="icon" onClick={toggleTheme} aria-label="Toggle dark mode">
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </Button>
                <Button variant="secondary" size="icon" aria-label="Notifications" className="relative">
                  <Bell size={18} />
                  {unreadCount ? (
                    <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-atelier-rouge text-[10px] font-black text-white">
                      {unreadCount}
                    </span>
                  ) : null}
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

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-atelier-mist bg-canvas/92 px-2 py-2 backdrop-blur xl:hidden dark:border-white/10 dark:bg-canvas-dark/92">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {mobileItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'grid min-h-14 place-items-center rounded-2xl text-[11px] font-bold text-ink-muted dark:text-white/60',
                  isActive && 'bg-atelier-charcoal text-ink-inverse dark:bg-white/15',
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
