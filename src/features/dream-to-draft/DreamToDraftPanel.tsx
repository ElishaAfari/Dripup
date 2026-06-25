import { useState } from 'react'
import { Loader2, Megaphone, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { designs, imagePool } from '@/data/seed'
import { invokeEdgeFunction } from '@/lib/edgeFunctions'

type GenerateDesignResponse = {
  imageUrl: string
  designId: string
  provider: string
}

export function DreamToDraftPanel() {
  const [prompt, setPrompt] = useState(designs[0].prompt)
  const [generated, setGenerated] = useState(designs[0])
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    const response = await invokeEdgeFunction<{ prompt: string }, GenerateDesignResponse>(
      'generate-design',
      { prompt },
      { imageUrl: imagePool.sketch, designId: 'mock-design', provider: 'mock' },
    )
    setGenerated({
      id: response.designId,
      prompt,
      imageUrl: response.imageUrl,
      status: 'broadcast',
      matchedVendors: 18,
    })
    setLoading(false)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="text-atelier-saffron" size={22} />
          <h2 className="text-xl font-bold">Dream-to-Draft prompt studio</h2>
        </div>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="min-h-40 w-full resize-none rounded-2xl border border-atelier-mist bg-white/70 p-4 outline-none focus:border-atelier-saffron dark:border-white/10 dark:bg-white/10"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => void generate()} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Generate sketch
          </Button>
          <Button variant="secondary">
            <Megaphone size={18} />
            Broadcast brief
          </Button>
        </div>
        <p className="mt-3 text-sm text-ink-muted dark:text-white/60">
          Edge Function: generate-design · env: IMAGE_API_KEY, IMAGE_PROVIDER, SUPABASE_SERVICE_ROLE_KEY
        </p>
      </Card>

      <Card className="overflow-hidden p-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={generated.imageUrl + generated.prompt}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
          >
            <img src={generated.imageUrl} alt={generated.prompt} className="h-80 w-full object-cover" />
            <div className="p-4">
              <p className="font-display text-2xl font-bold">Broadcast ready</p>
              <p className="mt-1 text-sm text-ink-muted dark:text-white/60">
                {generated.matchedVendors} nearby qualified artisans can offer to make this.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  )
}
