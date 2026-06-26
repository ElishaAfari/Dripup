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
        'rounded-lg border border-black/[0.08] bg-white/[0.88] p-4 shadow-[0_18px_60px_rgba(5,8,6,0.10)] backdrop-blur dark:border-white/10 dark:bg-white/[0.08]',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
