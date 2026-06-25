import { useState } from 'react'
import { Page } from '@/components/ui/Page'
import { Tabs } from '@/components/ui/Tabs'
import { CostEstimatorPanel } from '@/features/cost-estimator/CostEstimatorPanel'
import { MeasurementsPanel } from '@/features/measurements/MeasurementsPanel'
import { RemixPanel } from '@/features/remix/RemixPanel'
import { DreamToDraftPanel } from '@/features/dream-to-draft/DreamToDraftPanel'

type StudioTab = 'draft' | 'measurements' | 'cost' | 'remix'

const tabs = [
  { label: 'Dream', value: 'draft' },
  { label: 'Measure', value: 'measurements' },
  { label: 'Cost', value: 'cost' },
  { label: 'Remix', value: 'remix' },
] satisfies { label: string; value: StudioTab }[]

export function StudioPage() {
  const [tab, setTab] = useState<StudioTab>('draft')

  return (
    <Page
      eyebrow="Phase 5 AI studio"
      title="From camera to couture brief."
      description="All AI calls are routed through Supabase Edge Functions with provider keys kept server-side and local mock responses available by default."
      action={<Tabs items={tabs} value={tab} onChange={setTab} />}
    >
      {tab === 'draft' ? <DreamToDraftPanel /> : null}
      {tab === 'measurements' ? <MeasurementsPanel /> : null}
      {tab === 'cost' ? <CostEstimatorPanel /> : null}
      {tab === 'remix' ? <RemixPanel /> : null}
    </Page>
  )
}
