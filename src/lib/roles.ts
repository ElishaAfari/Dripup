import type { Role } from '@/types/domain'

export type RoleGroupKey =
  | 'apparel'
  | 'textiles'
  | 'marketplace'
  | 'beauty'
  | 'footwear'
  | 'jewelry'
  | 'media'
  | 'clients'
  | 'operations'

export type SuiteWorkflow = {
  label: string
  description: string
  to: string
  cta: string
}

export type FashionRoleDefinition = {
  id: string
  title: string
  group: RoleGroupKey
  broadRole: Role
  audience: 'creator' | 'merchant' | 'curator' | 'consumer' | 'infrastructure'
  description: string
  suiteTitle: string
  suiteDescription: string
  capabilities: readonly string[]
  workflows: readonly SuiteWorkflow[]
  collaborators: readonly string[]
  marketplaceTags: readonly string[]
  trustRequirements: readonly string[]
}

export const roleGroups = [
  {
    key: 'apparel',
    label: 'Apparel and garment masterminds',
    description: 'Bespoke builds, RTW collections, bridal couture, streetwear, pattern drafting, cutting, fittings, and delivery-ready garments.',
  },
  {
    key: 'textiles',
    label: 'Textile artisans and material makers',
    description: 'Kente weaving, Adinkra printing, batik dyeing, fabric sourcing, material storytelling, and authenticated textile provenance.',
  },
  {
    key: 'marketplace',
    label: 'Suppliers and merchants',
    description: 'Fabric vendors, haberdashers, trims, raw hair, accessories, inventory, storefronts, quotes, auctions, and live shopping.',
  },
  {
    key: 'beauty',
    label: 'Hair, grooming, and glamour',
    description: 'Barbers, hairstylists, locticians, braiders, wig architects, MUAs, nail technicians, and skin consultants.',
  },
  {
    key: 'footwear',
    label: 'Footwear creators and customizers',
    description: 'Cordwainers, shoemakers, sneaker customizers, sandal crafters, and restoration experts with fit and passport tools.',
  },
  {
    key: 'jewelry',
    label: 'Jewelry and wearable ornamentation',
    description: 'Beadmakers, goldsmiths, silversmiths, accessory designers, regalia curators, crowns, hardware, and ceremony pieces.',
  },
  {
    key: 'media',
    label: 'Curators and visionaries',
    description: 'Stylists, creative directors, photographers, videographers, models, bloggers, influencers, and trend shapers.',
  },
  {
    key: 'clients',
    label: 'Consumers and enthusiasts',
    description: 'Bespoke clients, trend observers, collectors, wardrobe builders, tippers, savers, bidders, and fashion lovers.',
  },
  {
    key: 'operations',
    label: 'Trust and infrastructure',
    description: 'Logistics partners, dispatch teams, authenticators, quality assurance experts, NFC passport verification, and dispute support.',
  },
] as const satisfies readonly { key: RoleGroupKey; label: string; description: string }[]

const creatorWorkflows = [
  { label: 'Capture measurements', description: 'Collect fit data before quoting or cutting.', to: '/app/studio', cta: 'Open Studio' },
  { label: 'Quote protected order', description: 'Turn a brief into escrow-backed milestones.', to: '/app/commerce', cta: 'Quote' },
  { label: 'Publish portfolio', description: 'Drop process posts, reels, and proof shots.', to: '/app', cta: 'Post' },
] as const

const merchantWorkflows = [
  { label: 'List inventory', description: 'Put materials, trims, products, or services in commerce.', to: '/app/commerce', cta: 'Sell' },
  { label: 'Host live shopping', description: 'Pin products while streaming to buyers and makers.', to: '/app/live', cta: 'Go live' },
  { label: 'Join guild order', description: 'Attach supplies or service lines to a combined bill.', to: '/app/guild-orders', cta: 'Join guild' },
] as const

const curatorWorkflows = [
  { label: 'Build moodboard', description: 'Swipe references into a client-ready creative brief.', to: '/app/moodboards', cta: 'Curate' },
  { label: 'Broadcast style direction', description: 'Match makers, looks, models, and vendors.', to: '/app/search', cta: 'Discover' },
  { label: 'Publish campaign', description: 'Push reels, editorials, reviews, and live coverage.', to: '/app/reels', cta: 'Create' },
] as const

