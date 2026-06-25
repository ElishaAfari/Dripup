import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-atelier-saffron disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-atelier-charcoal text-ink-inverse shadow-soft hover:bg-atelier-indigo dark:bg-atelier-saffron dark:text-atelier-charcoal',
        secondary: 'border border-atelier-mist bg-white/70 text-ink hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-ink-inverse dark:hover:bg-white/15',
        ghost: 'text-ink-muted hover:bg-atelier-mist/60 dark:text-white/70 dark:hover:bg-white/10',
        accent: 'bg-atelier-rouge text-white shadow-lift hover:bg-atelier-indigo',
      },
      size: {
        sm: 'min-h-9 rounded-xl px-3 text-xs',
        md: 'min-h-11',
        lg: 'min-h-12 px-5 text-base',
        icon: 'h-11 w-11 rounded-full p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export type ButtonProps = Omit<HTMLMotionProps<'button'>, 'ref'> & VariantProps<typeof buttonVariants>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: props.disabled ? 0 : -1 }}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </motion.button>
  ),
)

Button.displayName = 'Button'
