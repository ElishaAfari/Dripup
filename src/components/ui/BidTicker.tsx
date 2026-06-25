import { AnimatePresence, motion } from 'framer-motion'
import type { Bid } from '@/types/domain'
import { formatCurrency } from '@/lib/utils'

type BidTickerProps = {
  bids: Bid[]
}

export function BidTicker({ bids }: BidTickerProps) {
  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {bids.map((bid) => (
          <motion.div
            layout
            key={bid.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="flex items-center justify-between rounded-2xl bg-atelier-charcoal px-4 py-3 text-ink-inverse dark:bg-white/10"
          >
            <span className="text-sm font-semibold">{bid.bidderName}</span>
            <motion.span
              key={bid.amount}
              initial={{ scale: 0.88 }}
              animate={{ scale: 1 }}
              className="font-display text-lg font-bold text-atelier-saffron"
            >
              {formatCurrency(bid.amount)}
            </motion.span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
