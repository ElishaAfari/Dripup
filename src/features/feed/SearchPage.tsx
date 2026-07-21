import { BadgeCheck, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { useSocialData } from '@/hooks/useAtelierData'
import { roleGroups, rolesByGroup } from '@/lib/roles'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/useAppStore'

export function SearchPage() {
  const social = useSocialData()
  const activeRoleId = useAppStore((state) => state.activeRoleId)
  const setActiveRoleId = useAppStore((state) => state.setActiveRoleId)

  return (
    <Page
      eyebrow="Discovery"
      title="Search styles, makers, and visual neighbors."
      description="Find people, vendors, hashtags, similar garments, and makers who can bring a reference look to life."
      action={
        <Button variant="secondary">
          <SlidersHorizontal size={18} />
          Filters
        </Button>
      }
    >
      <Card className="flex items-center gap-3">
        <Search className="text-ink-muted" size={20} />
        <input
          className="min-h-12 flex-1 bg-transparent text-base outline-none placeholder:text-ink-muted dark:placeholder:text-white/[0.45]"
          placeholder="Search kente corsets, bridal MUA, sneaker makers..."
        />
        <Button size="sm">Search</Button>
      </Card>

      <Card className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <BadgeCheck className="text-atelier-green" size={20} />
          <h2 className="text-xl font-bold">Professional role filters</h2>
        </div>
        <div className="space-y-4">
          {roleGroups.map((group) => (
            <div key={group.key}>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-ink-muted dark:text-white/[0.50]">{group.label}</p>
              <div className="atelier-scrollbar flex gap-2 overflow-x-auto pb-1">
                {rolesByGroup(group.key).map((role) => {
                  const active = role.id === activeRoleId
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setActiveRoleId(role.id)}
                      className={cn(
                        'min-h-10 shrink-0 border px-3 text-xs font-black transition',
                        active
                          ? 'border-atelier-blue bg-[#eef5ff] text-atelier-blue dark:border-atelier-green dark:bg-atelier-green/10 dark:text-atelier-green'
                          : 'border-black/[0.08] bg-white text-ink-muted hover:border-atelier-blue/40 hover:text-atelier-blue dark:border-white/10 dark:bg-white/[0.08] dark:text-white/[0.58] dark:hover:text-atelier-green',
                      )}
                    >
                      {role.title}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="text-atelier-green" size={20} />
            <h2 className="text-xl font-bold">Vector style matches</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {social.data.posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="overflow-hidden border border-black/[0.08] bg-atelier-mist/50 dark:border-white/10 dark:bg-white/[0.08]"
              >
                <img src={post.media[0].url} alt={post.media[0].alt} className="h-44 w-full object-cover" />
                <div className="p-3">
                  <p className="text-sm font-bold">{post.hashtags.map((tag) => `#${tag}`).join(' ')}</p>
                  <p className="mt-1 text-xs text-ink-muted dark:text-white/[0.55]">Style match {(0.92 - index * 0.07).toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-bold">Qualified makers</h2>
          <div className="space-y-3">
            {social.data.vendors.map((vendor) => {
              const profile = social.data.profiles.find((item) => item.id === vendor.profileId)
              if (!profile) {
                return null
              }
              return (
                <motion.div key={vendor.id} layout className="flex items-center gap-3 border border-black/[0.08] bg-white/[0.72] p-3 dark:border-white/10 dark:bg-white/[0.08]">
                  <Avatar src={profile.avatarUrl} name={profile.displayName} verified={profile.verified} />
                  <div className="min-w-0">
                    <p className="truncate font-bold">{vendor.studioName}</p>
                    <p className="truncate text-xs text-ink-muted dark:text-white/[0.55]">{vendor.location}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Card>
      </div>
    </Page>
  )
}
