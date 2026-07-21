import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  CheckCircle2,
  ChevronRight,
  Compass,
  Gem,
  HeartHandshake,
  MapPin,
  MessageCircle,
  PackageCheck,
  Palette,
  Radio,
  Ruler,
  Scissors,
  Search,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Users,
  Wand2,
  type LucideIcon,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { useSocialData } from '@/hooks/useAtelierData'
import { fashionRoles, getRoleDefinition, getRoleGroup, roleGroups, rolesByGroup, type FashionRoleDefinition, type RoleGroupKey } from '@/lib/roles'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/useAppStore'

const groupIcons: Record<RoleGroupKey, LucideIcon> = {
  apparel: Shirt,
  textiles: Palette,
  marketplace: ShoppingBag,
  beauty: Sparkles,
  footwear: Scissors,
  jewelry: Gem,
  media: Camera,
  clients: Users,
  operations: Truck,
}

const groupTone: Record<RoleGroupKey, string> = {
  apparel: 'bg-atelier-blue text-white',
  textiles: 'bg-atelier-green text-atelier-black',
  marketplace: 'bg-atelier-black text-white dark:bg-white dark:text-atelier-black',
  beauty: 'bg-[#eaf2ff] text-atelier-blue dark:bg-white/[0.10] dark:text-atelier-green',
  footwear: 'bg-atelier-blue/10 text-atelier-blue dark:bg-atelier-green/10 dark:text-atelier-green',
  jewelry: 'bg-atelier-green/10 text-atelier-fern dark:text-atelier-green',
  media: 'bg-atelier-black text-white dark:bg-white/[0.14]',
  clients: 'bg-white text-atelier-black dark:bg-white/[0.10] dark:text-white',
  operations: 'bg-atelier-indigo text-white dark:bg-atelier-green dark:text-atelier-black',
}

export function RoleSuitesPage() {
  const activeRoleId = useAppStore((state) => state.activeRoleId)
  const setActiveRoleId = useAppStore((state) => state.setActiveRoleId)
  const selectedRole = getRoleDefinition(activeRoleId)
  const selectedGroup = getRoleGroup(selectedRole.group)
  const social = useSocialData()

  function selectRole(role: FashionRoleDefinition) {
    setActiveRoleId(role.id)
  }

  return (
    <Page
      eyebrow="Multi-role platform"
      title="Every fashion professional gets a real suite."
      description="Atelier now understands the ecosystem: makers, merchants, stylists, photographers, models, beauty pros, footwear creators, jewelry houses, clients, logistics, and authenticators."
      action={
        <Link
          to="/app/search"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-sm font-black text-atelier-black shadow-[0_10px_30px_rgba(5,8,6,0.08)] transition hover:border-atelier-blue/[0.45] hover:text-atelier-blue dark:border-white/10 dark:bg-white/[0.08] dark:text-white"
        >
          <Search size={18} />
          Find collaborators
        </Link>
      }
    >
      <RoleHero role={selectedRole} groupLabel={selectedGroup.label} />

      <section className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <RoleGroupRail activeGroup={selectedRole.group} onSelectRole={selectRole} />
        <SelectedSuite role={selectedRole} onSelectRole={selectRole} />
      </section>

      <RoleDirectory selectedRole={selectedRole} onSelectRole={selectRole} />
      <EcosystemCoverage />
      <MarketplaceMatch role={selectedRole} vendors={social.data.vendors} profiles={social.data.profiles} />
    </Page>
  )
}

