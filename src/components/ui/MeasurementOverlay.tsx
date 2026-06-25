import { motion } from 'framer-motion'
import type { Measurement } from '@/types/domain'

type MeasurementOverlayProps = {
  measurement: Measurement
}

const lines = [
  { label: 'Chest', keyName: 'chestCm', top: '31%' },
  { label: 'Waist', keyName: 'waistCm', top: '47%' },
  { label: 'Hips', keyName: 'hipsCm', top: '61%' },
] as const

export function MeasurementOverlay({ measurement }: MeasurementOverlayProps) {
  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl bg-atelier-charcoal text-ink-inverse">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(217,154,38,0.24),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent)]" />
      <motion.div
        className="absolute left-1/2 top-[10%] h-[76%] w-[46%] -translate-x-1/2 rounded-[48%_48%_42%_42%] border-2 border-dashed border-atelier-saffron/80"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
      />
      {lines.map((line) => (
        <motion.div
          key={line.keyName}
          className="absolute left-[18%] right-[18%]"
          style={{ top: line.top }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        >
          <div className="h-0.5 bg-atelier-saffron" />
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-atelier-saffron px-3 py-1 text-xs font-bold text-atelier-charcoal">
            {line.label} {measurement[line.keyName]} cm
          </span>
        </motion.div>
      ))}
      <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/12 p-3 backdrop-blur">
        <p className="text-sm font-semibold">{measurement.ownerName} v{measurement.version}</p>
        <p className="text-xs text-white/70">
          Height {measurement.heightCm} cm · confidence {Math.round(measurement.confidence * 100)}%
        </p>
      </div>
    </div>
  )
}
