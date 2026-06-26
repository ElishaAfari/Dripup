import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-atelier-green disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-atelier-black text-white shadow-[0_14px_36px_rgba(5,8,6,0.20)] hover:bg-atelier-indigo dark:bg-white dark:text-atelier-black',
        secondary:
          'border border-black/10 bg-white text-atelier-black shadow-[0_10px_30px_rgba(5,8,6,0.08)] hover:border-atelier-blue/[0.45] hover:text-atelier-blue dark:border-white/[0.12] dark:bg-white/[0.08] dark:text-white dark:hover:border-atelier-green/60',
        ghost:
          'text-ink-muted hover:bg-atelier-mist/60 hover:text-atelier-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white',
        accent:
          'bg-atelier-blue text-white shadow-[0_18px_42px_rgba(18,103,255,0.28)] hover:bg-atelier-indigo dark:bg-atelier-green dark:text-atelier-black',
      },
      size: {
        sm: 'min-h-9 rounded-lg px-3 text-xs',
        md: 'min-h-11',
        lg: 'min-h-[52px] px-5 text-base',
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
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: props.disabled ? 0 : -2 }}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </motion.button>
  ),
)

Button.displayName = 'Button'
