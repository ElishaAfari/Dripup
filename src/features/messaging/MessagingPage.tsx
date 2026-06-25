import { ImagePlus, Send, UsersRound } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ChatBubble } from '@/components/ui/ChatBubble'
import { Page } from '@/components/ui/Page'
import { conversations, profiles } from '@/data/seed'

export function MessagingPage() {
  const conversation = conversations[0]

  return (
    <Page
      eyebrow="Realtime chat"
      title={conversation.title}
      description="Supabase Realtime channels carry messages, typing indicators, read receipts, media attachment metadata, and inline order cards."
    >
      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="h-fit">
          <div className="mb-4 flex items-center gap-2">
            <UsersRound size={20} className="text-atelier-saffron" />
            <h2 className="text-xl font-bold">Members</h2>
          </div>
          <div className="space-y-3">
            {conversation.memberIds.map((memberId) => {
              const member = profiles.find((profile) => profile.id === memberId)
              if (!member) {
                return null
              }
              return (
                <div key={member.id} className="flex items-center justify-between rounded-2xl bg-white/70 p-3 dark:bg-white/10">
                  <span className="font-semibold">{member.displayName}</span>
                  <span className="text-xs capitalize text-ink-muted dark:text-white/55">{member.role}</span>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="min-h-[620px]">
          <div className="mb-4 rounded-2xl bg-atelier-saffron/20 p-3 text-sm font-semibold text-atelier-charcoal dark:text-ink-inverse">
            {conversation.typingNames.join(', ')} is typing · Realtime presence connected in demo mode
          </div>
          <div className="space-y-4">
            {conversation.messages.map((message) => (
              <ChatBubble key={message.id} message={message} mine={message.senderId === 'profile-nadia'} />
            ))}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-dashed border-atelier-saffron p-4">
              <p className="font-bold">Inline order card</p>
              <p className="mt-1 text-sm text-ink-muted dark:text-white/60">Combined quote GHS 7,420 · 3 vendors · escrow capture ready</p>
            </motion.div>
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white/70 p-2 dark:bg-white/10">
            <Button variant="ghost" size="icon" aria-label="Attach media">
              <ImagePlus size={18} />
            </Button>
            <input className="min-h-11 flex-1 bg-transparent outline-none" placeholder="Write a message..." />
            <Button size="icon" aria-label="Send">
              <Send size={18} />
            </Button>
          </div>
        </Card>
      </div>
    </Page>
  )
}
