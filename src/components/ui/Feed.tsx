import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat2, Send, Share2, Store, Wand2, type LucideIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Post, Profile, VendorProfile } from '@/types/domain'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn, formatCompact } from '@/lib/utils'
import { useAppStore } from '@/stores/useAppStore'

type FeedProps = {
  posts: Post[]
  vendors: VendorProfile[]
  profiles: Profile[]
  currentProfile: Profile
}

export function Feed({ posts, vendors, profiles, currentProfile }: FeedProps) {
  const likedIds = useAppStore((state) => state.likedIds)
  const savedIds = useAppStore((state) => state.savedIds)
  const followedProfileIds = useAppStore((state) => state.followedProfileIds)
  const commentsByPost = useAppStore((state) => state.commentsByPost)
  const toggleLike = useAppStore((state) => state.toggleLike)
  const toggleSave = useAppStore((state) => state.toggleSave)
  const toggleFollow = useAppStore((state) => state.toggleFollow)
  const addComment = useAppStore((state) => state.addComment)
  const recordShare = useAppStore((state) => state.recordShare)
  const showHomeNotice = useAppStore((state) => state.showHomeNotice)
  const [openComments, setOpenComments] = useState<string[]>([])
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})

  function toggleComments(postId: string) {
    setOpenComments((current) => (current.includes(postId) ? current.filter((item) => item !== postId) : [...current, postId]))
  }

  function submitComment(postId: string) {
    const draft = commentDrafts[postId] ?? ''
    addComment(postId, draft, currentProfile.displayName)
    setCommentDrafts((current) => ({ ...current, [postId]: '' }))
    if (!openComments.includes(postId)) {
      setOpenComments((current) => [...current, postId])
    }
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => {
        const author = profiles.find((profile) => profile.id === post.authorId) ?? profiles[0]
        const authorVendor = vendors.find((vendor) => vendor.profileId === author.id)
        const liked = likedIds.includes(post.id)
        const saved = savedIds.includes(post.id)
        const followed = followedProfileIds.includes(author.id)
        const localComments = commentsByPost[post.id] ?? []
        const commentsOpen = openComments.includes(post.id)
        const commentCount = post.comments + localComments.length
        const draft = commentDrafts[post.id] ?? ''

        return (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: index * 0.04 }}
          >
            <Card className="overflow-hidden p-0">
              <div className="flex items-center gap-3 p-4">
                <Link to={`/app/profile/${author.id}`} aria-label={`Open ${author.displayName} profile`}>
                  <Avatar src={author.avatarUrl} name={author.displayName} verified={author.verified} />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                    <Link to={`/app/profile/${author.id}`} className="truncate font-black">
                      {author.displayName}
                    </Link>
                    {authorVendor ? (
                      <span className="bg-atelier-green/10 px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-atelier-fern dark:text-atelier-green">
                        {authorVendor.availability}
                      </span>
                    ) : null}
                  </div>
                  <p className="truncate text-xs font-semibold text-ink-muted dark:text-white/[0.55]">
                    @{author.username} / {author.city}, {author.region} / {relativeTime(post.createdAt)}
                  </p>
                </div>
                <Button
                  variant={followed ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => toggleFollow(author.id)}
                  aria-label={followed ? `Unfollow ${author.displayName}` : `Follow ${author.displayName}`}
                >
                  {followed ? 'Following' : 'Follow'}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="More post actions"
                  onClick={() => showHomeNotice('Post tools will include report, remix, and quote actions.', 'info')}
                >
                  <MoreHorizontal size={19} />
                </Button>
              </div>

              <div className="relative bg-atelier-black">
                <img src={post.media[0].url} alt={post.media[0].alt} className="aspect-[4/5] w-full object-cover md:aspect-[16/10]" />
                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 bg-gradient-to-t from-atelier-black/[0.82] via-atelier-black/[0.18] to-transparent p-4 text-white">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-atelier-green">Creator drop</p>
                    <p className="mt-1 max-w-md text-sm font-semibold text-white/[0.78]">{post.media[0].kind === 'video' ? 'Video story' : 'Editorial look'}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/app/search"
                      className="inline-flex min-h-10 items-center justify-center gap-2 bg-white px-3 text-xs font-black text-atelier-black shadow-[0_12px_30px_rgba(0,0,0,0.24)] transition hover:bg-atelier-green"
                    >
                      <Wand2 size={15} />
                      Similar
                    </Link>
                    <Link
                      to="/app/commerce"
                      className="inline-flex min-h-10 items-center justify-center gap-2 bg-atelier-blue px-3 text-xs font-black text-white shadow-[0_12px_30px_rgba(18,103,255,0.30)] transition hover:bg-atelier-indigo"
                    >
                      <Store size={15} />
                      Quote
                    </Link>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4">
                <div>
                  <p className="text-sm font-semibold leading-6">{post.caption}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.hashtags.map((tag) => (
                      <Link
                        key={tag}
                        to="/app/search"
                        className="bg-atelier-mist px-3 py-1 text-xs font-black text-ink-muted transition hover:bg-atelier-blue hover:text-white dark:bg-white/10 dark:text-white/[0.70]"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-y border-black/[0.08] py-2 dark:border-white/10 sm:grid-cols-5">
                  <PostAction actionLabel={`Like ${author.displayName}'s post`} active={liked} icon={Heart} label={formatCompact(post.likes + (liked ? 1 : 0))} onClick={() => toggleLike(post.id)} />
                  <PostAction actionLabel={`Comment on ${author.displayName}'s post`} active={commentsOpen} icon={MessageCircle} label={formatCompact(commentCount)} onClick={() => toggleComments(post.id)} />
                  <PostAction actionLabel={`Save ${author.displayName}'s post`} active={saved} icon={Bookmark} label={formatCompact(post.saves + (saved ? 1 : 0))} onClick={() => toggleSave(post.id)} />
                  <PostAction actionLabel={`Share ${author.displayName}'s post`} icon={Share2} label="Share" onClick={() => recordShare(post.id)} />
                  <PostAction actionLabel={`Remix ${author.displayName}'s post`} icon={Repeat2} label="Remix" onClick={() => showHomeNotice('Remix studio opened from this reference look.', 'info')} />
                </div>

                <div className="flex items-center gap-2">
                  <Avatar src={currentProfile.avatarUrl} name={currentProfile.displayName} size="sm" verified={currentProfile.verified} />
                  <label className="flex min-h-11 min-w-0 flex-1 items-center gap-2 border border-black/[0.08] bg-white px-3 dark:border-white/10 dark:bg-white/[0.08]">
                    <MessageCircle size={16} className="shrink-0 text-atelier-blue dark:text-atelier-green" />
                    <input
                      value={draft}
                      onChange={(event) => setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          submitComment(post.id)
                        }
                      }}
                      className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
                      aria-label={`Comment on ${author.displayName}'s post`}
                    />
                    <button
                      type="button"
                      disabled={!draft.trim()}
                      onClick={() => submitComment(post.id)}
                      className="grid h-8 w-8 place-items-center bg-atelier-black text-white transition hover:bg-atelier-blue disabled:opacity-35 dark:bg-atelier-green dark:text-atelier-black"
                      aria-label="Send comment"
                    >
                      <Send size={15} />
                    </button>
                  </label>
                </div>

                <AnimatePresence initial={false}>
                  {commentsOpen ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 border-l-2 border-atelier-blue/30 pl-3 dark:border-atelier-green/40">
                        <SeedComment authorName={author.displayName} body={sampleCommentForPost(post)} />
                        {localComments.map((comment) => (
                          <div key={comment.id} className="bg-[#f4f8ff] p-3 dark:bg-white/[0.08]">
                            <p className="text-sm font-black">{comment.authorName}</p>
                            <p className="mt-1 text-sm leading-6 text-ink-muted dark:text-white/[0.70]">{comment.body}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </Card>
          </motion.article>
        )
      })}
    </div>
  )
}

