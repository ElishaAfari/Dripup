import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type PageProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  action?: ReactNode
}

export function Page({ eyebrow, title, description, action, children }: PageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      className="space-y-6"
    >
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-atelier-blue dark:text-atelier-green">{eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl font-black leading-tight md:text-6xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted md:text-base dark:text-white/[0.68]">{description}</p>
        </div>
        {action}
      </section>
      {children}
    </motion.div>
  )
}
