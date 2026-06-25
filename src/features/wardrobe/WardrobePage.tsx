import { Shirt, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { garments, measurements } from '@/data/seed'

export function WardrobePage() {
  const garment = garments[0]
  const measurement = measurements[0]

  return (
    <Page
      eyebrow="AI fit-check wardrobe"
      title="Fit notes before the fitting."
      description="A personal wardrobe uses measurements to flag fit risk, suggest pairings, and power a lightweight 2D virtual try-on overlay."
      action={
        <Button>
          <Sparkles size={18} />
          Rate my fit
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="relative min-h-[560px] overflow-hidden bg-atelier-charcoal text-ink-inverse">
          <img src={garment.imageUrl} alt={garment.name} className="absolute inset-0 h-full w-full object-cover opacity-55" />
          <motion.div
            drag
            dragConstraints={{ top: -60, left: -60, right: 60, bottom: 60 }}
            className="absolute left-1/2 top-28 w-56 -translate-x-1/2 rounded-[42%_42%_30%_30%] border-2 border-atelier-saffron bg-atelier-saffron/15 p-8 text-center backdrop-blur"
          >
            <Shirt className="mx-auto mb-3" size={48} />
            <p className="font-bold">Drag overlay</p>
          </motion.div>
        </Card>
        <div className="space-y-4">
          <Card>
            <h2 className="font-display text-2xl font-bold">{garment.name}</h2>
            <p className="mt-2 text-sm text-ink-muted dark:text-white/60">Measurement profile: {measurement.ownerName}</p>
            <div className="mt-4 space-y-2">
              {garment.fitNotes.map((note) => (
                <div key={note} className="rounded-2xl bg-white/70 p-3 text-sm font-semibold dark:bg-white/10">{note}</div>
              ))}
            </div>
          </Card>
          <Card>
            <p className="font-bold">Pairing suggestions</p>
            <p className="mt-2 text-sm leading-6 text-ink-muted dark:text-white/60">Gold sandals from Sole Lab, copper eye from Esi Looks, and a cropped structured jacket for reception photos.</p>
          </Card>
        </div>
      </div>
    </Page>
  )
}
