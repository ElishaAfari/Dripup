import { Link } from 'react-router-dom'
import { CreditCard, Loader2, ShieldCheck, Split, Truck } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { MilestoneBar } from '@/components/ui/MilestoneBar'
import { Page } from '@/components/ui/Page'
import { milestones } from '@/data/seed'
import { invokeEdgeFunction } from '@/lib/edgeFunctions'
import { formatCurrency } from '@/lib/utils'

type CaptureResponse = {
  ledgerId: string
  providerReference: string
  providerConfigured: boolean
}

export function CommercePage() {
  const escrowTotal = milestones.reduce((total, milestone) => total + milestone.amount, 0)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('Ready to capture through Paystack, MoMo, or Stripe.')

  // Real escrow is regulated in many jurisdictions; production releases must run through a licensed payment or escrow partner.
  async function captureDeposit() {
    setLoading(true)
    const response = await invokeEdgeFunction<
      { guildOrderId: string; amount: number; provider: 'paystack'; currency: string },
      CaptureResponse
    >(
      'escrow-capture',
      { guildOrderId: 'guild-1', amount: 1800, provider: 'paystack', currency: 'GHS' },
      { ledgerId: 'mock-ledger', providerReference: 'mock_capture', providerConfigured: false },
    )
    setStatus(`Capture ledger ${response.ledgerId} · ${response.providerConfigured ? 'provider live' : 'mock mode'}`)
    setLoading(false)
  }

  return (
    <Page
      eyebrow="Phase 4 commerce"
      title="Escrow with proof, approvals, and payout rails."
      description="Payments are captured through Edge Functions, ledgered in Postgres, and released milestone-by-milestone after client and artisan approval."
      action={
        <Button variant="secondary">
          <Link to="/auctions">Open auctions</Link>
        </Button>
      }
    >
      <Card>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-ink-muted dark:text-white/55">Guild order escrow total</p>
            <p className="font-display text-4xl font-black">{formatCurrency(escrowTotal)}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => void captureDeposit()} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
              Capture deposit
            </Button>
            <Button variant="secondary">Approve active milestone</Button>
          </div>
        </div>
        <p className="mb-4 text-sm font-semibold text-ink-muted dark:text-white/60">{status}</p>
        <MilestoneBar milestones={milestones} />
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: ShieldCheck, title: 'State machine', copy: 'pending → captured → approved → released → reconciled, with audit rows.' },
          { icon: Split, title: 'Split payouts', copy: 'Guild orders allocate release amounts across participant ledgers.' },
          { icon: Truck, title: 'Proof uploads', copy: 'Proof photos land in the proofs bucket and trigger notifications.' },
        ].map((item) => (
          <Card key={item.title} interactive>
            <item.icon className="mb-3 text-atelier-saffron" size={23} />
            <h2 className="font-display text-2xl font-bold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink-muted dark:text-white/60">{item.copy}</p>
          </Card>
        ))}
      </div>
      <Card className="border-atelier-rouge/30 bg-atelier-rouge/10">
        <p className="text-sm font-semibold">
          Regulatory note: real escrow can be regulated financial activity. Production operation must use a licensed payment or escrow partner; this app models the ledger, state machine, and provider payout calls accordingly.
        </p>
      </Card>
    </Page>
  )
}