function PostAction({
  active = false,
  actionLabel,
  icon: Icon,
  label,
  onClick,
}: {
  active?: boolean
  actionLabel: string
  icon: LucideIcon
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={actionLabel}
      className={cn(
        'group flex min-h-11 items-center justify-center gap-2 px-2 text-xs font-black text-ink-muted transition hover:bg-[#eef5ff] hover:text-atelier-blue dark:text-white/[0.64] dark:hover:bg-white/10 dark:hover:text-atelier-green',
        active && 'bg-atelier-green/10 text-atelier-fern dark:text-atelier-green',
      )}
    >
      <motion.span animate={active ? { scale: [1, 1.22, 1] } : { scale: 1 }}>
        <Icon size={18} fill={active && Icon === Heart ? 'currentColor' : 'none'} />
      </motion.span>
      {label}
    </button>
  )
}

function SeedComment({ authorName, body }: { authorName: string; body: string }) {
  return (
    <div className="bg-[#f4f8ff] p-3 dark:bg-white/[0.08]">
      <p className="text-sm font-black">{authorName}</p>
      <p className="mt-1 text-sm leading-6 text-ink-muted dark:text-white/[0.70]">{body}</p>
    </div>
  )
}

function sampleCommentForPost(post: Post) {
  if (post.hashtags.includes('passport')) {
    return 'The passport detail makes resale and authenticity feel serious.'
  }
  if (post.hashtags.includes('mua')) {
    return 'This finish would pair beautifully with a bronze satin look.'
  }
  return 'The structure is clean. Saving this for my next fitting brief.'
}

function relativeTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'recently'
  }

  const minutes = Math.round((Date.now() - date.getTime()) / 60_000)
  if (minutes < 60) {
    return `${Math.max(minutes, 1)}m ago`
  }

  const hours = Math.round(minutes / 60)
  if (hours < 24) {
    return `${hours}h ago`
  }

  return `${Math.round(hours / 24)}d ago`
}
