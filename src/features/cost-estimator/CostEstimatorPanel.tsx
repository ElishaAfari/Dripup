import { useMemo, useState } from 'react'
import { Calculator, Loader2, Wand2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { costEstimates, fabricCatalog, measurements } from '@/data/seed'
import { invokeEdgeFunction } from '@/lib/edgeFunctions'
import { formatCurrency } from '@/lib/utils'

type EstimateResponse = {
  estimateId: string
  yardage: number
  trims: number
  labour: number
  total: number
}

export function CostEstimatorPanel() {
  const [fabricId, setFabricId] = useState(fabricCatalog[0].id)
  const [remoteEstimate, setRemoteEstimate] = useState<EstimateResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const fabric = fabricCatalog.find((item) => item.id === fabricId) ?? fabricCatalog[0]
  const baseEstimate = costEstimates[0]
  const estimate = useMemo(
    () => ({
      ...baseEstimate,
      fabricId,
      total: baseEstimate.labour + baseEstimate.trims + baseEstimate.yardage * fabric.pricePerYard,
    }),
    [baseEstimate, fabric, fabricId],
  )
  const activeEstimate = remoteEstimate ?? estimate

  async function refineEstimate() {
    setLoading(true)
    const response = await invokeEdgeFunction<
      { garmentType: string; fabricId: string; measurementId: string },
      EstimateResponse
    >(
      'estimate-cost',
      {
        garmentType: estimate.garmentType,
        fabricId,
        measurementId: measurements[0].id,
      },
      {
        estimateId: 'mock-estimate',
        yardage: estimate.yardage,
        trims: estimate.trims,
        labour: estimate.labour,
        total: estimate.total,
      },
    )
    setRemoteEstimate(response)
    setLoading(false)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Calculator className="text-atelier-saffron" size={22} />
          <h2 className="text-xl font-bold">AI fabric and cost estimator</h2>
        </div>
        <label className="text-sm font-bold" htmlFor="fabric-select">
          Fabric
        </label>
        <select
          id="fabric-select"
          value={fabricId}
          onChange={(event) => setFabricId(event.target.value)}
          className="mt-2 min-h-12 w-full rounded-2xl border border-atelier-mist bg-white px-4 dark:border-white/10 dark:bg-white/10"
        >
          {fabricCatalog.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} · {formatCurrency(item.pricePerYard)}/yd
            </option>
          ))}
        </select>
        <div className="mt-4 rounded-2xl bg-atelier-mist/60 p-4 text-sm dark:bg-white/10">
          Measurement profile: {measurements[0].ownerName} · chest {measurements[0].chestCm} cm · waist {measurements[0].waistCm} cm
        </div>
        <Button className="mt-4" onClick={() => void refineEstimate()} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
          Refine with LLM
        </Button>
      </Card>
      <Card>
        <h3 className="font-display text-2xl font-bold">{estimate.garmentType}</h3>
        <div className="mt-4 space-y-3">
          {[
            ['Yardage', `${activeEstimate.yardage} yd x ${formatCurrency(fabric.pricePerYard)}`],
            ['Trims', formatCurrency(activeEstimate.trims)],
            ['Labour', formatCurrency(activeEstimate.labour)],
          ].map(([label, value]) => (
            <motion.div key={label} layout className="flex items-center justify-between rounded-2xl bg-white/70 p-3 dark:bg-white/10">
              <span className="text-sm text-ink-muted dark:text-white/60">{label}</span>
              <span className="font-bold">{value}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl bg-atelier-charcoal p-4 text-ink-inverse">
          <p className="text-sm text-white/60">Editable quote total</p>
          <p className="font-display text-4xl font-black text-atelier-saffron">{formatCurrency(activeEstimate.total)}</p>
        </div>
      </Card>
    </div>
  )
}
