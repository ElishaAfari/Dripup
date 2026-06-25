import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type CardProps = Omit<HTMLMotionProps<'div'>, 'ref'> & {
  interactive?: boolean
}

export function Card({ className, interactive = false, children, ...props }: CardProps) {
  return (
    <motion.div
      layout
      whileHover={interactive ? { y: -3 } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className={cn(
        'rounded-2xl border border-atelier-mist/80 bg-white/80 p-4 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/8',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