function RoleHero({ role, groupLabel }: { role: FashionRoleDefinition; groupLabel: string }) {
  const Icon = groupIcons[role.group]
  return (
    <Card className="overflow-hidden bg-atelier-black p-0 text-white">
      <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(18,103,255,0.34),transparent_38%,rgba(0,184,107,0.28))]" />
        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 bg-white/[0.10] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-white backdrop-blur">
            <Icon size={16} className="text-atelier-green" />
            {groupLabel}
          </div>
          <h1 className="max-w-3xl font-display text-4xl font-black leading-tight sm:text-6xl">{role.suiteTitle}</h1>
          <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/[0.74] sm:text-base">{role.suiteDescription}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {role.marketplaceTags.map((tag) => (
              <span key={tag} className="bg-white/[0.10] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/[0.82]">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <HeroMetric icon={Sparkles} label="Role tools" value={role.capabilities.length.toString()} />
          <HeroMetric icon={HeartHandshake} label="Collaborators" value={role.collaborators.length.toString()} />
          <HeroMetric icon={ShieldCheck} label="Trust checks" value={role.trustRequirements.length.toString()} />
        </div>
      </div>
    </Card>
  )
}

function HeroMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="border border-white/[0.12] bg-white/[0.09] p-4 backdrop-blur">
      <Icon size={19} className="mb-3 text-atelier-green" />
      <p className="font-display text-3xl font-black">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-white/[0.58]">{label}</p>
    </div>
  )
}

function RoleGroupRail({ activeGroup, onSelectRole }: { activeGroup: RoleGroupKey; onSelectRole: (role: FashionRoleDefinition) => void }) {
  return (
    <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
      {roleGroups.map((group) => {
        const Icon = groupIcons[group.key]
        const roles = rolesByGroup(group.key)
        const active = group.key === activeGroup
        return (
          <motion.div key={group.key} layout>
            <Card className={cn('p-3 transition', active && 'border-atelier-blue/[0.35] ring-4 ring-atelier-blue/10 dark:border-atelier-green/40 dark:ring-atelier-green/10')}>
              <div className="flex items-start gap-3">
                <span className={cn('grid h-11 w-11 shrink-0 place-items-center', groupTone[group.key])}>
                  <Icon size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-black leading-tight">{group.label}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-ink-muted dark:text-white/[0.56]">{roles.length} roles available</p>
                </div>
              </div>
              {active ? (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 space-y-1">
                  {roles.slice(0, 8).map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => onSelectRole(role)}
                      className="flex min-h-10 w-full items-center justify-between gap-2 bg-[#f4f8ff] px-3 text-left text-xs font-black text-ink-muted transition hover:text-atelier-blue dark:bg-white/[0.07] dark:text-white/[0.64] dark:hover:text-atelier-green"
                    >
                      <span className="truncate">{role.title}</span>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                </motion.div>
              ) : null}
            </Card>
          </motion.div>
        )
      })}
    </aside>
  )
}

