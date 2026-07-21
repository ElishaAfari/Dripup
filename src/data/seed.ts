import type {
  Auction,
  Bid,
  Conversation,
  CostEstimate,
  Design,
  Fabric,
  Garment,
  GuildOrder,
  Measurement,
  Milestone,
  Moodboard,
  Notification,
  Post,
  Profile,
  Reel,
  Remix,
  Story,
  VendorProfile,
} from '@/types/domain'

export const imagePool = {
  atelier:
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
  gown:
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
  kente:
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
  sneakers:
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
  makeup:
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
  studio:
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
  fabric:
    'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=80',
  sketch:
    'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80',
  wardrobe:
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
  mood:
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
  passport:
    'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
  textile:
    'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=80',
  jewelry:
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
  hair:
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
  editorial:
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
  logistics:
    'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1200&q=80',
} as const

export const profiles: Profile[] = [
  {
    id: 'profile-ama',
    username: 'ama.thread',
    displayName: 'Ama Owusu',
    role: 'artisan',
    professionalRoleIds: ['bespoke-tailor-seamstress', 'bridal-kente-couturier', 'fashion-designer'],
    primaryProfession: 'bespoke-tailor-seamstress',
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
    coverUrl: imagePool.atelier,
    city: 'Accra',
    region: 'Greater Accra',
    bio: 'Bespoke womenswear, sculptural corsetry, and slow Ghanaian tailoring.',
    followers: 18400,
    following: 728,
    verified: true,
  },
  {
    id: 'profile-kofi',
    username: 'kofi.sole',
    displayName: 'Kofi Mensah',
    role: 'artisan',
    professionalRoleIds: ['cordwainer-shoemaker', 'sneaker-customizer', 'footwear-restoration-expert'],
    primaryProfession: 'sneaker-customizer',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    coverUrl: imagePool.sneakers,
    city: 'Kumasi',
    region: 'Ashanti',
    bio: 'Sneaker restoration, leather dye, and custom wedding footwear.',
    followers: 9200,
    following: 321,
    verified: true,
  },
  {
    id: 'profile-esi',
    username: 'esi.looks',
    displayName: 'Esi Addo',
    role: 'mua',
    professionalRoleIds: ['makeup-artist', 'skin-glow-consultant'],
    primaryProfession: 'makeup-artist',
    avatarUrl:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=240&q=80',
    coverUrl: imagePool.makeup,
    city: 'Cape Coast',
    region: 'Central',
    bio: 'Editorial makeup artist and bridal beauty lead.',
    followers: 14100,
    following: 498,
    verified: true,
  },
  {
    id: 'profile-nadia',
    username: 'nadia.fits',
    displayName: 'Nadia Boateng',
    role: 'customer',
    professionalRoleIds: ['bespoke-client', 'trend-observer'],
    primaryProfession: 'bespoke-client',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
    coverUrl: imagePool.wardrobe,
    city: 'Tema',
    region: 'Greater Accra',
    bio: 'Collector of sharp tailoring, soft palettes, and wearable drama.',
    followers: 2400,
    following: 611,
    verified: false,
  },
  {
    id: 'profile-kwame',
    username: 'kwame.kente',
    displayName: 'Kwame Badu',
    role: 'artisan',
    professionalRoleIds: ['kente-weaver', 'textile-artisan', 'fabric-vendor'],
    primaryProfession: 'kente-weaver',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
    coverUrl: imagePool.textile,
    city: 'Bonwire',
    region: 'Ashanti',
    bio: 'Kente weaving house producing custom strips, ceremonial panels, and provenance-backed textile lots.',
    followers: 17600,
    following: 402,
    verified: true,
  },
  {
    id: 'profile-afia',
    username: 'afia.styles',
    displayName: 'Afia Sarpong',
    role: 'designer',
    professionalRoleIds: ['fashion-stylist', 'creative-director', 'fashion-blogger-influencer'],
    primaryProfession: 'fashion-stylist',
    avatarUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=80',
    coverUrl: imagePool.editorial,
    city: 'East Legon',
    region: 'Greater Accra',
    bio: 'Stylist and creative director building campaign looks, wedding guilds, and trend reports.',
    followers: 22100,
    following: 890,
    verified: true,
  },
  {
    id: 'profile-selorm',
    username: 'selorm.frame',
    displayName: 'Selorm Ankomah',
    role: 'artisan',
    professionalRoleIds: ['fashion-photographer', 'fashion-videographer', 'model'],
    primaryProfession: 'fashion-photographer',
    avatarUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80',
    coverUrl: imagePool.studio,
    city: 'Labone',
    region: 'Greater Accra',
    bio: 'Fashion photographer and videographer capturing campaign drops, fittings, and runway films.',
    followers: 12900,
    following: 511,
    verified: true,
  },
  {
    id: 'profile-mansa',
    username: 'mansa.crown',
    displayName: 'Mansa Darko',
    role: 'artisan',
    professionalRoleIds: ['professional-braider', 'wig-architect', 'natural-hair-loctician', 'raw-hair-vendor'],
    primaryProfession: 'professional-braider',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
    coverUrl: imagePool.hair,
    city: 'Madina',
    region: 'Greater Accra',
    bio: 'Braids, locs, lace-front construction, and raw hair sourcing for editorial and bridal clients.',
    followers: 15300,
    following: 644,
    verified: true,
  },
  {
    id: 'profile-nana',
    username: 'nana.gold',
    displayName: 'Nana Yeboah',
    role: 'artisan',
    professionalRoleIds: ['goldsmith-silversmith', 'beadmaker-stringer', 'traditional-regalia-curator', 'accessory-designer'],
    primaryProfession: 'goldsmith-silversmith',
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
    coverUrl: imagePool.jewelry,
    city: 'Kumasi',
    region: 'Ashanti',
    bio: 'Goldsmith, bead stringer, and regalia curator for premium ceremony pieces and authenticated heirlooms.',
    followers: 9800,
    following: 277,
    verified: true,
  },
  {
    id: 'profile-theo',
    username: 'theo.dispatch',
    displayName: 'Theo Mensah',
    role: 'seller',
    professionalRoleIds: ['logistics-dispatch-partner'],
    primaryProfession: 'logistics-dispatch-partner',
    avatarUrl:
      'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=240&q=80',
    coverUrl: imagePool.logistics,
    city: 'Tema',
    region: 'Greater Accra',
    bio: 'Garment-safe dispatch for fabrics, fittings, proofs, returns, and ceremony delivery windows.',
    followers: 4100,
    following: 189,
    verified: true,
  },
  {
    id: 'profile-yvonne',
    username: 'yvonne.authlab',
    displayName: 'Yvonne Osei',
    role: 'admin',
    professionalRoleIds: ['authenticator-qa'],
    primaryProfession: 'authenticator-qa',
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80',
    coverUrl: imagePool.passport,
    city: 'Airport City',
    region: 'Greater Accra',
    bio: 'Authenticator and QA expert verifying premium textiles, designer pieces, NFC passports, and milestone disputes.',
    followers: 5200,
    following: 236,
    verified: true,
  },
]

