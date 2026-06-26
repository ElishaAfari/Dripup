import { Link } from 'react-router-dom'
import { MessageCircle, Radio, ShoppingBag, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Feed } from '@/components/ui/Feed'
import { Page } from '@/components/ui/Page'
import { StoryRing } from '@/components/ui/StoryRing'
import { StoryViewer } from '@/features/stories/StoryViewer'
import { useSocialData } from '@/hooks/useAtelierData'
import { useAppStore } from '@/stores/useAppStore'

export function FeedPage() {
  const openStory = useAppStore((state) => state.openStory)
  const social = useSocialData()

  return (
    <Page
      eyebrow="Atelier home"
      title="Fashion moves here first."
      description="Posts, reels, stories, makers, live commerce, AI drafts, and protected orders in one calm fashion network."
      action={
        <div className="flex gap-2">
          <Button variant="secondary">
            <Link to="/app/messages" className="inline-flex items-center gap-2">
              <MessageCircle size={18} />
              Chat
            </Link>
          </Button>
          <Button variant="primary">
            <Link to="/app/studio" className="inline-flex items-center gap-2">
              <Sparkles size={18} />
              Create
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <Card className="p-3">
            <div className="atelier-scrollbar flex gap-3 overflow-x-auto p-1">
              {social.data.stories.map((story) => (
                <StoryRing key={story.id} story={story} onOpen={openStory} />
              ))}
            </div>
          </Card>
          <Feed posts={social.data.posts} vendors={social.data.vendors} profiles={social.data.profiles} />
        </div>

        <aside className="space-y-4">
          {[
            { to: '/app/reels', icon: Radio, label: 'Vertical reels', copy: 'Watch silhouettes, techniques, fittings, and creator drops.' },
            { to: '/app/commerce', icon: ShoppingBag, label: 'Protected orders', copy: 'Milestones, proofs, combined bills, and payout rails.' },
            { to: '/app/moodboards', icon: Sparkles, label: 'Swipe briefs', copy: 'Match taste with a maker before the first stitch is cut.' },
          ].map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Link to={item.to} className="block">
                <Card interactive className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center bg-atelier-blue/10 text-atelier-blue dark:bg-atelier-green/10 dark:text-atelier-green">
                    <item.icon size={19} />
                  </span>
                  <span>
                    <span className="block font-bold">{item.label}</span>
                    <span className="mt-1 block text-sm text-ink-muted dark:text-white/60">{item.copy}</span>
                  </span>
                </Card>
              </Link>
            </motion.div>
          ))}
        </aside>
      </div>
      <StoryViewer />
    </Page>
  )
}
