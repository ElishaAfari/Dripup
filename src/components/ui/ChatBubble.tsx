import { motion } from 'framer-motion'
import type { Message } from '@/types/domain'
import { Avatar } from '@/components/ui/Avatar'
import { getProfile } from '@/data/seed'
import { cn } from '@/lib/utils'

type ChatBubbleProps = {
  message: Message
  mine?: boolean
}

export function ChatBubble({ message, mine = false }: ChatBubbleProps) {
  const sender = getProfile(message.senderId)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-3', mine && 'flex-row-reverse')}
    >
      <Avatar src={sender.avatarUrl} name={sender.displayName} size="sm" verified={sender.verified} />
      <div className={cn('max-w-[76%] border p-3', mine ? 'border-atelier-black bg-atelier-black text-ink-inverse' : 'border-black/[0.08] bg-white dark:border-white/10 dark:bg-white/[0.08]')}>
        <p className="text-sm">{message.body}</p>
        {message.attachmentUrl ? (
          <img src={message.attachmentUrl} alt="Message attachment" className="mt-3 h-28 w-full object-cover" />
        ) : null}
        <p className={cn('mt-2 text-[11px]', mine ? 'text-white/[0.60]' : 'text-ink-muted dark:text-white/[0.55]')}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  )
}