export const vendors: VendorProfile[] = [
  {
    id: 'vendor-ama',
    profileId: 'profile-ama',
    studioName: 'Ama Thread House',
    roleTags: ['bespoke-tailor-seamstress', 'bridal-kente-couturier', 'fashion-designer'],
    suiteKey: 'apparel',
    specialties: ['Bespoke gowns', 'Corsetry', 'Kente accents'],
    services: ['Request a quote', 'Guild order lead', 'Fit-check alterations'],
    priceRange: 'GHS 850 - 6,500',
    rating: 4.9,
    reviewCount: 217,
    verified: true,
    availability: 'available',
    location: 'Osu, Accra',
  },
  {
    id: 'vendor-kofi',
    profileId: 'profile-kofi',
    studioName: 'Sole Lab Kumasi',
    roleTags: ['cordwainer-shoemaker', 'sneaker-customizer', 'footwear-restoration-expert'],
    suiteKey: 'footwear',
    specialties: ['Sneaker remake', 'Leather soles', 'NFC passports'],
    services: ['Custom pair', 'Repair', 'Guild footwear'],
    priceRange: 'GHS 350 - 2,800',
    rating: 4.8,
    reviewCount: 143,
    verified: true,
    availability: 'limited',
    location: 'Adum, Kumasi',
  },
  {
    id: 'vendor-esi',
    profileId: 'profile-esi',
    studioName: 'Esi Looks Studio',
    roleTags: ['makeup-artist', 'skin-glow-consultant'],
    suiteKey: 'beauty',
    specialties: ['Bridal MUA', 'Editorial glam', 'Skin prep'],
    services: ['Event booking', 'Guild beauty', 'Live shopping demos'],
    priceRange: 'GHS 500 - 3,200',
    rating: 4.7,
    reviewCount: 89,
    verified: true,
    availability: 'available',
    location: 'Cape Coast',
  },
  {
    id: 'vendor-kwame',
    profileId: 'profile-kwame',
    studioName: 'Bonwire Provenance Looms',
    roleTags: ['kente-weaver', 'textile-artisan', 'fabric-vendor'],
    suiteKey: 'textiles',
    specialties: ['Handwoven kente', 'Ceremony panels', 'Material passports'],
    services: ['Custom weave order', 'Fabric lots', 'Authenticity notes'],
    priceRange: 'GHS 280 - 4,900',
    rating: 4.9,
    reviewCount: 168,
    verified: true,
    availability: 'available',
    location: 'Bonwire, Ashanti',
  },
  {
    id: 'vendor-afia',
    profileId: 'profile-afia',
    studioName: 'Afia Style Bureau',
    roleTags: ['fashion-stylist', 'creative-director', 'fashion-blogger-influencer'],
    suiteKey: 'media',
    specialties: ['Wedding styling', 'Campaign direction', 'Moodboard curation'],
    services: ['Style brief', 'Guild coordination', 'Trend report'],
    priceRange: 'GHS 700 - 8,500',
    rating: 4.8,
    reviewCount: 121,
    verified: true,
    availability: 'limited',
    location: 'East Legon, Accra',
  },
  {
    id: 'vendor-selorm',
    profileId: 'profile-selorm',
    studioName: 'Selorm Frame House',
    roleTags: ['fashion-photographer', 'fashion-videographer', 'model'],
    suiteKey: 'media',
    specialties: ['Campaign shoots', 'Runway reels', 'Portfolio film'],
    services: ['Book shoot', 'Live event capture', 'Product content'],
    priceRange: 'GHS 600 - 7,200',
    rating: 4.7,
    reviewCount: 96,
    verified: true,
    availability: 'available',
    location: 'Labone, Accra',
  },
  {
    id: 'vendor-mansa',
    profileId: 'profile-mansa',
    studioName: 'Mansa Crown Hair',
    roleTags: ['professional-braider', 'wig-architect', 'natural-hair-loctician', 'raw-hair-vendor'],
    suiteKey: 'beauty',
    specialties: ['Knotless braids', 'Custom lace wigs', 'Loc maintenance'],
    services: ['Book appointment', 'Source bundles', 'Guild beauty'],
    priceRange: 'GHS 220 - 4,600',
    rating: 4.8,
    reviewCount: 134,
    verified: true,
    availability: 'available',
    location: 'Madina, Accra',
  },
  {
    id: 'vendor-nana',
    profileId: 'profile-nana',
    studioName: 'Nana Gold and Beads',
    roleTags: ['goldsmith-silversmith', 'beadmaker-stringer', 'traditional-regalia-curator', 'accessory-designer'],
    suiteKey: 'jewelry',
    specialties: ['Gold emblems', 'Waist beads', 'Regalia curation'],
    services: ['Commission piece', 'Regalia sourcing', 'Passport verification'],
    priceRange: 'GHS 400 - 22,000',
    rating: 4.9,
    reviewCount: 77,
    verified: true,
    availability: 'limited',
    location: 'Kumasi, Ashanti',
  },
  {
    id: 'vendor-theo',
    profileId: 'profile-theo',
    studioName: 'Theo Garment Dispatch',
    roleTags: ['logistics-dispatch-partner'],
    suiteKey: 'operations',
    specialties: ['Garment-safe delivery', 'Fabric pickups', 'Proof-of-delivery'],
    services: ['Schedule dispatch', 'Return pickup', 'Guild route'],
    priceRange: 'GHS 45 - 850',
    rating: 4.6,
    reviewCount: 62,
    verified: true,
    availability: 'available',
    location: 'Tema, Greater Accra',
  },
]

