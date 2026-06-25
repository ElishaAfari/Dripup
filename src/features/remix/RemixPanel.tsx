import { Leaf, Loader2, Upload, Wand2 } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { remixes } from '@/data/seed'
import { invokeEdgeFunction } from '@/lib/edgeFunctions'

type RemixResponse = {
  remixId: string
  outputUrl: string
  provider: string
}

export function RemixPanel() {
  const remix = remixes[0]
  const [afterUrl, setAfterUrl] = useState(remix.afterUrl)
  const [loading, setLoading] = useState(false)

  async function createRemix() {
    setLoading(true)
    const response = await invokeEdgeFunction<{ sourcePath: string; prompt: string }, RemixResponse>(
      'remix-garment',
      { sourcePath: remix.beforeUrl, prompt: remix.title },
      { remixId: remix.id, outputUrl: remix.afterUrl, provider: 'mock' },
    )
    setAfterUrl(response.outputUrl)
    setLoading(false)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Leaf className="text-atelier-fern dark:text-atelier-saffron" size={22} />
          <h2 className="text-xl font-bold">Upcycling remix engine</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {[['Before', remix.beforeUrl], ['AI redesign', afterUrl]].map(([label, url]) => (
            <motion.div key={label} layout className="overflow-hidden rounded-2xl bg-white/70 dark:bg-white/10">
              <img src={url} alt={label} className="h-72 w-full object-cover" />
              <p className="p-3 font-bold">{label}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button>
            <Upload size={18} />
            Upload garment
          </Button>
          <Button variant="secondary" onClick={() => void createRemix()} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
            Route brief to tailor
          </Button>
        </div>
      </Card>
      <Card className="bg-atelier-fern text-white">
        <Leaf className="mb-3 text-atelier-saffron" size={24} />
        <h3 className="font-display text-2xl font-bold">{remix.title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/75">{remix.sustainabilityNote}</p>
      </Card>
    </div>
  )
}
