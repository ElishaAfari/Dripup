import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type TabsProps<T extends string> = {
  items: { label: string; value: T }[]
  value: T
  onChange: (value: T) => void
}

export function Tabs<T extends string>({ items, value, onChange }: TabsProps<T>) {
  return (
    <div className="inline-flex rounded-2xl border border-atelier-mist bg-white/70 p-1 dark:border-white/10 dark:bg-white/10">
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              'relative min-h-10 rounded-xl px-4 text-sm font-semibold text-ink-muted transition-colors dark:text-white/65',
              active && 'text-ink dark:text-ink-inverse',
            )}
          >
            {active ? (
              <motion.span
                layoutId="tabs-active-pill"
                className="absolute inset-0 rounded-xl bg-atelier-saffron/25"
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
