import { useState } from 'react'
import { Radio, ScreenShare, ShoppingBag, UsersRound, Video } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { createRtcSession, type RtcSession } from '@/lib/rtc'

export function LivePage() {
  const [session, setSession] = useState<RtcSession | null>(null)
  const [loading, setLoading] = useState(false)

  async function joinRoom(roomName: string) {
    setLoading(true)
    const nextSession = await createRtcSession(roomName)
    setSession(nextSession)
    setLoading(false)
  }

  return (
    <Page
      eyebrow="Video + live"
      title="Consults, group calls, and live selling."
      description="The client uses WebRTC with Supabase Realtime signaling. Hosted SFU providers are abstracted behind VITE_RTC_PROVIDER."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="overflow-hidden p-0">
          <div className="relative min-h-[520px] bg-atelier-charcoal text-ink-inverse">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(217,154,38,0.22),transparent_26%),radial-gradient(circle_at_70%_75%,rgba(182,61,79,0.2),transparent_28%)]" />
            <div className="absolute inset-5 grid place-items-center rounded-2xl border border-white/10">
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <Video className="mx-auto mb-4 text-atelier-saffron" size={46} />
                <p className="font-display text-4xl font-black">Atelier Live Room</p>
                <p className="mt-2 text-white/65">
                  {session ? `${session.provider} session ${session.id}` : 'Join a room to create a mock RTC session.'}
                </p>
              </motion.div>
            </div>
          </div>
        </Card>

        <aside className="space-y-4">
          {[
            { room: 'nadia-ama-1to1', label: '1:1 fitting consult', icon: Video },
            { room: 'guild-group-call', label: 'Guild group call', icon: UsersRound },
            { room: 'ama-live-shopping', label: 'Live shopping stream', icon: Radio },
          ].map((room) => (
            <Card key={room.room} interactive>
              <room.icon className="mb-3 text-atelier-saffron" size={23} />
              <p className="font-bold">{room.label}</p>
              <p className="mt-1 text-sm text-ink-muted dark:text-white/60">Realtime presence, stream viewers, and shopping pins use Supabase channels.</p>
              <Button className="mt-4 w-full" onClick={() => void joinRoom(room.room)} disabled={loading}>
                Join
              </Button>
            </Card>
          ))}
          <Card className="bg-atelier-charcoal text-ink-inverse">
            <ShoppingBag className="mb-3 text-atelier-saffron" size={22} />
            <p className="font-bold">Live pins</p>
            <p className="mt-1 text-sm text-white/65">Pin auctions, products, and cost estimates over the stream.</p>
            <Button variant="accent" className="mt-4 w-full">
              <ScreenShare size={18} />
              Start overlay
            </Button>
          </Card>
        </aside>
      </div>
    </Page>
  )
}
