import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import type { MoodboardCard } from '@/types/domain'
import { Button } from '@/components/ui/Button'

type SwipeDeckProps = {
  cards: MoodboardCard[]
}

export function SwipeDeck({ cards }: SwipeDeckProps) {
  const [index, setIndex] = useState(0)
  const currentCards = useMemo(() => cards.slice(index, index + 3), [cards, index])

  function swipe() {
    setIndex((current) => Math.min(current + 1, cards.length))
  }

  return (
    <div className="relative min-h-[430px]">
      <AnimatePresence>
        {currentCards
          .slice()
          .reverse()
          .map((card, stackIndex) => (
            <motion.div
              key={card.id}
              className="absolute inset-x-0 top-0 overflow-hidden border border-black/[0.08] bg-white shadow-[0_18px_54px_rgba(5,8,6,0.14)] dark:border-white/10 dark:bg-white/[0.08]"
              style={{ zIndex: stackIndex }}
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1 - stackIndex * 0.04, y: stackIndex * 14 }}
              exit={{ opacity: 0, x: 220, rotate: 9 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 90) {
                  swipe()
                }
              }}
            >
              <img src={card.imageUrl} alt={card.title} className="h-72 w-full object-cover" />
              <div className="p-4">
                <p className="font-display text-2xl font-bold">{card.title}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span key={tag} className="bg-atelier-mist px-3 py-1 text-xs font-bold text-ink-muted dark:bg-white/10 dark:text-white/[0.65]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
      <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center gap-4">
        <Button variant="secondary" size="icon" onClick={swipe} aria-label="Pass">
          <X size={19} />
        </Button>
        <Button variant="accent" size="icon" onClick={swipe} aria-label="Match">
          <Check size={19} />
        </Button>
      </div>
    </div>
  )
}
