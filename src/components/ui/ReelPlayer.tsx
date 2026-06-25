import { Heart, MessageCircle, Share2, Wand2 } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Profile, Reel } from '@/types/domain'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { formatCompact } from '@/lib/utils'

type ReelPlayerProps = {
  reels: Reel[]
  profiles: Profile[]
}

export function ReelPlayer({ reels, profiles }: ReelPlayerProps) {
  return (
    <div className="snap-y snap-mandatory overflow-hidden rounded-2xl bg-atelier-charcoal">
      {reels.map((reel) => {
        const author = profiles.find((profile) => profile.id === reel.authorId) ?? profiles[0]
        return (
          <motion.section
            key={reel.id}
            className="relative flex min-h-[74vh] snap-start items-end overflow-hidden p-4 text-ink-inverse"
            initial={{ opacity: 0.7 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.7 }}
          >
            <img src={reel.posterUrl} alt={reel.caption} className="absolute inset-0 h-full w-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-atelier-charcoal via-atelier-charcoal/10 to-transparent" />
            <div className="relative z-10 flex w-full items-end justify-between gap-4">
              <div className="max-w-[75%]">
                <div className="mb-3 flex items-center gap-3">
                  <Avatar src={author.avatarUrl} name={author.displayName} verified={author.verified} />
                  <div>
                    <p className="font-bold">{author.displayName}</p>
                    <p className="text-xs text-white/70">{reel.sound}</p>
                  </div>
                </div>
                <p className="text-sm leading-6">{reel.caption}</p>
                <Button variant="accent" size="sm" className="mt-3">
                  <Wand2 size={15} />
                  Find a maker like this
                </Button>
              </div>
              <div className="grid gap-3">
                {[
                  { icon: Heart, label: formatCompact(reel.likes) },
                  { icon: MessageCircle, label: formatCompact(reel.comments) },
                  { icon: Share2, label: formatCompact(reel.shares) },
                ].map((action) => (
                  <motion.button
                    key={action.label}
                    whileTap={{ scale: 0.9 }}
                    className="grid justify-items-center gap-1 text-xs font-bold"
                    type="button"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white/20 backdrop-blur">
                      <action.icon size={19} />
                    </span>
                    {action.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.section>
        )
      })}
    </div>
  )
}
