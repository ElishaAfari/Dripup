import { Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { useSocialData } from '@/hooks/useAtelierData'

export function SearchPage() {
  const social = useSocialData()

  return (
    <Page
      eyebrow="Discovery + pgvector"
      title="Search styles, makers, and visual neighbors."
      description="Search covers people, vendors, hashtags, and vector recommendations such as visually similar garments or vendors near me who can make this."
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
          className="min-h-12 flex-1 bg-transparent text-base outline-none placeholder:text-ink-muted dark:placeholder:text-white/45"
          placeholder="Search kente corsets, bridal MUA, sneaker makers..."
        />
        <Button size="sm">Search</Button>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="text-atelier-saffron" size={20} />
            <h2 className="text-xl font-bold">Vector style matches</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {social.data.posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="overflow-hidden rounded-2xl bg-atelier-mist/50 dark:bg-white/10"
              >
                <img src={post.media[0].url} alt={post.media[0].alt} className="h-44 w-full object-cover" />
                <div className="p-3">
                  <p className="text-sm font-bold">{post.hashtags.map((tag) => `#${tag}`).join(' ')}</p>
                  <p className="mt-1 text-xs text-ink-muted dark:text-white/55">Embedding score {(0.92 - index * 0.07).toFixed(2)}</p>
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
                <motion.div key={vendor.id} layout className="flex items-center gap-3 rounded-2xl bg-white/70 p-3 dark:bg-white/10">
                  <Avatar src={profile.avatarUrl} name={profile.displayName} verified={profile.verified} />
                  <div className="min-w-0">
                    <p className="truncate font-bold">{vendor.studioName}</p>
                    <p className="truncate text-xs text-ink-muted dark:text-white/55">{vendor.location}</p>
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
