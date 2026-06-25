import { ReelPlayer } from '@/components/ui/ReelPlayer'
import { Page } from '@/components/ui/Page'
import { useSocialData } from '@/hooks/useAtelierData'

export function ReelsPage() {
  const social = useSocialData()

  return (
    <Page
      eyebrow="Reels"
      title="Full-screen maker motion."
      description="Vertical reel cards support gesture scrolling, like/comment/share actions, and the requested maker-matching CTA."
    >
      <ReelPlayer reels={social.data.reels} profiles={social.data.profiles} />
    </Page>
  )
}
