import { useParams } from 'react-router-dom'
import { Fingerprint, Nfc, QrCode, Repeat2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { garments, getProfile } from '@/data/seed'

export function PassportPage() {
  const { passportId } = useParams()
  const garment = garments.find((item) => item.passportId === passportId) ?? garments[0]
  const maker = getProfile(garment.makerId)
  const owner = getProfile(garment.ownerId)
  const supportsWebNfc = typeof window !== 'undefined' && 'NDEFReader' in window

  return (
    <Page
      eyebrow="Phase 7 phygital passport"
      title={garment.name}
      description="Every produced garment receives a UUID passport that can be encoded into NFC or QR, shown publicly, and transferred by the owner."
      action={
        <Button variant="secondary">
          <Repeat2 size={18} />
          Transfer ownership
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="overflow-hidden p-0">
          <img src={garment.imageUrl} alt={garment.name} className="h-96 w-full object-cover" />
          <div className="p-4">
            <p className="break-all rounded-2xl bg-atelier-charcoal p-3 font-mono text-sm text-atelier-saffron">{garment.passportId}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/10">
                <p className="text-xs text-ink-muted dark:text-white/55">Maker</p>
                <p className="font-bold">{maker.displayName}</p>
              </div>
              <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/10">
                <p className="text-xs text-ink-muted dark:text-white/55">Owner</p>
                <p className="font-bold">{owner.displayName}</p>
              </div>
            </div>
          </div>
        </Card>
        <div className="space-y-4">
          <Card>
            <Fingerprint className="mb-3 text-atelier-saffron" size={24} />
            <h2 className="font-display text-2xl font-bold">Authenticity</h2>
            <p className="mt-2 text-sm leading-6 text-ink-muted dark:text-white/60">Created {new Date(garment.createdAt).toLocaleDateString()} with maker, material, and ownership history on-chain-ready.</p>
          </Card>
          <Card>
            <Nfc className="mb-3 text-atelier-saffron" size={24} />
            <p className="font-bold">Web NFC</p>
            <p className="mt-1 text-sm text-ink-muted dark:text-white/60">
              {supportsWebNfc ? 'This browser can scan NFC tags.' : 'Web NFC is unavailable here; use the QR fallback.'}
            </p>
            <Button className="mt-4" disabled={!supportsWebNfc}>Scan tag</Button>
          </Card>
          <Card>
            <QrCode className="mb-3 text-atelier-saffron" size={24} />
            <p className="font-bold">Materials and care</p>
            <p className="mt-2 text-sm text-ink-muted dark:text-white/60">{garment.materials.join(' · ')}</p>
            <p className="mt-2 text-sm text-ink-muted dark:text-white/60">{garment.care}</p>
          </Card>
        </div>
      </div>
    </Page>
  )
}
