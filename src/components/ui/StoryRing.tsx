import { motion } from 'framer-motion'
import type { Story } from '@/types/domain'
import { Avatar } from '@/components/ui/Avatar'
import { getProfileFromSocial, useSocialData } from '@/hooks/useAtelierData'

type StoryRingProps = {
  story: Story
  onOpen: (storyId: string) => void
}

export function StoryRing({ story, onOpen }: StoryRingProps) {
  const social = useSocialData()
  const profile = getProfileFromSocial(social.data, story.authorId)

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(story.id)}
      className="w-20 shrink-0 text-left"
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -2 }}
    >
      <span className="mb-2 grid h-20 w-20 place-items-center rounded-full bg-conic-gradient p-1 [background:conic-gradient(from_140deg,#d99a26,#b63d4f,#59735f,#d99a26)]">
        <Avatar src={profile.avatarUrl} name={profile.displayName} size="lg" verified={profile.verified} />
      </span>
      <span className="block truncate text-xs font-semibold">{profile.displayName}</span>
      <span className="block truncate text-[11px] text-ink-muted dark:text-white/55">{story.title}</span>
    </motion.button>
  )
}