export const posts: Post[] = [
  {
    id: 'post-1',
    authorId: 'profile-ama',
    caption: 'Final fitting: off-shoulder column gown with hand-beaded kente flashes.',
    media: [{ id: 'media-1', kind: 'image', url: imagePool.gown, alt: 'Editorial gown fitting' }],
    hashtags: ['kente', 'bespoke', 'fitting'],
    likes: 1208,
    comments: 94,
    saves: 311,
    createdAt: '2026-06-22T16:30:00Z',
  },
  {
    id: 'post-2',
    authorId: 'profile-kofi',
    caption: 'Client brought worn-out court sneakers. We rebuilt the heel, dyed the panels, and tagged the passport.',
    media: [{ id: 'media-2', kind: 'image', url: imagePool.sneakers, alt: 'Restored sneakers' }],
    hashtags: ['sneakerlab', 'upcycle', 'passport'],
    likes: 768,
    comments: 55,
    saves: 144,
    createdAt: '2026-06-21T12:10:00Z',
  },
  {
    id: 'post-3',
    authorId: 'profile-esi',
    caption: 'Soft matte skin, copper lids, and a veil-ready finish for the guild shoot.',
    media: [{ id: 'media-3', kind: 'image', url: imagePool.makeup, alt: 'Makeup palette and brushes' }],
    hashtags: ['bridal', 'mua', 'guildorder'],
    likes: 982,
    comments: 66,
    saves: 205,
    createdAt: '2026-06-20T09:45:00Z',
  },
  {
    id: 'post-4',
    authorId: 'profile-kwame',
    caption: 'New kente strip batch finished with provenance notes for bridal couturiers and fabric vendors.',
    media: [{ id: 'media-4', kind: 'image', url: imagePool.textile, alt: 'Handwoven textile batch' }],
    hashtags: ['kente', 'textile', 'passport'],
    likes: 1120,
    comments: 73,
    saves: 260,
    createdAt: '2026-06-19T13:20:00Z',
  },
  {
    id: 'post-5',
    authorId: 'profile-afia',
    caption: 'Styling board locked for a three-vendor ceremony guild: couturier, MUA, jeweler.',
    media: [{ id: 'media-5', kind: 'image', url: imagePool.editorial, alt: 'Editorial styling board' }],
    hashtags: ['stylist', 'guildorder', 'moodboard'],
    likes: 1540,
    comments: 88,
    saves: 421,
    createdAt: '2026-06-18T10:30:00Z',
  },
  {
    id: 'post-6',
    authorId: 'profile-mansa',
    caption: 'Knotless braid map, raw hair bundle proof, and install care notes ready for the client.',
    media: [{ id: 'media-6', kind: 'image', url: imagePool.hair, alt: 'Hair styling workstation' }],
    hashtags: ['braids', 'beauty', 'mua'],
    likes: 903,
    comments: 49,
    saves: 189,
    createdAt: '2026-06-17T15:05:00Z',
  },
]

