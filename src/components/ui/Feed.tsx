import { Heart, MessageCircle, Repeat2, Bookmark, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Post, Profile, VendorProfile } from '@/types/domain'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatCompact } from '@/lib/utils'
import { useAppStore } from '@/stores/useAppStore'

type FeedProps = {
  posts: Post[]
  vendors: VendorProfile[]
  profiles: Profile[]
}

export function Feed({ posts, vendors, profiles }: FeedProps) {
  const likedIds = useAppStore((state) => state.likedIds)
  const toggleLike = useAppStore((state) => state.toggleLike)

  return (
    <div className="space-y-4">
      {posts.map((post, index) => {
        const author = profiles.find((profile) => profile.id === post.authorId) ?? profiles[0]
        const liked = likedIds.includes(post.id)
        return (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden p-0">
              <div className="flex items-center gap-3 p-4">
                <Avatar src={author.avatarUrl} name={author.displayName} verified={author.verified} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{author.displayName}</p>
                  <p className="truncate text-xs text-ink-muted dark:text-white/[0.55]">
                    {author.city}, {author.region}
                  </p>
                </div>
                <Button variant="secondary" size="sm">
                  Follow
                </Button>
              </div>
              <img src={post.media[0].url} alt={post.media[0].alt} className="aspect-[4/5] w-full object-cover md:aspect-[16/10]" />
              <div className="space-y-3 p-4">
                <p className="text-sm leading-6">{post.caption}</p>
                <div className="flex flex-wrap gap-2">
                  {post.hashtags.map((tag) => (
                    <span key={tag} className="bg-atelier-mist px-3 py-1 text-xs font-semibold text-ink-muted dark:bg-white/10 dark:text-white/[0.65]">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => toggleLike(post.id)} aria-label="Like post">
                      <motion.span animate={liked ? { scale: [1, 1.45, 1] } : { scale: 1 }}>
                        <Heart size={19} fill={liked ? '#00b86b' : 'none'} color={liked ? '#00b86b' : 'currentColor'} />
                      </motion.span>
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Comment">
                      <MessageCircle size={19} />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Share">
                      <Repeat2 size={19} />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Save">
                      <Bookmark size={19} />
                    </Button>
                  </div>
                  <p className="text-xs font-semibold text-ink-muted dark:text-white/[0.55]">
                    {formatCompact(post.likes + (liked ? 1 : 0))} likes / {formatCompact(post.comments)} comments
                  </p>
                </div>
              </div>
            </Card>
          </motion.article>
        )
      })}

      <Card className="bg-atelier-black text-ink-inverse dark:bg-white/10">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="text-atelier-green" size={20} />
          <h2 className="text-xl font-bold">Recommended makers near you</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {vendors.map((vendor) => {
            const profile = profiles.find((item) => item.id === vendor.profileId) ?? profiles[0]
            return (
              <motion.div
                key={vendor.id}
                layout
                className="border border-white/10 bg-white/[0.08] p-3"
                whileHover={{ y: -2 }}
              >
                <Avatar src={profile.avatarUrl} name={profile.displayName} verified={profile.verified} />
                <p className="mt-3 font-bold">{vendor.studioName}</p>
                <p className="text-xs text-white/[0.65]">{vendor.specialties.slice(0, 2).join(' / ')}</p>
                <Button className="mt-3 w-full" variant="accent" size="sm">
                  Find a maker like this
                </Button>
              </motion.div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
