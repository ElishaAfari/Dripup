import { motion } from 'framer-motion'
import { Modal } from '@/components/ui/Modal'
import { getProfileFromSocial, useSocialData } from '@/hooks/useAtelierData'
import { useAppStore } from '@/stores/useAppStore'

export function StoryViewer() {
  const activeStoryId = useAppStore((state) => state.activeStoryId)
  const closeStory = useAppStore((state) => state.closeStory)
  const social = useSocialData()
  const story = social.data.stories.find((item) => item.id === activeStoryId)

  if (!story) {
    return null
  }

  const profile = getProfileFromSocial(social.data, story.authorId)

  return (
    <Modal open={Boolean(activeStoryId)} title={`${profile.displayName}'s story`} onClose={closeStory}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-2xl">
        <img src={story.mediaUrl} alt={story.title} className="aspect-[9/14] w-full object-cover" />
      </motion.div>
      <div className="mt-4">
        <p className="font-display text-2xl font-bold">{story.title}</p>
        <p className="text-sm text-ink-muted dark:text-white/60">Expires {new Date(story.expiresAt).toLocaleString()}</p>
      </div>
    </Modal>
  )
}