const clientWorkflows = [
  { label: 'Measure and fit-check', description: 'Use saved body profiles before bids or orders.', to: '/app/studio', cta: 'Measure' },
  { label: 'Commission a look', description: 'Request quotes, approve milestones, and track proof.', to: '/app/commerce', cta: 'Order' },
  { label: 'Save inspiration', description: 'Build boards, wardrobes, passports, and style history.', to: '/app/wardrobe', cta: 'Save' },
] as const

const operationsWorkflows = [
  { label: 'Verify item', description: 'Check passport, proof, quality notes, and ownership trail.', to: '/app/passport/7a8ef9f2-2c60-4f02-8d43-f1d8a79f18d6', cta: 'Scan' },
  { label: 'Coordinate handoff', description: 'Move garments, fabrics, and proof between parties.', to: '/app/messages', cta: 'Coordinate' },
  { label: 'Resolve milestone', description: 'Review proof, delivery state, and payout readiness.', to: '/app/commerce', cta: 'Review' },
] as const

export const fashionRoles = [
  role('bespoke-tailor-seamstress', 'Bespoke Tailor or Seamstress', 'apparel', 'artisan', 'creator', 'Custom made-to-measure clothing, alterations, fittings, cutting, stitching, and final garment delivery.', 'Bespoke Workstation', 'Measurements, fitting boards, quote requests, cutting milestones, proof uploads, and client chat stay in one tailor-first command center.', ['Measurement capture', 'Quote builder', 'Milestone proof', 'Client CRM', 'Portfolio reels'], creatorWorkflows, ['pattern-maker', 'fabric-vendor', 'makeup-artist', 'cordwainer-shoemaker'], ['bespoke', 'kaftan', 'agbada', 'suit', 'alterations'], ['Verified identity', 'Portfolio proof', 'Escrow milestone history']),
  role('fashion-designer', 'Fashion Designer', 'apparel', 'designer', 'creator', 'Concepts, sketches, creative briefs, silhouettes, materials, collections, and production direction.', 'Design Direction Suite', 'A studio for Dream-to-Draft outputs, collection moodboards, vendor matching, sample tracking, and runway-ready publishing.', ['AI sketching', 'Moodboard lock', 'Collection planning', 'Vendor matching', 'Guild production'], creatorWorkflows, ['pattern-maker', 'fashion-photographer', 'model', 'fabric-vendor'], ['designer', 'collection', 'runway', 'concept'], ['Verified identity', 'Original design record', 'Collaboration history']),
  role('creative-director', 'Creative Director', 'apparel', 'designer', 'curator', 'Artistic leadership for campaigns, collections, shoots, model styling, references, and brand direction.', 'Creative Command Suite', 'A direction board for style references, collaborators, shoot lists, campaign approvals, and cross-role guild teams.', ['Creative briefs', 'Campaign casting', 'Moodboard approval', 'Guild team assembly'], curatorWorkflows, ['fashion-stylist', 'fashion-photographer', 'model', 'makeup-artist'], ['creative direction', 'campaign', 'editorial'], ['Verified identity', 'Credit history', 'Rights and release notes']),
  role('rtw-brand', 'Ready-to-Wear Brand', 'apparel', 'designer', 'merchant', 'Standard-sized commercial collections, drops, inventory, product pages, live shopping, and customer service.', 'RTW Brand Console', 'Launch collections, manage product drops, pin items in live rooms, and route size-sensitive orders into fulfillment.', ['Product drops', 'Inventory', 'Live shopping pins', 'Order routing', 'Reviews'], merchantWorkflows, ['fashion-photographer', 'model', 'logistics-dispatch-partner'], ['rtw', 'collection', 'drop', 'ready to wear'], ['Business verification', 'Return policy', 'Product proof']),
  role('bridal-kente-couturier', 'Bridal and Traditional Kente Couturier', 'apparel', 'designer', 'creator', 'High-end wedding, engagement, and traditional ceremony looks with kente, beadwork, and coordinated teams.', 'Ceremony Couture Suite', 'Manage bride, groom, family measurements, kente sourcing, beauty teams, fittings, and split milestone payouts.', ['Family measurements', 'Guild order lead', 'Kente sourcing', 'Ceremony calendar', 'Proof approvals'], creatorWorkflows, ['kente-weaver', 'makeup-artist', 'goldsmith-silversmith', 'fashion-photographer'], ['bridal', 'kente', 'engagement', 'traditional'], ['Verified studio', 'Fabric authenticity', 'Milestone proof']),
  role('streetwear-designer', 'Streetwear Designer', 'apparel', 'designer', 'merchant', 'Graphic tees, hoodies, capsule drops, custom casual apparel, and culture-driven collections.', 'Streetwear Drop Suite', 'Plan capsules, publish reels, run live drops, collect preorders, and attach NFC passports to limited items.', ['Drop calendar', 'Preorders', 'Creator collabs', 'NFC passports', 'Auctions'], merchantWorkflows, ['fashion-blogger-influencer', 'sneaker-customizer', 'fashion-photographer'], ['streetwear', 'hoodie', 'graphic tee', 'drop'], ['Brand verification', 'Limited-edition proof', 'Fulfillment record']),
  role('pattern-maker', 'Pattern Maker', 'apparel', 'artisan', 'creator', 'Technical translation of sketches and AI drafts into accurate mathematical cutting blueprints.', 'Pattern Drafting Desk', 'Convert briefs and measurements into panels, revisions, fabric estimates, and maker-ready technical files.', ['Draft cards', 'Measurement inputs', 'Revision history', 'Cutting notes', 'Cost estimator'], creatorWorkflows, ['fashion-designer', 'bespoke-tailor-seamstress', 'fabric-cutter'], ['pattern', 'drafting', 'technical design'], ['Skill verification', 'Revision record', 'File handoff proof']),
  role('fabric-cutter', 'Fabric Cutter', 'apparel', 'artisan', 'creator', 'Precision cutting, panel preparation, grainline checks, and material waste control for production.', 'Cutting Room Suite', 'Track cutting files, fabric lay plans, waste estimates, proof photos, and milestone status for every order.', ['Cut plan', 'Waste estimate', 'Proof upload', 'Milestone status'], creatorWorkflows, ['pattern-maker', 'bespoke-tailor-seamstress', 'fabric-vendor'], ['cutting', 'panels', 'production'], ['Verified skill', 'Proof photos', 'Milestone accountability']),
  role('textile-artisan', 'Textile Artisan', 'textiles', 'artisan', 'creator', 'Raw material craft across weaving, printing, dyeing, finishing, and textile storytelling.', 'Textile Studio Suite', 'Show material process, provenance, stock, custom colorways, and authenticated textile lots for makers and clients.', ['Material passport', 'Custom lots', 'Process reels', 'Inventory', 'Vendor matching'], merchantWorkflows, ['fashion-designer', 'fabric-vendor', 'authenticator-qa'], ['textile', 'handmade', 'material'], ['Origin proof', 'Batch photos', 'Authenticity notes']),
  role('kente-weaver', 'Kente Weaver', 'textiles', 'artisan', 'creator', 'Handwoven kente strips, custom patterns, color symbolism, ceremony orders, and provenance.', 'Kente Loom Suite', 'Manage strip orders, symbolism notes, weaving proof, stock yards, and passport-ready provenance.', ['Pattern symbolism', 'Strip inventory', 'Weaving proof', 'Passport provenance'], merchantWorkflows, ['bridal-kente-couturier', 'fabric-vendor', 'authenticator-qa'], ['kente', 'weaving', 'heritage'], ['Origin proof', 'Weaver verification', 'Batch passport']),
  role('adinkra-printer', 'Adinkra Printer', 'textiles', 'artisan', 'creator', 'Symbol printing, stamped fabrics, custom panels, cultural pattern references, and textile finishing.', 'Adinkra Print Suite', 'Track symbols, print batches, colorways, client approvals, and fabric handoffs.', ['Symbol library', 'Batch proof', 'Custom panels', 'Client approval'], merchantWorkflows, ['fashion-designer', 'fabric-vendor', 'authenticator-qa'], ['adinkra', 'print', 'symbol'], ['Symbol documentation', 'Batch photos', 'Maker identity']),
  role('batik-dyer', 'Batik Dyer', 'textiles', 'artisan', 'creator', 'Wax-resist dyeing, custom colors, hand-finished textiles, and small-batch fabric lots.', 'Batik Dye Suite', 'Manage color formulas, dye batches, process proof, stock, and custom material requests.', ['Color formulas', 'Dye batch log', 'Inventory', 'Custom order proof'], merchantWorkflows, ['fashion-designer', 'fabric-vendor'], ['batik', 'dye', 'hand finished'], ['Batch proof', 'Color approval', 'Material care notes']),
  role('fabric-vendor', 'Fabric Vendor', 'marketplace', 'seller', 'merchant', 'High-end materials, traditional weaves, imported laces, hard wax prints, silks, and stock discovery.', 'Fabric Merchant Hub', 'Run inventory, price yards, match fabrics to measurements and designs, host live fabric rooms, and support guild orders.', ['Fabric catalog', 'Stock yards', 'Live selling', 'Cost estimator', 'Guild supply lines'], merchantWorkflows, ['bespoke-tailor-seamstress', 'fashion-designer', 'textile-artisan'], ['fabric', 'lace', 'silk', 'wax print'], ['Business verification', 'Stock proof', 'Origin notes']),
  role('haberdasher', 'Haberdasher and Trimming Supplier', 'marketplace', 'seller', 'merchant', 'Buttons, zippers, threads, interfacings, linings, clasps, and premium finishing supplies.', 'Trims Supply Hub', 'List trims, bundle supplies into orders, support rush sourcing, and pin finishing items in live rooms.', ['Trims catalog', 'Bundle builder', 'Rush sourcing', 'Inventory alerts'], merchantWorkflows, ['bespoke-tailor-seamstress', 'pattern-maker', 'rtw-brand'], ['buttons', 'zippers', 'thread', 'interfacing'], ['Business verification', 'Stock accuracy', 'Delivery proof']),
  role('accessory-crafter', 'Accessory Crafter', 'marketplace', 'artisan', 'merchant', 'Bespoke fascinators, beadwork, traditional jewelry, leather accents, and finishing pieces.', 'Accessory Craft Suite', 'Create accessory briefs, coordinate with outfits, list custom add-ons, and join guild order packages.', ['Custom accessories', 'Guild add-ons', 'Portfolio proof', 'Quote lines'], merchantWorkflows, ['fashion-stylist', 'bridal-kente-couturier', 'goldsmith-silversmith'], ['fascinator', 'beadwork', 'accessory'], ['Portfolio proof', 'Material notes', 'Delivery record']),
  role('raw-hair-vendor', 'Raw Hair Vendor', 'marketplace', 'seller', 'merchant', 'Human hair extensions, bundles, closures, frontals, quality grading, and salon supply.', 'Hair Supply Hub', 'List bundles, verify grades, route stock to wig architects, and manage salon or client deliveries.', ['Bundle catalog', 'Grade proof', 'Supplier chat', 'Delivery tracking'], merchantWorkflows, ['wig-architect', 'hairdresser-hairstylist', 'professional-braider'], ['raw hair', 'bundles', 'closures'], ['Supplier verification', 'Grade proof', 'Return policy']),
  role('master-barber', 'Master Barber', 'beauty', 'artisan', 'creator', 'Precision fades, beard trims, hair art, grooming appointments, and event packages.', 'Barber Booking Suite', 'Manage appointment slots, grooming portfolios, client reminders, and event guild bookings.', ['Bookings', 'Grooming portfolio', 'Event package', 'Client notes'], creatorWorkflows, ['fashion-stylist', 'fashion-photographer', 'bespoke-client'], ['barber', 'fade', 'beard'], ['Identity verification', 'Portfolio proof', 'Appointment reliability']),
  role('hairdresser-hairstylist', 'Hairdresser and Hairstylist', 'beauty', 'artisan', 'creator', 'Cuts, color, treatments, styling, bridal hair, editorial hair, and client transformations.', 'Hair Styling Suite', 'Plan services, book clients, share transformations, and join fashion guild orders.', ['Appointments', 'Before-after reels', 'Service menu', 'Guild beauty'], creatorWorkflows, ['makeup-artist', 'fashion-stylist', 'fashion-photographer'], ['hair', 'styling', 'color'], ['Portfolio proof', 'Hygiene standards', 'Booking history']),
  role('natural-hair-loctician', 'Natural Hair Loctician', 'beauty', 'artisan', 'creator', 'Loc installs, retwists, repair, styling, maintenance plans, and natural hair care.', 'Loc Care Suite', 'Manage maintenance cycles, product notes, progress photos, and recurring bookings.', ['Maintenance calendar', 'Progress gallery', 'Product notes', 'Client reminders'], creatorWorkflows, ['skin-glow-consultant', 'fashion-photographer'], ['locs', 'retwist', 'natural hair'], ['Portfolio proof', 'Care instructions', 'Booking reliability']),
  role('professional-braider', 'Professional Braider', 'beauty', 'artisan', 'creator', 'Cornrows, box braids, knotless braids, traditional African patterns, and protective styling.', 'Braiding Studio Suite', 'Show braid patterns, estimate service time, manage deposits, and coordinate appointments.', ['Pattern gallery', 'Booking deposits', 'Time estimator', 'Client care notes'], creatorWorkflows, ['raw-hair-vendor', 'fashion-stylist'], ['braids', 'cornrows', 'knotless'], ['Portfolio proof', 'Service timing', 'Care notes']),
  role('wig-architect', 'Wig Architect and Ventilator', 'beauty', 'artisan', 'creator', 'Custom lace-front wigs, coloring, ventilation, styling, installs, and hairpiece construction.', 'Wig Architecture Suite', 'Manage custom cap measurements, raw hair sourcing, construction proof, installs, and care passports.', ['Cap measurements', 'Raw hair sourcing', 'Construction proof', 'Care passport'], creatorWorkflows, ['raw-hair-vendor', 'makeup-artist', 'fashion-photographer'], ['wig', 'lace front', 'ventilation'], ['Portfolio proof', 'Material proof', 'Care instructions']),
  role('makeup-artist', 'Makeup Artist', 'beauty', 'mua', 'creator', 'Clean glam, bridal makeup, editorial looks, runway faces, trials, and beauty team collaboration.', 'MUA Glam Suite', 'Manage trials, face charts, product notes, bookings, live demos, and guild beauty milestones.', ['Bookings', 'Face charts', 'Guild milestones', 'Live demos', 'Portfolio reels'], creatorWorkflows, ['bridal-kente-couturier', 'hairdresser-hairstylist', 'fashion-photographer'], ['mua', 'makeup', 'bridal glam'], ['Portfolio proof', 'Product hygiene', 'Booking reliability']),
  role('nail-technician', 'Nail Technician', 'beauty', 'artisan', 'creator', 'Extensions, acrylics, gel, hand-painted nail art, ceremony nails, and beauty packages.', 'Nail Art Suite', 'Publish nail sets, manage appointments, coordinate color palettes, and attach service lines to guild orders.', ['Appointment slots', 'Design gallery', 'Palette matching', 'Guild beauty'], creatorWorkflows, ['makeup-artist', 'fashion-stylist', 'bespoke-client'], ['nails', 'acrylic', 'gel'], ['Portfolio proof', 'Hygiene standards', 'Booking reliability']),
  role('skin-glow-consultant', 'Skin and Glow Consultant', 'beauty', 'artisan', 'creator', 'Esthetics, glow routines, skin prep, product curation, and camera-ready complexion planning.', 'Glow Consultation Suite', 'Manage consultations, routines, product notes, progress logs, and shoot prep recommendations.', ['Consultations', 'Routine plans', 'Progress logs', 'Shoot prep'], creatorWorkflows, ['makeup-artist', 'model', 'bespoke-client'], ['skin', 'glow', 'esthetician'], ['Credentials', 'Product notes', 'Client consent']),
  role('cordwainer-shoemaker', 'Cordwainer and Shoemaker', 'footwear', 'artisan', 'creator', 'Handcrafted leather shoes, boots, traditional dress footwear, repairs, and custom lasts.', 'Footwear Atelier Suite', 'Capture foot measurements, quote custom pairs, track leather sourcing, proof builds, and attach passports.', ['Foot measurements', 'Leather sourcing', 'Milestone proof', 'NFC passports'], creatorWorkflows, ['bespoke-tailor-seamstress', 'bridal-kente-couturier', 'logistics-dispatch-partner'], ['shoemaker', 'leather', 'cordwainer'], ['Portfolio proof', 'Material proof', 'Fit policy']),
  role('sneaker-customizer', 'Sneaker Customizer', 'footwear', 'artisan', 'creator', 'Painted, modified, reconstructed, and collectible sneakers as wearable art.', 'Sneaker Custom Suite', 'Track base shoes, concept drafts, restoration steps, proof shots, auctions, and passports.', ['Remix briefs', 'Restoration proof', 'Auction drops', 'NFC passports'], creatorWorkflows, ['streetwear-designer', 'fashion-blogger-influencer', 'bespoke-client'], ['sneaker', 'custom', 'upcycle'], ['Portfolio proof', 'Authenticity notes', 'Condition report']),
  role('luxury-sandal-crafter', 'Luxury Sandal and Slipper Crafter', 'footwear', 'artisan', 'merchant', 'High-end leather slides, slippers, native sandals, decorated ceremony footwear, and fit-led orders.', 'Sandal Craft Suite', 'List sandal styles, coordinate outfit palettes, manage sizes, and join ceremony guild orders.', ['Size ranges', 'Custom straps', 'Guild footwear', 'Product catalog'], merchantWorkflows, ['bridal-kente-couturier', 'fashion-stylist', 'logistics-dispatch-partner'], ['sandals', 'slippers', 'native footwear'], ['Portfolio proof', 'Material notes', 'Fit policy']),
  role('footwear-restoration-expert', 'Footwear Restoration Expert', 'footwear', 'artisan', 'creator', 'Cleaning, repair, sole swaps, leather restoration, condition reports, and premium shoe revival.', 'Restoration Bench Suite', 'Document before-after states, estimate repair cost, track proof milestones, and authenticate premium pairs.', ['Condition report', 'Before-after proof', 'Repair quote', 'Passport update'], creatorWorkflows, ['authenticator-qa', 'sneaker-customizer', 'bespoke-client'], ['restoration', 'cleaning', 'repair'], ['Before proof', 'After proof', 'Condition honesty']),
  role('beadmaker-stringer', 'Beadmaker and Stringer', 'jewelry', 'artisan', 'creator', 'Traditional glass beads, waist beads, wristbands, statement neckpieces, and custom ceremony strings.', 'Beadwork Suite', 'Manage bead lots, custom measurements, symbolism notes, order proofs, and ceremony bundles.', ['Bead inventory', 'Custom sizes', 'Symbolism notes', 'Guild add-ons'], merchantWorkflows, ['bridal-kente-couturier', 'traditional-regalia-curator', 'fashion-stylist'], ['beads', 'waist beads', 'neckpiece'], ['Material proof', 'Cultural notes', 'Portfolio proof']),
  role('goldsmith-silversmith', 'Goldsmith and Silversmith', 'jewelry', 'artisan', 'creator', 'Precious metal rings, chains, emblems, traditional gold pieces, and luxury jewelry commissions.', 'Precious Metal Suite', 'Track metal source, CAD or sketch references, milestone proof, authenticity, and ownership records.', ['Material source', 'Commission proof', 'Authenticity', 'Passport history'], merchantWorkflows, ['authenticator-qa', 'traditional-regalia-curator', 'bespoke-client'], ['goldsmith', 'silversmith', 'jewelry'], ['Identity verification', 'Material documentation', 'Authenticity proof']),
  role('accessory-designer', 'Accessory Designer', 'jewelry', 'designer', 'merchant', 'Brooches, watches, pocket squares, metal hardware, garment embellishments, and look-completing details.', 'Accessory Design Suite', 'Design accessories, match garment palettes, quote custom pieces, and attach products to guild looks.', ['Palette matching', 'Custom quotes', 'Product catalog', 'Guild add-ons'], merchantWorkflows, ['fashion-stylist', 'bespoke-tailor-seamstress', 'fashion-photographer'], ['brooch', 'hardware', 'pocket square'], ['Portfolio proof', 'Material notes', 'Delivery record']),
  role('traditional-regalia-curator', 'Traditional Regalia Curator', 'jewelry', 'seller', 'curator', 'Royal jewelry, crowns, ceremonial pieces, sourcing, preservation, and event-ready regalia packages.', 'Regalia Curation Suite', 'Catalog ceremony pieces, verify authenticity, coordinate rentals, logistics, and cultural care instructions.', ['Regalia catalog', 'Authenticity', 'Rental tracking', 'Care instructions'], merchantWorkflows, ['authenticator-qa', 'logistics-dispatch-partner', 'bridal-kente-couturier'], ['regalia', 'crown', 'ceremony'], ['Authenticity proof', 'Condition report', 'Transfer log']),
  role('fashion-stylist', 'Fashion Stylist', 'media', 'designer', 'curator', 'Outfit curation for clients, shoots, weddings, campaigns, and multi-vendor fashion coordination.', 'Stylist Command Suite', 'Build looks, match clients to makers, coordinate guild teams, lock moodboards, and publish style stories.', ['Outfit builder', 'Maker matching', 'Moodboard lock', 'Guild coordination'], curatorWorkflows, ['bespoke-tailor-seamstress', 'makeup-artist', 'fashion-photographer', 'model'], ['stylist', 'outfit', 'shoot'], ['Portfolio proof', 'Credit history', 'Client reviews']),
  role('fashion-photographer', 'Fashion Photographer', 'media', 'artisan', 'curator', 'Campaign images, product shoots, runway moments, portfolio visuals, and high-definition social content.', 'Photography Studio Suite', 'Book shoots, publish galleries, attach media to portfolios, and coordinate campaign teams.', ['Shoot booking', 'Portfolio delivery', 'Campaign boards', 'Creator credits'], curatorWorkflows, ['model', 'makeup-artist', 'fashion-stylist'], ['photographer', 'campaign', 'editorial'], ['Portfolio proof', 'Usage rights', 'Delivery history']),
  role('fashion-videographer', 'Fashion Videographer', 'media', 'artisan', 'curator', 'Runway video, reels, process films, campaign motion, live event capture, and product storytelling.', 'Video Production Suite', 'Plan shot lists, deliver reels, stream events, and attach videos to product and profile pages.', ['Shot lists', 'Reel delivery', 'Live event capture', 'Usage rights'], curatorWorkflows, ['fashion-photographer', 'fashion-blogger-influencer', 'model'], ['videographer', 'reels', 'runway'], ['Portfolio proof', 'Usage rights', 'Delivery history']),
  role('model', 'Model', 'media', 'customer', 'curator', 'Portfolio building, fittings, collaborations, runway, campaign casting, and drape/fold showcase.', 'Model Portfolio Suite', 'Manage measurements, comp cards, casting availability, collaborations, and portfolio drops.', ['Comp card', 'Measurements', 'Casting availability', 'Portfolio reels'], curatorWorkflows, ['fashion-photographer', 'makeup-artist', 'fashion-designer'], ['model', 'portfolio', 'runway'], ['Identity verification', 'Measurement consent', 'Credit history']),
  role('fashion-blogger-influencer', 'Fashion Blogger or Influencer', 'media', 'customer', 'curator', 'Reviews, cultural commentary, trend discovery, creator promotion, and traffic-driving content.', 'Influencer Media Suite', 'Create reviews, trend boards, affiliate-style maker discovery, live commentary, and audience tips.', ['Reviews', 'Trend boards', 'Live commentary', 'Creator tips'], curatorWorkflows, ['streetwear-designer', 'fashion-photographer', 'fabric-vendor'], ['influencer', 'blogger', 'review'], ['Disclosure notes', 'Audience trust', 'Review history']),
  role('bespoke-client', 'Bespoke Client', 'clients', 'customer', 'consumer', 'Commissioning custom looks, AI measurements, quotes, escrow approvals, fittings, wardrobe, and passports.', 'Client Wardrobe Suite', 'Move from inspiration to measurements, quotes, escrow milestones, fit-check, and garment passport ownership.', ['AI measurements', 'Quote approvals', 'Escrow milestones', 'Wardrobe', 'Passports'], clientWorkflows, ['bespoke-tailor-seamstress', 'fashion-stylist', 'makeup-artist', 'cordwainer-shoemaker'], ['client', 'bespoke', 'wardrobe'], ['Payment verification', 'Measurement consent', 'Order history']),
  role('trend-observer', 'Trend Observer', 'clients', 'customer', 'consumer', 'Lifestyle discovery, saving looks, sharing posts, tipping creators, bidding, and following fashion culture.', 'Trend Discovery Suite', 'Scroll the fashion graph, save boards, tip creators, follow drops, join lives, and convert inspiration into orders.', ['Saved boards', 'Creator tips', 'Reels', 'Live rooms', 'Auctions'], clientWorkflows, ['fashion-blogger-influencer', 'fashion-stylist', 'rtw-brand'], ['trend', 'observer', 'fashion lover'], ['Community safety', 'Payment readiness', 'Saved preference history']),
  role('logistics-dispatch-partner', 'Logistics and Dispatch Partner', 'operations', 'seller', 'infrastructure', 'Transporting fabrics, delicate garments, ceremony pieces, proofs, returns, and premium handoffs.', 'Dispatch Operations Suite', 'Coordinate pickup, garment-safe handling, proof-of-delivery photos, route chat, and milestone completion.', ['Pickup queue', 'Proof of delivery', 'Route chat', 'Milestone handoff'], operationsWorkflows, ['fabric-vendor', 'bespoke-tailor-seamstress', 'authenticator-qa'], ['dispatch', 'delivery', 'logistics'], ['Identity verification', 'Delivery proof', 'Handling standards']),
  role('authenticator-qa', 'Authenticator and Quality Assurance Expert', 'operations', 'admin', 'infrastructure', 'Authenticity, NFC passport verification, premium fabric checks, quality proof, and anti-counterfeit trust.', 'Trust and QA Suite', 'Verify passports, check material proof, inspect quality, record authenticity, and support disputes.', ['NFC verification', 'Quality checklist', 'Counterfeit prevention', 'Dispute notes'], operationsWorkflows, ['goldsmith-silversmith', 'fabric-vendor', 'traditional-regalia-curator'], ['authenticator', 'quality assurance', 'nfc'], ['Expert verification', 'Audit trail', 'Conflict of interest control']),
] as const satisfies readonly FashionRoleDefinition[]

