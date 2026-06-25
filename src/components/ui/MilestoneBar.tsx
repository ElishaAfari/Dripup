import { Check, Lock, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Milestone } from '@/types/domain'
import { cn, formatCurrency } from '@/lib/utils'

type MilestoneBarProps = {
  milestones: Milestone[]
}

export function MilestoneBar({ milestones }: MilestoneBarProps) {
  const completed = milestones.filter((milestone) => milestone.status === 'complete').length
  const progress = ((completed + 0.5) / milestones.length) * 100

  return (
    <div className="space-y-5">
      <div className="relative h-3 rounded-full bg-atelier-mist dark:bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
          className="absolute inset-y-0 left-0 rounded-full bg-atelier-saffron"
        />
      </div>
      <div className="grid gap-3 md:grid-cols-6">
        {milestones.map((milestone) => (
          <motion.div
            layout
            key={milestone.id}
            className={cn(
              'rounded-2xl border p-3',
              milestone.status === 'active' && 'border-atelier-saffron bg-atelier-saffron/15',
              milestone.status === 'complete' && 'border-atelier-fern/25 bg-atelier-fern/10',
              milestone.status === 'locked' && 'border-atelier-mist bg-white/60 opacity-75 dark:border-white/10 dark:bg-white/5',
              milestone.status === 'disputed' && 'border-atelier-rouge bg-atelier-rouge/10',
            )}
          >
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-soft dark:bg-white/10">
              {milestone.status === 'complete' ? <Check size={16} /> : null}
              {milestone.status === 'locked' ? <Lock size={16} /> : null}
              {milestone.status === 'disputed' ? <ShieldAlert size={16} /> : null}
              {milestone.status === 'active' ? <span className="h-3 w-3 rounded-full bg-atelier-saffron" /> : null}
            </div>
            <p className="text-sm font-bold">{milestone.label}</p>
            <p className="mt-1 text-xs text-ink-muted dark:text-white/60">{formatCurrency(milestone.amount)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
