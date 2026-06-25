import { UsersRound } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { SwipeDeck } from '@/components/ui/SwipeDeck'
import { moodboards } from '@/data/seed'

export function MoodboardsPage() {
  const moodboard = moodboards[0]
  const matched = moodboard.cards.filter((card) => card.matched)

  return (
    <Page
      eyebrow="Collaborative swipe moodboards"
      title={moodboard.title}
      description="Client and artisan swipe independently; mutual right-swipes sync live and become the locked creative brief for an order."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <SwipeDeck cards={moodboard.cards} />
        </Card>
        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-2">
              <UsersRound className="text-atelier-saffron" size={22} />
              <h2 className="text-xl font-bold">Mutual matches</h2>
            </div>
            <div className="mt-4 space-y-3">
              {matched.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-center gap-3 rounded-2xl bg-white/70 p-3 dark:bg-white/10"
                >
                  <img src={card.imageUrl} alt={card.title} className="h-14 w-14 rounded-xl object-cover" />
                  <div>
                    <p className="font-bold">{card.title}</p>
                    <p className="text-xs text-ink-muted dark:text-white/55">{card.tags.join(' · ')}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
          <Card className="bg-atelier-charcoal text-ink-inverse">
            <p className="font-display text-2xl font-bold">Brief lock</p>
            <p className="mt-2 text-sm leading-6 text-white/65">Once both parties approve, the matched cards are copied into moodboard_cards and attached to the order contract.</p>
          </Card>
        </div>
      </div>
    </Page>
  )
}