export const reels: Reel[] = [
  {
    id: 'reel-1',
    authorId: 'profile-ama',
    videoUrl: imagePool.studio,
    posterUrl: imagePool.studio,
    caption: 'Draping a neckline from sketch to muslin.',
    sound: 'Studio shears, take 04',
    likes: 24800,
    comments: 1180,
    shares: 640,
  },
  {
    id: 'reel-2',
    authorId: 'profile-kofi',
    videoUrl: imagePool.sneakers,
    posterUrl: imagePool.sneakers,
    caption: 'A sole swap in 38 seconds.',
    sound: 'Rubber press rhythm',
    likes: 13600,
    comments: 420,
    shares: 312,
  },
]

export const stories: Story[] = profiles.map((profile, index) => ({
  id: `story-${profile.id}`,
  authorId: profile.id,
  mediaUrl: [imagePool.fabric, imagePool.gown, imagePool.sneakers, imagePool.makeup][index],
  title: ['Fabric run', 'Final pinning', 'Sole dye', 'Skin prep'][index],
  expiresAt: '2026-06-25T19:30:00Z',
}))

export const conversations: Conversation[] = [
  {
    id: 'conversation-guild',
    title: 'Nadia wedding guild',
    memberIds: ['profile-nadia', 'profile-ama', 'profile-kofi', 'profile-esi'],
    typingNames: ['Ama'],
    messages: [
      {
        id: 'message-1',
        senderId: 'profile-nadia',
        body: 'Can we lock the silhouette from the matched moodboard and add gold sandals?',
        createdAt: '2026-06-24T08:14:00Z',
        read: true,
      },
      {
        id: 'message-2',
        senderId: 'profile-ama',
        body: 'Yes. I attached the combined quote card with tailor, MUA, and shoemaker splits.',
        createdAt: '2026-06-24T08:16:00Z',
        read: true,
        attachmentUrl: imagePool.sketch,
      },
    ],
  },
]

