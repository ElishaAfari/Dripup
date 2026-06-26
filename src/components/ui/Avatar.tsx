import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'

type AvatarProps = {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  verified?: boolean
  className?: string
}

const sizes = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-base',
}

export function Avatar({ src, name, size = 'md', verified = false, className }: AvatarProps) {
  return (
    <span className="relative inline-flex">
      <motion.span
        layout
        className={cn(
          'grid shrink-0 place-items-center overflow-hidden rounded-full bg-atelier-mist font-bold text-atelier-charcoal ring-2 ring-white dark:ring-atelier-charcoal',
          sizes[size],
          className,
        )}
      >
        {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : getInitials(name)}
      </motion.span>
      {verified ? (
        <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-atelier-green text-[9px] font-black text-atelier-black ring-2 ring-white dark:ring-atelier-black">
          <Check size={10} strokeWidth={4} />
        </span>
      ) : null}
    </span>
  )
}