function SelectedSuite({ role, onSelectRole }: { role: FashionRoleDefinition; onSelectRole: (role: FashionRoleDefinition) => void }) {
  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-atelier-blue dark:text-atelier-green">Active professional suite</p>
            <h2 className="mt-2 font-display text-3xl font-black">{role.title}</h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-ink-muted dark:text-white/[0.64]">{role.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <SuiteMiniStat label="Audience" value={role.audience} />
            <SuiteMiniStat label="Access role" value={role.broadRole} />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
        <Card className="p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <Wand2 size={20} className="text-atelier-blue dark:text-atelier-green" />
            <h3 className="font-display text-2xl font-black">Role workflows</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {role.workflows.map((workflow, index) => (
              <motion.div
                key={workflow.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex min-h-[210px] flex-col justify-between border border-black/[0.08] bg-[#f4f8ff] p-4 dark:border-white/10 dark:bg-white/[0.07]"
              >
                <div>
                  <p className="font-black">{workflow.label}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-ink-muted dark:text-white/[0.58]">{workflow.description}</p>
                </div>
                <Link to={workflow.to} className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 bg-atelier-black px-3 text-sm font-black text-white transition hover:bg-atelier-blue dark:bg-atelier-green dark:text-atelier-black">
                  {workflow.cta}
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck size={20} className="text-atelier-green" />
            <h3 className="font-display text-2xl font-black">Trust layer</h3>
          </div>
          <div className="space-y-2">
            {role.trustRequirements.map((requirement) => (
              <div key={requirement} className="flex items-start gap-2 border border-black/[0.08] bg-white/[0.72] p-3 dark:border-white/10 dark:bg-white/[0.08]">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-atelier-green" />
                <p className="text-sm font-bold leading-6">{requirement}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <PackageCheck size={20} className="text-atelier-blue dark:text-atelier-green" />
          <h3 className="font-display text-2xl font-black">Suite capabilities</h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {role.capabilities.map((capability) => (
            <div key={capability} className="flex min-h-12 items-center gap-2 border border-black/[0.08] bg-white/[0.72] px-3 text-sm font-black dark:border-white/10 dark:bg-white/[0.08]">
              <BadgeCheck size={16} className="text-atelier-green" />
              {capability}
            </div>
          ))}
        </div>
        <CollaboratorStrip role={role} onSelectRole={onSelectRole} />
      </Card>
    </div>
  )
}

function SuiteMiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-black/[0.08] bg-[#f4f8ff] p-3 dark:border-white/10 dark:bg-white/[0.08]">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-ink-muted dark:text-white/[0.50]">{label}</p>
      <p className="mt-1 truncate font-display text-xl font-black capitalize">{value}</p>
    </div>
  )
}

function CollaboratorStrip({ role, onSelectRole }: { role: FashionRoleDefinition; onSelectRole: (role: FashionRoleDefinition) => void }) {
  const collaborators = role.collaborators.map(getRoleDefinition)

  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center gap-2">
        <HeartHandshake size={19} className="text-atelier-blue dark:text-atelier-green" />
        <h4 className="font-black">Natural collaborators</h4>
      </div>
      <div className="atelier-scrollbar flex gap-2 overflow-x-auto pb-1">
        {collaborators.map((collaborator) => {
          const Icon = groupIcons[collaborator.group]
          return (
            <button
              key={collaborator.id}
              type="button"
              onClick={() => onSelectRole(collaborator)}
              className="flex min-h-12 shrink-0 items-center gap-2 border border-black/[0.08] bg-white px-3 text-sm font-black text-ink-muted transition hover:border-atelier-blue/40 hover:text-atelier-blue dark:border-white/10 dark:bg-white/[0.08] dark:text-white/[0.62] dark:hover:text-atelier-green"
            >
              <Icon size={16} />
              {collaborator.title}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function RoleDirectory({ selectedRole, onSelectRole }: { selectedRole: FashionRoleDefinition; onSelectRole: (role: FashionRoleDefinition) => void }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-atelier-blue dark:text-atelier-green">Role directory</p>
          <h2 className="mt-1 font-display text-3xl font-black">Choose any fashion identity</h2>
        </div>
        <span className="text-sm font-bold text-ink-muted dark:text-white/[0.58]">{fashionRoles.length} professional roles mapped</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {fashionRoles.map((role, index) => {
          const active = role.id === selectedRole.id
          const Icon = groupIcons[role.group]
          return (
            <motion.button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.015, 0.26) }}
              className={cn(
                'min-h-[132px] border border-black/[0.08] bg-white/[0.72] p-4 text-left transition hover:border-atelier-blue/40 hover:shadow-[0_18px_50px_rgba(18,103,255,0.12)] dark:border-white/10 dark:bg-white/[0.08]',
                active && 'border-atelier-blue bg-[#eef5ff] ring-4 ring-atelier-blue/10 dark:border-atelier-green dark:bg-atelier-green/10 dark:ring-atelier-green/10',
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className={cn('grid h-10 w-10 place-items-center', groupTone[role.group])}>
                  <Icon size={18} />
                </span>
                {active ? <Star size={17} className="fill-atelier-green text-atelier-green" /> : null}
              </div>
              <p className="font-black leading-tight">{role.title}</p>
              <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-ink-muted dark:text-white/[0.56]">{role.description}</p>
            </motion.button>
          )
        })}
      </div>
    </Card>
  )
}

function EcosystemCoverage() {
  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Compass size={20} className="text-atelier-blue dark:text-atelier-green" />
        <h2 className="font-display text-3xl font-black">Coverage map</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {roleGroups.map((group) => {
          const Icon = groupIcons[group.key]
          return (
            <div key={group.key} className="border border-black/[0.08] bg-[#f4f8ff] p-4 dark:border-white/10 dark:bg-white/[0.08]">
              <span className={cn('mb-3 grid h-11 w-11 place-items-center', groupTone[group.key])}>
                <Icon size={19} />
              </span>
              <p className="font-black">{group.label}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-ink-muted dark:text-white/[0.58]">{group.description}</p>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-atelier-blue dark:text-atelier-green">{rolesByGroup(group.key).length} mapped roles</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function MarketplaceMatch({
  role,
  vendors,
  profiles,
}: {
  role: FashionRoleDefinition
  vendors: ReturnType<typeof useSocialData>['data']['vendors']
  profiles: ReturnType<typeof useSocialData>['data']['profiles']
}) {
  const matchedVendors = vendors.filter((vendor) => vendor.roleTags?.includes(role.id) || vendor.suiteKey === role.group).slice(0, 4)
  const fallbackVendors = matchedVendors.length ? matchedVendors : vendors.slice(0, 4)

  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-atelier-blue dark:text-atelier-green">Marketplace and network</p>
          <h2 className="mt-1 font-display text-3xl font-black">People already mapped to this suite</h2>
        </div>
        <Link to="/app/search" className="inline-flex items-center gap-2 text-sm font-black text-atelier-blue dark:text-atelier-green">
          Full search
          <ChevronRight size={16} />
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {fallbackVendors.map((vendor) => {
          const profile = profiles.find((item) => item.id === vendor.profileId)
          return (
            <Link
              key={vendor.id}
              to={`/app/profile/${vendor.profileId}`}
              className="grid gap-3 border border-black/[0.08] bg-white/[0.72] p-4 transition hover:border-atelier-blue/40 dark:border-white/10 dark:bg-white/[0.08]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-black">{vendor.studioName}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-bold text-ink-muted dark:text-white/[0.56]">
                    <MapPin size={13} />
                    {vendor.location}
                  </p>
                </div>
                <span className="bg-atelier-green/10 px-2 py-1 text-xs font-black text-atelier-fern dark:text-atelier-green">{vendor.rating}</span>
              </div>
              <p className="text-sm font-semibold leading-6 text-ink-muted dark:text-white/[0.60]">{profile?.bio ?? vendor.specialties.join(', ')}</p>
              <div className="flex flex-wrap gap-2">
                {vendor.specialties.slice(0, 3).map((specialty) => (
                  <span key={specialty} className="bg-[#f4f8ff] px-2 py-1 text-xs font-black text-ink-muted dark:bg-white/[0.08] dark:text-white/[0.58]">
                    {specialty}
                  </span>
                ))}
              </div>
            </Link>
          )
        })}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <NetworkAction icon={MessageCircle} label="Group chat" to="/app/messages" />
        <NetworkAction icon={Radio} label="Live room" to="/app/live" />
        <NetworkAction icon={Ruler} label="Fit data" to="/app/studio" />
      </div>
    </Card>
  )
}

function NetworkAction({ icon: Icon, label, to }: { icon: LucideIcon; label: string; to: string }) {
  return (
    <Link to={to} className="flex min-h-12 items-center justify-center gap-2 border border-black/[0.08] bg-atelier-black px-3 text-sm font-black text-white transition hover:bg-atelier-blue dark:border-white/10 dark:bg-atelier-green dark:text-atelier-black">
      <Icon size={17} />
      {label}
    </Link>
  )
}