export const milestones: Milestone[] = [
  { id: 'milestone-1', label: 'Deposit', amount: 1800, status: 'complete' },
  { id: 'milestone-2', label: 'Fabric sourced', amount: 1250, status: 'complete', proofUrl: imagePool.fabric },
  { id: 'milestone-3', label: 'Cutting', amount: 900, status: 'active' },
  { id: 'milestone-4', label: 'Stitching', amount: 1400, status: 'locked' },
  { id: 'milestone-5', label: 'Fitting', amount: 750, status: 'locked' },
  { id: 'milestone-6', label: 'Delivery', amount: 500, status: 'locked' },
]

export const measurements: Measurement[] = [
  {
    id: 'measurement-nadia-v3',
    ownerName: 'Nadia',
    version: 3,
    heightCm: 170,
    chestCm: 91,
    waistCm: 72,
    hipsCm: 101,
    shoulderCm: 41,
    inseamCm: 78,
    sleeveCm: 58,
    confidence: 0.92,
  },
]

export const designs: Design[] = [
  {
    id: 'design-1',
    prompt: 'Flowing kente-accented evening gown, off-shoulder neckline, matte gold beadwork.',
    imageUrl: imagePool.sketch,
    status: 'broadcast',
    matchedVendors: 18,
  },
  {
    id: 'design-2',
    prompt: 'Minimal ivory two-piece with detachable train and sculpted corset.',
    imageUrl: imagePool.gown,
    status: 'saved',
    matchedVendors: 9,
  },
]

export const remixes: Remix[] = [
  {
    id: 'remix-1',
    beforeUrl: imagePool.wardrobe,
    afterUrl: imagePool.kente,
    title: 'Oversized shirt to corset wrap top',
    sustainabilityNote: 'Keeps 71% of original cotton in circulation and avoids a new shell fabric order.',
  },
]

export const fabricCatalog: Fabric[] = [
  { id: 'fabric-1', name: 'Handwoven kente panel', pricePerYard: 420, origin: 'Bonwire', tags: ['heritage', 'structured'] },
  { id: 'fabric-2', name: 'Italian crepe satin', pricePerYard: 260, origin: 'Milan', tags: ['drape', 'evening'] },
  { id: 'fabric-3', name: 'Organic cotton drill', pricePerYard: 95, origin: 'Tamale', tags: ['upcycle', 'daywear'] },
]

