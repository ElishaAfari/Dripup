import { MessageCircle, Split, UserRoundCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { guildOrders, getVendor } from '@/data/seed'
import { formatCurrency } from '@/lib/utils'

export function GuildOrdersPage() {
  const guild = guildOrders[0]

  return (
    <Page
      eyebrow="Phase 6 guild orders"
      title="One client bill, many craft hands."
      description="Guild orders coordinate tailor, MUA, shoemaker, and seller participants with one checkout, shared chat, sub-milestones, and split escrow payouts."
      action={
        <Button>
          <MessageCircle size={18} />
          Open workspace chat
        </Button>
      }
    >
      <Card className="bg-atelier-charcoal text-ink-inverse">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-white/60">{guild.status.replace('_', ' ')}</p>
            <h2 className="font-display text-4xl font-black">{guild.title}</h2>
          </div>
          <p className="font-display text-4xl font-black text-atelier-saffron">{formatCurrency(guild.total)}</p>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {guild.participants.map((participant, index) => {
          const vendor = getVendor(participant.vendorId)
          return (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card interactive>
                <UserRoundCheck className="mb-3 text-atelier-saffron" size={24} />
                <p className="font-display text-2xl font-bold">{vendor.studioName}</p>
                <p className="mt-1 text-sm font-semibold text-ink-muted dark:text-white/60">{participant.role}</p>
                <div className="mt-4 rounded-2xl bg-white/70 p-3 dark:bg-white/10">
                  <p className="text-xs text-ink-muted dark:text-white/55">Participant quote</p>
                  <p className="font-display text-3xl font-black">{formatCurrency(participant.quote)}</p>
                </div>
                <p className="mt-3 text-sm text-ink-muted dark:text-white/60">Current sub-milestone: {participant.milestone}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <Split className="text-atelier-saffron" size={21} />
          <h2 className="text-xl font-bold">Split escrow plan</h2>
        </div>
        <div className="mt-4 h-4 overflow-hidden rounded-full bg-atelier-mist dark:bg-white/10">
          <div className="flex h-full">
            {guild.participants.map((participant) => (
              <motion.span
                key={participant.id}
                initial={{ width: 0 }}
                animate={{ width: `${(participant.quote / guild.total) * 100}%` }}
                className="h-full bg-atelier-saffron even:bg-atelier-rouge odd:bg-atelier-fern"
              />
            ))}
          </div>
        </div>
      </Card>
    </Page>
  )
}
