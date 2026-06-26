import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type ModalProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-atelier-black/[0.62] p-4 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="max-h-[90vh] w-full max-w-xl overflow-auto border border-black/[0.08] bg-canvas p-5 shadow-[0_28px_90px_rgba(5,8,6,0.24)] dark:border-white/10 dark:bg-atelier-black"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">{title}</h2>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
                <X size={18} />
              </Button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