export type ProfessionalRoleId = (typeof fashionRoles)[number]['id']

export function getRoleDefinition(roleId: string | undefined): FashionRoleDefinition {
  return fashionRoles.find((roleItem) => roleItem.id === roleId) ?? fashionRoles.find((roleItem) => roleItem.id === 'bespoke-client') ?? fashionRoles[0]
}

export function getRoleGroup(groupKey: RoleGroupKey) {
  return roleGroups.find((group) => group.key === groupKey) ?? roleGroups[0]
}

export function rolesByGroup(groupKey: RoleGroupKey) {
  return fashionRoles.filter((roleItem) => roleItem.group === groupKey)
}

export function authRolesForProfessionalRole(roleId: string): Role[] {
  const broadRole = getRoleDefinition(roleId).broadRole
  if (broadRole === 'customer') {
    return ['customer']
  }
  return ['customer', broadRole]
}

export function defaultProfessionalRoleForBroadRole(role: Role): ProfessionalRoleId {
  const fallbackByRole: Record<Role, ProfessionalRoleId> = {
    customer: 'bespoke-client',
    artisan: 'bespoke-tailor-seamstress',
    designer: 'fashion-designer',
    mua: 'makeup-artist',
    seller: 'fabric-vendor',
    admin: 'authenticator-qa',
  }

  return fallbackByRole[role]
}

function role(
  id: string,
  title: string,
  group: RoleGroupKey,
  broadRole: Role,
  audience: FashionRoleDefinition['audience'],
  description: string,
  suiteTitle: string,
  suiteDescription: string,
  capabilities: readonly string[],
  workflows: readonly SuiteWorkflow[],
  collaborators: readonly string[],
  marketplaceTags: readonly string[],
  trustRequirements: readonly string[],
): FashionRoleDefinition {
  return {
    id,
    title,
    group,
    broadRole,
    audience,
    description,
    suiteTitle,
    suiteDescription,
    capabilities,
    workflows,
    collaborators,
    marketplaceTags,
    trustRequirements,
  }
}
