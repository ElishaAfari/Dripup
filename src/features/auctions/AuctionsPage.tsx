import { useMemo, useState } from 'react'
import { Clock, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { BidTicker } from '@/components/ui/BidTicker'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { auctions, bids as initialBids, measurements } from '@/data/seed'
import { invokeEdgeFunction } from '@/lib/edgeFunctions'
import { formatCurrency } from '@/lib/utils'

type PlaceBidResponse = {
  accepted: boolean
  amount: number
  bidId: string
}

export function AuctionsPage() {
  const auction = auctions[0]
  const measurement = measurements[0]
  const [bids, setBids] = useState(initialBids)
  const [placing, setPlacing] = useState(false)
  const nextBid = bids[0].amount + 150
  const measurementMatches = useMemo(() => {
    const chestOk = measurement.chestCm >= auction.sizeRange.chest[0] && measurement.chestCm <= auction.sizeRange.chest[1]
    const waistOk = measurement.waistCm >= auction.sizeRange.waist[0] && measurement.waistCm <= auction.sizeRange.waist[1]
    const hipsOk = measurement.hipsCm >= auction.sizeRange.hips[0] && measurement.hipsCm <= auction.sizeRange.hips[1]
    return chestOk && waistOk && hipsOk
  }, [auction, measurement])

  async function placeBid() {
    setPlacing(true)
    const response = await invokeEdgeFunction<{ auctionId: string; amount: number }, PlaceBidResponse>(
      'place-bid',
      { auctionId: auction.id, amount: nextBid },
      { accepted: measurementMatches, amount: nextBid, bidId: `bid-${Date.now()}` },
    )
    if (response.accepted) {
      setBids((current) => [
        { id: response.bidId, auctionId: auction.id, bidderName: measurement.ownerName, amount: response.amount, createdAt: new Date().toISOString() },
        ...current,
      ])
    }
    setPlacing(false)
  }

  return (
    <Page
      eyebrow="Phase 6 smart-sized auctions"
      title="Bids that respect fit."
      description="The UI blocks mismatched bids, and the place-bid Edge Function repeats the measurement range check server-side before accepting money."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="overflow-hidden p-0">
          <img src={auction.imageUrl} alt={auction.title} className="h-96 w-full object-cover" />
          <div className="p-4">
            <h2 className="font-display text-3xl font-black">{auction.title}</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {[
                { label: 'Chest', range: auction.sizeRange.chest },
                { label: 'Waist', range: auction.sizeRange.waist },
                { label: 'Hips', range: auction.sizeRange.hips },
              ].map(({ label, range }) => {
                return (
                  <div key={label} className="rounded-2xl bg-atelier-mist/60 p-3 dark:bg-white/10">
                    <p className="text-xs text-ink-muted dark:text-white/55">{label}</p>
                    <p className="font-bold">{range[0]}-{range[1]} cm</p>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button onClick={() => void placeBid()} disabled={!measurementMatches || placing}>
                <ShieldCheck size={18} />
                Bid {formatCurrency(nextBid)}
              </Button>
              <p className="text-sm text-ink-muted dark:text-white/60">
                {measurementMatches ? 'Nadia measurements fit this listing.' : 'Saved measurements are outside the allowed range.'}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-muted dark:text-white/55">Current bid</p>
              <motion.p key={bids[0].amount} initial={{ scale: 0.92 }} animate={{ scale: 1 }} className="font-display text-4xl font-black">
                {formatCurrency(bids[0].amount)}
              </motion.p>
            </div>
            <div className="rounded-2xl bg-atelier-saffron/20 p-3 text-atelier-charcoal dark:text-ink-inverse">
              <Clock size={20} />
              <p className="mt-1 text-xs font-bold">{new Date(auction.endsAt).toLocaleString()}</p>
            </div>
          </div>
          <BidTicker bids={bids} />
        </Card>
      </div>
    </Page>
  )
}
