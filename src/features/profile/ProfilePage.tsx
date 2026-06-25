import { Link, useParams } from 'react-router-dom'
import { MapPin, Radio, Star, Verified } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { useProfileBundle } from '@/hooks/useAtelierData'

export function ProfilePage() {
  const { profileId } = useParams()
  const { profile, vendor, portfolio } = useProfileBundle(profileId)

  return (
    <Page
      eyebrow="Public profile"
      title={profile.displayName}
      description={profile.bio}
      action={
        <div className="flex flex-wrap gap-2">
          <Button>
            <Link to="/commerce">Request a quote</Link>
          </Button>
          <Button variant="secondary">
            <Link to="/guild-orders">Start Guild Order</Link>
          </Button>
        </div>
      }
    >
      <Card className="overflow-hidden p-0">
        <div className="relative h-56">
          <img src={profile.coverUrl} alt={`${profile.displayName} cover`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-atelier-charcoal/70 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-end gap-4 text-white">
            <Avatar src={profile.avatarUrl} name={profile.displayName} size="lg" verified={profile.verified} />
            <div>
              <p className="font-display text-3xl font-black">{profile.displayName}</p>
              <p className="text-sm text-white/75">@{profile.username}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-4">
          {[
            ['Followers', profile.followers.toLocaleString()],
            ['Following', profile.following.toLocaleString()],
            ['Role', profile.role],
            ['Region', profile.region],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-atelier-mist/55 p-3 dark:bg-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-muted dark:text-white/45">{label}</p>
              <p className="mt-1 font-display text-xl font-bold capitalize">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      {vendor ? (
        <Card>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Verified className="text-atelier-saffron" size={22} />
            <h2 className="font-display text-2xl font-bold">{vendor.studioName}</h2>
            <span className="rounded-full bg-atelier-fern/15 px-3 py-1 text-xs font-bold text-atelier-fern dark:text-atelier-saffron">
              {vendor.availability}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/10">
              <Star className="mb-2 text-atelier-saffron" size={20} />
              <p className="font-bold">{vendor.rating} rating</p>
              <p className="text-sm text-ink-muted dark:text-white/55">{vendor.reviewCount} reviews</p>
            </div>
            <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/10">
              <MapPin className="mb-2 text-atelier-rouge" size={20} />
              <p className="font-bold">{vendor.location}</p>
              <p className="text-sm text-ink-muted dark:text-white/55">{vendor.priceRange}</p>
            </div>
            <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/10">
              <Radio className="mb-2 text-atelier-indigo dark:text-atelier-saffron" size={20} />
              <p className="font-bold">Live ready</p>
              <p className="text-sm text-ink-muted dark:text-white/55">Can host shopping pins and video consults.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {vendor.specialties.map((specialty) => (
              <span key={specialty} className="rounded-full bg-atelier-charcoal px-3 py-1 text-xs font-bold text-ink-inverse dark:bg-white/10">
                {specialty}
              </span>
            ))}
          </div>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {portfolio.map((post, index) => (
          <motion.img
            key={post.id}
            src={post.media[0].url}
            alt={post.media[0].alt}
            className="aspect-square rounded-2xl object-cover shadow-soft"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
          />
        ))}
      </div>
    </Page>
  )
}
