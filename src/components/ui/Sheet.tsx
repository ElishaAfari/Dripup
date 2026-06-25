import { AnimatePresence, motion } from 'framer-motion'

type SheetProps = {
  open: boolean
  side?: 'bottom' | 'right'
  onClose: () => void
  children: React.ReactNode
}

export function Sheet({ open, side = 'bottom', onClose, children }: SheetProps) {
  const isBottom = side === 'bottom'

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-40 bg-atelier-charcoal/45 backdrop-blur-sm"
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
                ? 'absolute inset-x-0 bottom-0 max-h-[88vh] overflow-auto rounded-t-2xl bg-canvas p-5 dark:bg-atelier-charcoal'
                : 'absolute inset-y-0 right-0 w-full max-w-md overflow-auto bg-canvas p-5 shadow-soft dark:bg-atelier-charcoal'
            }
          >
            {children}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
