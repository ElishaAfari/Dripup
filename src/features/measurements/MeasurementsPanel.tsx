import { Camera, CreditCard, Loader2, Ruler } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { MeasurementOverlay } from '@/components/ui/MeasurementOverlay'
import { measurements } from '@/data/seed'
import { invokeEdgeFunction } from '@/lib/edgeFunctions'

type CleanupResponse = {
  measurementId: string
  derived: Record<string, unknown>
}

export function MeasurementsPanel() {
  const measurement = measurements[0]
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('Ready for guided capture.')

  async function cleanupMeasurement() {
    setLoading(true)
    const response = await invokeEdgeFunction<
      { measurementId: string; rawKeypoints: Record<string, unknown>; scaleReference: 'a4' | 'bank_card' },
      CleanupResponse
    >(
      'estimate-measurements-cleanup',
      {
        measurementId: measurement.id,
        rawKeypoints: { front: [{ name: 'left_shoulder', x: 0.42, y: 0.21, score: 0.96 }], side: [] },
        scaleReference: 'bank_card',
      },
      { measurementId: measurement.id, derived: { confidence: measurement.confidence } },
    )
    setStatus(`Measurement cleanup saved: ${response.measurementId}`)
    setLoading(false)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Card className="overflow-hidden">
        <div className="mb-4 flex items-center gap-2">
          <Camera className="text-atelier-saffron" size={22} />
          <h2 className="text-xl font-bold">AI body measurements via camera</h2>
        </div>
        <div className="relative min-h-[440px] overflow-hidden rounded-2xl bg-atelier-charcoal text-ink-inverse">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(217,154,38,0.2),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent)]" />
          <motion.div
            className="absolute left-1/2 top-[12%] h-[72%] w-[44%] -translate-x-1/2 rounded-[50%_50%_40%_40%] border-2 border-dashed border-atelier-saffron"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          />
          <div className="absolute bottom-4 left-4 right-4 grid gap-3 rounded-2xl bg-white/12 p-4 backdrop-blur md:grid-cols-3">
            {[
              { icon: CreditCard, text: 'Hold A4 sheet or bank card at chest for scale.' },
              { icon: Camera, text: 'Capture front and side frames with MediaPipe Pose or MoveNet.' },
              { icon: Ruler, text: 'Save editable derived fields and raw keypoints by version.' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-2">
                <item.icon className="mt-0.5 text-atelier-saffron" size={18} />
                <p className="text-xs leading-5 text-white/75">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={() => void cleanupMeasurement()} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
            Start guided capture
          </Button>
          <p className="text-sm text-ink-muted dark:text-white/60">{status}</p>
        </div>
      </Card>
      <Card>
        <MeasurementOverlay measurement={measurement} />
      </Card>
    </div>
  )
}