export const costEstimates: CostEstimate[] = [
  {
    id: 'estimate-1',
    garmentType: 'Off-shoulder evening gown',
    fabricId: 'fabric-1',
    yardage: 5.5,
    trims: 380,
    labour: 1800,
    total: 4490,
  },
]

export const auctions: Auction[] = [
  {
    id: 'auction-1',
    title: 'Emerald sculpted midi dress',
    imageUrl: imagePool.gown,
    sizeRange: { chest: [88, 96], waist: [68, 76], hips: [96, 106] },
    currentBid: 2650,
    endsAt: '2026-06-25T20:00:00Z',
    bidCount: 31,
    sellerId: 'profile-ama',
  },
]

export const bids: Bid[] = [
  { id: 'bid-1', auctionId: 'auction-1', bidderName: 'Yaa', amount: 2400, createdAt: '2026-06-24T09:01:00Z' },
  { id: 'bid-2', auctionId: 'auction-1', bidderName: 'Nadia', amount: 2650, createdAt: '2026-06-24T09:08:00Z' },
]

export const guildOrders: GuildOrder[] = [
  {
    id: 'guild-1',
    title: 'Nadia engagement look',
    clientId: 'profile-nadia',
    status: 'approved',
    total: 7420,
    participants: [
      { id: 'participant-1', vendorId: 'vendor-ama', role: 'Tailor lead', quote: 5200, milestone: 'Cutting' },
      { id: 'participant-2', vendorId: 'vendor-kofi', role: 'Shoemaker', quote: 1420, milestone: 'Leather sourcing' },
      { id: 'participant-3', vendorId: 'vendor-esi', role: 'MUA', quote: 800, milestone: 'Trial booked' },
    ],
  },
]

export const garments: Garment[] = [
  {
    id: 'garment-1',
    passportId: '7a8ef9f2-2c60-4f02-8d43-f1d8a79f18d6',
    ownerId: 'profile-nadia',
    makerId: 'profile-ama',
    name: 'Kente flash column gown',
    imageUrl: imagePool.gown,
    materials: ['Crepe satin', 'Handwoven kente', 'Glass beadwork'],
    care: 'Dry clean only. Store with padded hanger and breathable garment bag.',
    fitNotes: ['Waist ease: 2 cm', 'Hip fit: relaxed', 'Hem set for 8 cm heel'],
    createdAt: '2026-06-12T11:00:00Z',
  },
]

export const moodboards: Moodboard[] = [
  {
    id: 'moodboard-1',
    title: 'Copper evening romance',
    clientId: 'profile-nadia',
    artisanId: 'profile-ama',
    cards: [
      { id: 'mood-1', imageUrl: imagePool.kente, title: 'Kente flash', tags: ['heritage', 'accent'], matched: true },
      { id: 'mood-2', imageUrl: imagePool.gown, title: 'Column line', tags: ['clean', 'formal'], matched: true },
      { id: 'mood-3', imageUrl: imagePool.fabric, title: 'Textile story', tags: ['texture', 'warm'], matched: false },
    ],
  },
]

export const notifications: Notification[] = [
  {
    id: 'notification-1',
    title: 'Bid accepted',
    body: 'Your smart-sized bid on the emerald midi is now leading.',
    kind: 'bid',
    read: false,
    createdAt: '2026-06-24T09:09:00Z',
  },
  {
    id: 'notification-2',
    title: 'Milestone proof uploaded',
    body: 'Ama added fabric sourcing proof for your guild order.',
    kind: 'milestone',
    read: false,
    createdAt: '2026-06-24T08:55:00Z',
  },
]

export function getProfile(profileId: string) {
  const profile = profiles.find((item) => item.id === profileId)
  if (!profile) {
    throw new Error(`Unknown profile: ${profileId}`)
  }
  return profile
}

export function getVendor(vendorId: string) {
  const vendor = vendors.find((item) => item.id === vendorId)
  if (!vendor) {
    throw new Error(`Unknown vendor: ${vendorId}`)
  }
  return vendor
}
