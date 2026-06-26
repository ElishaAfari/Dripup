import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type TabsProps<T extends string> = {
  items: { label: string; value: T }[]
  value: T
  onChange: (value: T) => void
}

export function Tabs<T extends string>({ items, value, onChange }: TabsProps<T>) {
  return (
    <div className="inline-flex border border-black/[0.08] bg-white/[0.80] p-1 shadow-[0_12px_34px_rgba(5,8,6,0.08)] dark:border-white/10 dark:bg-white/[0.08]">
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              'relative min-h-10 px-4 text-sm font-black text-ink-muted transition-colors dark:text-white/[0.65]',
              active && 'text-white dark:text-atelier-black',
            )}
          >
            {active ? (
              <motion.span
                layoutId="tabs-active-pill"
                className="absolute inset-0 bg-atelier-blue text-white dark:bg-atelier-green"
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              />
            ) : null}
            <span className="relative">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
