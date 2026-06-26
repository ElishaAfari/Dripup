import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type SheetProps = {
  open: boolean
  side?: 'bottom' | 'right'
  onClose: () => void
  children: ReactNode
}

export function Sheet({ open, side = 'bottom', onClose, children }: SheetProps) {
  const isBottom = side === 'bottom'

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-40 bg-atelier-black/[0.50] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            onClick={(event) => event.stopPropagation()}
            initial={isBottom ? { y: '100%' } : { x: '100%' }}
            animate={isBottom ? { y: 0 } : { x: 0 }}
            exit={isBottom ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={
              isBottom
                ? 'absolute inset-x-0 bottom-0 max-h-[88vh] overflow-auto border-t border-black/[0.08] bg-canvas p-5 shadow-[0_-20px_70px_rgba(5,8,6,0.18)] dark:border-white/10 dark:bg-atelier-black'
                : 'absolute inset-y-0 right-0 w-full max-w-md overflow-auto border-l border-black/[0.08] bg-canvas p-5 shadow-[0_20px_70px_rgba(5,8,6,0.18)] dark:border-white/10 dark:bg-atelier-black'
            }
          >
            {children}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
