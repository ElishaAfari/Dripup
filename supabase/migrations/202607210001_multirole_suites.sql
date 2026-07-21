create table if not exists public.professional_role_catalog (
  id text primary key,
  group_key text not null,
  group_label text not null,
  title text not null,
  broad_role public.app_role not null,
  audience text not null,
  description text not null default '',
  suite_title text not null default '',
  suite_description text not null default '',
  capabilities text[] not null default '{}',
  marketplace_tags text[] not null default '{}',
  trust_requirements text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.profiles
  add column if not exists professional_role_ids text[] not null default '{}',
  add column if not exists primary_profession text;

alter table public.vendor_profiles
  add column if not exists role_tags text[] not null default '{}',
  add column if not exists suite_key text;

create table if not exists public.profile_professional_roles (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_id text not null references public.professional_role_catalog(id) on delete restrict,
  is_primary boolean not null default false,
  years_experience integer,
  visibility text not null default 'public',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (profile_id, role_id)
);

create index if not exists profiles_professional_roles_idx on public.profiles using gin (professional_role_ids);
create index if not exists profiles_primary_profession_idx on public.profiles(primary_profession);
create index if not exists vendor_profiles_role_tags_idx on public.vendor_profiles using gin (role_tags);
create index if not exists vendor_profiles_suite_key_idx on public.vendor_profiles(suite_key);
create index if not exists profile_professional_roles_profile_idx on public.profile_professional_roles(profile_id);
create index if not exists profile_professional_roles_role_idx on public.profile_professional_roles(role_id);

alter table public.professional_role_catalog enable row level security;
alter table public.profile_professional_roles enable row level security;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'professional_role_catalog_set_updated_at') then
    create trigger professional_role_catalog_set_updated_at
    before update on public.professional_role_catalog
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'profile_professional_roles_set_updated_at') then
    create trigger profile_professional_roles_set_updated_at
    before update on public.profile_professional_roles
    for each row execute function public.set_updated_at();
  end if;
end;
$$;

create policy "professional roles authenticated read" on public.professional_role_catalog
for select to authenticated
using (deleted_at is null);

create policy "professional roles admin manage" on public.professional_role_catalog
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "profile professional roles read" on public.profile_professional_roles
for select to authenticated
using (
  deleted_at is null
  and (
    visibility = 'public'
    or profile_id = auth.uid()
    or public.is_admin()
  )
);

create policy "profile professional roles own manage" on public.profile_professional_roles
for all to authenticated
using (profile_id = auth.uid() or public.is_admin())
with check (profile_id = auth.uid() or public.is_admin());

insert into public.professional_role_catalog (
  id, group_key, group_label, title, broad_role, audience, description, suite_title,
  suite_description, capabilities, marketplace_tags, trust_requirements
)
values
  ('bespoke-tailor-seamstress','apparel','Apparel and garment masterminds','Bespoke Tailor or Seamstress','artisan','creator','Custom made-to-measure clothing, alterations, fittings, cutting, stitching, and final garment delivery.','Bespoke Workstation','Measurements, fitting boards, quote requests, cutting milestones, proof uploads, and client chat.','{"Measurement capture","Quote builder","Milestone proof","Client CRM","Portfolio reels"}','{"bespoke","kaftan","agbada","suit","alterations"}','{"Verified identity","Portfolio proof","Escrow milestone history"}'),
  ('fashion-designer','apparel','Apparel and garment masterminds','Fashion Designer','designer','creator','Concepts, sketches, creative briefs, silhouettes, materials, collections, and production direction.','Design Direction Suite','Dream-to-Draft outputs, collection moodboards, vendor matching, sample tracking, and publishing.','{"AI sketching","Moodboard lock","Collection planning","Vendor matching","Guild production"}','{"designer","collection","runway","concept"}','{"Verified identity","Original design record","Collaboration history"}'),
  ('creative-director','apparel','Apparel and garment masterminds','Creative Director','designer','curator','Artistic leadership for campaigns, collections, shoots, model styling, references, and brand direction.','Creative Command Suite','Style references, collaborators, shoot lists, campaign approvals, and cross-role guild teams.','{"Creative briefs","Campaign casting","Moodboard approval","Guild team assembly"}','{"creative direction","campaign","editorial"}','{"Verified identity","Credit history","Rights and release notes"}'),
  ('rtw-brand','apparel','Apparel and garment masterminds','Ready-to-Wear Brand','designer','merchant','Standard-sized commercial collections, drops, inventory, product pages, live shopping, and customer service.','RTW Brand Console','Collections, product drops, live pins, and size-sensitive order fulfillment.','{"Product drops","Inventory","Live shopping pins","Order routing","Reviews"}','{"rtw","collection","drop","ready to wear"}','{"Business verification","Return policy","Product proof"}'),
  ('bridal-kente-couturier','apparel','Apparel and garment masterminds','Bridal and Traditional Kente Couturier','designer','creator','High-end wedding, engagement, and traditional ceremony looks with kente, beadwork, and coordinated teams.','Ceremony Couture Suite','Family measurements, kente sourcing, beauty teams, fittings, and split milestone payouts.','{"Family measurements","Guild order lead","Kente sourcing","Ceremony calendar","Proof approvals"}','{"bridal","kente","engagement","traditional"}','{"Verified studio","Fabric authenticity","Milestone proof"}'),
  ('streetwear-designer','apparel','Apparel and garment masterminds','Streetwear Designer','designer','merchant','Graphic tees, hoodies, capsule drops, custom casual apparel, and culture-driven collections.','Streetwear Drop Suite','Capsules, reels, live drops, preorders, and NFC passports for limited items.','{"Drop calendar","Preorders","Creator collabs","NFC passports","Auctions"}','{"streetwear","hoodie","graphic tee","drop"}','{"Brand verification","Limited-edition proof","Fulfillment record"}'),
  ('pattern-maker','apparel','Apparel and garment masterminds','Pattern Maker','artisan','creator','Technical translation of sketches and AI drafts into accurate mathematical cutting blueprints.','Pattern Drafting Desk','Briefs and measurements become panels, revisions, fabric estimates, and technical files.','{"Draft cards","Measurement inputs","Revision history","Cutting notes","Cost estimator"}','{"pattern","drafting","technical design"}','{"Skill verification","Revision record","File handoff proof"}'),
  ('fabric-cutter','apparel','Apparel and garment masterminds','Fabric Cutter','artisan','creator','Precision cutting, panel preparation, grainline checks, and material waste control for production.','Cutting Room Suite','Cutting files, fabric lay plans, waste estimates, proof photos, and milestone status.','{"Cut plan","Waste estimate","Proof upload","Milestone status"}','{"cutting","panels","production"}','{"Verified skill","Proof photos","Milestone accountability"}'),
  ('textile-artisan','textiles','Textile artisans and material makers','Textile Artisan','artisan','creator','Raw material craft across weaving, printing, dyeing, finishing, and textile storytelling.','Textile Studio Suite','Material process, provenance, stock, custom colorways, and authenticated textile lots.','{"Material passport","Custom lots","Process reels","Inventory","Vendor matching"}','{"textile","handmade","material"}','{"Origin proof","Batch photos","Authenticity notes"}'),
  ('kente-weaver','textiles','Textile artisans and material makers','Kente Weaver','artisan','creator','Handwoven kente strips, custom patterns, color symbolism, ceremony orders, and provenance.','Kente Loom Suite','Strip orders, symbolism notes, weaving proof, stock yards, and provenance.','{"Pattern symbolism","Strip inventory","Weaving proof","Passport provenance"}','{"kente","weaving","heritage"}','{"Origin proof","Weaver verification","Batch passport"}'),
  ('adinkra-printer','textiles','Textile artisans and material makers','Adinkra Printer','artisan','creator','Symbol printing, stamped fabrics, custom panels, cultural pattern references, and textile finishing.','Adinkra Print Suite','Symbols, print batches, colorways, client approvals, and fabric handoffs.','{"Symbol library","Batch proof","Custom panels","Client approval"}','{"adinkra","print","symbol"}','{"Symbol documentation","Batch photos","Maker identity"}'),
  ('batik-dyer','textiles','Textile artisans and material makers','Batik Dyer','artisan','creator','Wax-resist dyeing, custom colors, hand-finished textiles, and small-batch fabric lots.','Batik Dye Suite','Color formulas, dye batches, process proof, stock, and custom material requests.','{"Color formulas","Dye batch log","Inventory","Custom order proof"}','{"batik","dye","hand finished"}','{"Batch proof","Color approval","Material care notes"}'),
  ('fabric-vendor','marketplace','Suppliers and merchants','Fabric Vendor','seller','merchant','High-end materials, traditional weaves, imported laces, hard wax prints, silks, and stock discovery.','Fabric Merchant Hub','Inventory, yard pricing, material matching, live fabric rooms, and guild supply lines.','{"Fabric catalog","Stock yards","Live selling","Cost estimator","Guild supply lines"}','{"fabric","lace","silk","wax print"}','{"Business verification","Stock proof","Origin notes"}'),
  ('haberdasher','marketplace','Suppliers and merchants','Haberdasher and Trimming Supplier','seller','merchant','Buttons, zippers, threads, interfacings, linings, clasps, and premium finishing supplies.','Trims Supply Hub','Trims inventory, order bundles, rush sourcing, and live finishing pins.','{"Trims catalog","Bundle builder","Rush sourcing","Inventory alerts"}','{"buttons","zippers","thread","interfacing"}','{"Business verification","Stock accuracy","Delivery proof"}'),
  ('accessory-crafter','marketplace','Suppliers and merchants','Accessory Crafter','artisan','merchant','Bespoke fascinators, beadwork, traditional jewelry, leather accents, and finishing pieces.','Accessory Craft Suite','Accessory briefs, custom add-ons, portfolio proof, and guild order packages.','{"Custom accessories","Guild add-ons","Portfolio proof","Quote lines"}','{"fascinator","beadwork","accessory"}','{"Portfolio proof","Material notes","Delivery record"}'),
  ('raw-hair-vendor','marketplace','Suppliers and merchants','Raw Hair Vendor','seller','merchant','Human hair extensions, bundles, closures, frontals, quality grading, and salon supply.','Hair Supply Hub','Bundle listings, grade proof, wig architect routing, and salon deliveries.','{"Bundle catalog","Grade proof","Supplier chat","Delivery tracking"}','{"raw hair","bundles","closures"}','{"Supplier verification","Grade proof","Return policy"}'),
  ('master-barber','beauty','Hair, grooming, and glamour','Master Barber','artisan','creator','Precision fades, beard trims, hair art, grooming appointments, and event packages.','Barber Booking Suite','Appointment slots, grooming portfolios, client reminders, and event guild bookings.','{"Bookings","Grooming portfolio","Event package","Client notes"}','{"barber","fade","beard"}','{"Identity verification","Portfolio proof","Appointment reliability"}'),
  ('hairdresser-hairstylist','beauty','Hair, grooming, and glamour','Hairdresser and Hairstylist','artisan','creator','Cuts, color, treatments, styling, bridal hair, editorial hair, and client transformations.','Hair Styling Suite','Service planning, bookings, transformations, and fashion guild beauty lines.','{"Appointments","Before-after reels","Service menu","Guild beauty"}','{"hair","styling","color"}','{"Portfolio proof","Hygiene standards","Booking history"}'),
  ('natural-hair-loctician','beauty','Hair, grooming, and glamour','Natural Hair Loctician','artisan','creator','Loc installs, retwists, repair, styling, maintenance plans, and natural hair care.','Loc Care Suite','Maintenance cycles, product notes, progress photos, and recurring bookings.','{"Maintenance calendar","Progress gallery","Product notes","Client reminders"}','{"locs","retwist","natural hair"}','{"Portfolio proof","Care instructions","Booking reliability"}'),
  ('professional-braider','beauty','Hair, grooming, and glamour','Professional Braider','artisan','creator','Cornrows, box braids, knotless braids, traditional African patterns, and protective styling.','Braiding Studio Suite','Pattern galleries, service time estimates, deposits, and appointment care notes.','{"Pattern gallery","Booking deposits","Time estimator","Client care notes"}','{"braids","cornrows","knotless"}','{"Portfolio proof","Service timing","Care notes"}'),
  ('wig-architect','beauty','Hair, grooming, and glamour','Wig Architect and Ventilator','artisan','creator','Custom lace-front wigs, coloring, ventilation, styling, installs, and hairpiece construction.','Wig Architecture Suite','Cap measurements, raw hair sourcing, construction proof, installs, and care passports.','{"Cap measurements","Raw hair sourcing","Construction proof","Care passport"}','{"wig","lace front","ventilation"}','{"Portfolio proof","Material proof","Care instructions"}'),
  ('makeup-artist','beauty','Hair, grooming, and glamour','Makeup Artist','mua','creator','Clean glam, bridal makeup, editorial looks, runway faces, trials, and beauty team collaboration.','MUA Glam Suite','Trials, face charts, product notes, bookings, live demos, and guild beauty milestones.','{"Bookings","Face charts","Guild milestones","Live demos","Portfolio reels"}','{"mua","makeup","bridal glam"}','{"Portfolio proof","Product hygiene","Booking reliability"}'),
  ('nail-technician','beauty','Hair, grooming, and glamour','Nail Technician','artisan','creator','Extensions, acrylics, gel, hand-painted nail art, ceremony nails, and beauty packages.','Nail Art Suite','Nail sets, appointments, palette coordination, and guild service lines.','{"Appointment slots","Design gallery","Palette matching","Guild beauty"}','{"nails","acrylic","gel"}','{"Portfolio proof","Hygiene standards","Booking reliability"}'),
  ('skin-glow-consultant','beauty','Hair, grooming, and glamour','Skin and Glow Consultant','artisan','creator','Esthetics, glow routines, skin prep, product curation, and camera-ready complexion planning.','Glow Consultation Suite','Consultations, routines, product notes, progress logs, and shoot prep recommendations.','{"Consultations","Routine plans","Progress logs","Shoot prep"}','{"skin","glow","esthetician"}','{"Credentials","Product notes","Client consent"}'),
  ('cordwainer-shoemaker','footwear','Footwear creators and customizers','Cordwainer and Shoemaker','artisan','creator','Handcrafted leather shoes, boots, traditional dress footwear, repairs, and custom lasts.','Footwear Atelier Suite','Foot measurements, custom quotes, leather sourcing, proof builds, and passports.','{"Foot measurements","Leather sourcing","Milestone proof","NFC passports"}','{"shoemaker","leather","cordwainer"}','{"Portfolio proof","Material proof","Fit policy"}'),
  ('sneaker-customizer','footwear','Footwear creators and customizers','Sneaker Customizer','artisan','creator','Painted, modified, reconstructed, and collectible sneakers as wearable art.','Sneaker Custom Suite','Base shoes, concept drafts, restoration steps, proof shots, auctions, and passports.','{"Remix briefs","Restoration proof","Auction drops","NFC passports"}','{"sneaker","custom","upcycle"}','{"Portfolio proof","Authenticity notes","Condition report"}'),
  ('luxury-sandal-crafter','footwear','Footwear creators and customizers','Luxury Sandal and Slipper Crafter','artisan','merchant','High-end leather slides, slippers, native sandals, decorated ceremony footwear, and fit-led orders.','Sandal Craft Suite','Sandal styles, outfit palettes, size management, and ceremony guild orders.','{"Size ranges","Custom straps","Guild footwear","Product catalog"}','{"sandals","slippers","native footwear"}','{"Portfolio proof","Material notes","Fit policy"}'),
  ('footwear-restoration-expert','footwear','Footwear creators and customizers','Footwear Restoration Expert','artisan','creator','Cleaning, repair, sole swaps, leather restoration, condition reports, and premium shoe revival.','Restoration Bench Suite','Before-after states, repair estimates, proof milestones, and premium authentication.','{"Condition report","Before-after proof","Repair quote","Passport update"}','{"restoration","cleaning","repair"}','{"Before proof","After proof","Condition honesty"}'),
  ('beadmaker-stringer','jewelry','Jewelry and wearable ornamentation','Beadmaker and Stringer','artisan','creator','Traditional glass beads, waist beads, wristbands, statement neckpieces, and custom ceremony strings.','Beadwork Suite','Bead lots, custom measurements, symbolism notes, order proofs, and ceremony bundles.','{"Bead inventory","Custom sizes","Symbolism notes","Guild add-ons"}','{"beads","waist beads","neckpiece"}','{"Material proof","Cultural notes","Portfolio proof"}'),
  ('goldsmith-silversmith','jewelry','Jewelry and wearable ornamentation','Goldsmith and Silversmith','artisan','creator','Precious metal rings, chains, emblems, traditional gold pieces, and luxury jewelry commissions.','Precious Metal Suite','Metal source, references, milestone proof, authenticity, and ownership records.','{"Material source","Commission proof","Authenticity","Passport history"}','{"goldsmith","silversmith","jewelry"}','{"Identity verification","Material documentation","Authenticity proof"}'),
  ('accessory-designer','jewelry','Jewelry and wearable ornamentation','Accessory Designer','designer','merchant','Brooches, watches, pocket squares, metal hardware, garment embellishments, and look-completing details.','Accessory Design Suite','Accessory design, garment palette matching, custom quotes, and guild products.','{"Palette matching","Custom quotes","Product catalog","Guild add-ons"}','{"brooch","hardware","pocket square"}','{"Portfolio proof","Material notes","Delivery record"}'),
  ('traditional-regalia-curator','jewelry','Jewelry and wearable ornamentation','Traditional Regalia Curator','seller','curator','Royal jewelry, crowns, ceremonial pieces, sourcing, preservation, and event-ready regalia packages.','Regalia Curation Suite','Ceremony pieces, authenticity, rentals, logistics, and cultural care instructions.','{"Regalia catalog","Authenticity","Rental tracking","Care instructions"}','{"regalia","crown","ceremony"}','{"Authenticity proof","Condition report","Transfer log"}'),
  ('fashion-stylist','media','Curators and visionaries','Fashion Stylist','designer','curator','Outfit curation for clients, shoots, weddings, campaigns, and multi-vendor fashion coordination.','Stylist Command Suite','Looks, maker matching, guild teams, locked moodboards, and style stories.','{"Outfit builder","Maker matching","Moodboard lock","Guild coordination"}','{"stylist","outfit","shoot"}','{"Portfolio proof","Credit history","Client reviews"}'),
  ('fashion-photographer','media','Curators and visionaries','Fashion Photographer','artisan','curator','Campaign images, product shoots, runway moments, portfolio visuals, and high-definition social content.','Photography Studio Suite','Shoot bookings, gallery delivery, portfolio media, and campaign coordination.','{"Shoot booking","Portfolio delivery","Campaign boards","Creator credits"}','{"photographer","campaign","editorial"}','{"Portfolio proof","Usage rights","Delivery history"}'),
  ('fashion-videographer','media','Curators and visionaries','Fashion Videographer','artisan','curator','Runway video, reels, process films, campaign motion, live event capture, and product storytelling.','Video Production Suite','Shot lists, reels, event streams, and videos for product and profile pages.','{"Shot lists","Reel delivery","Live event capture","Usage rights"}','{"videographer","reels","runway"}','{"Portfolio proof","Usage rights","Delivery history"}'),
  ('model','media','Curators and visionaries','Model','customer','curator','Portfolio building, fittings, collaborations, runway, campaign casting, and drape showcase.','Model Portfolio Suite','Measurements, comp cards, casting availability, collaborations, and portfolio drops.','{"Comp card","Measurements","Casting availability","Portfolio reels"}','{"model","portfolio","runway"}','{"Identity verification","Measurement consent","Credit history"}'),
  ('fashion-blogger-influencer','media','Curators and visionaries','Fashion Blogger or Influencer','customer','curator','Reviews, cultural commentary, trend discovery, creator promotion, and traffic-driving content.','Influencer Media Suite','Reviews, trend boards, maker discovery, live commentary, and creator tips.','{"Reviews","Trend boards","Live commentary","Creator tips"}','{"influencer","blogger","review"}','{"Disclosure notes","Audience trust","Review history"}'),
  ('bespoke-client','clients','Consumers and enthusiasts','Bespoke Client','customer','consumer','Commissioning custom looks, AI measurements, quotes, escrow approvals, fittings, wardrobe, and passports.','Client Wardrobe Suite','Inspiration, measurements, quotes, escrow milestones, fit-check, and garment passport ownership.','{"AI measurements","Quote approvals","Escrow milestones","Wardrobe","Passports"}','{"client","bespoke","wardrobe"}','{"Payment verification","Measurement consent","Order history"}'),
  ('trend-observer','clients','Consumers and enthusiasts','Trend Observer','customer','consumer','Lifestyle discovery, saving looks, sharing posts, tipping creators, bidding, and following fashion culture.','Trend Discovery Suite','Fashion graph, saved boards, creator tips, drops, lives, and inspiration-to-order flows.','{"Saved boards","Creator tips","Reels","Live rooms","Auctions"}','{"trend","observer","fashion lover"}','{"Community safety","Payment readiness","Saved preference history"}'),
  ('logistics-dispatch-partner','operations','Trust and infrastructure','Logistics and Dispatch Partner','seller','infrastructure','Transporting fabrics, delicate garments, ceremony pieces, proofs, returns, and premium handoffs.','Dispatch Operations Suite','Pickup, garment-safe handling, delivery proof, route chat, and milestone completion.','{"Pickup queue","Proof of delivery","Route chat","Milestone handoff"}','{"dispatch","delivery","logistics"}','{"Identity verification","Delivery proof","Handling standards"}'),
  ('authenticator-qa','operations','Trust and infrastructure','Authenticator and Quality Assurance Expert','admin','infrastructure','Authenticity, NFC passport verification, premium fabric checks, quality proof, and anti-counterfeit trust.','Trust and QA Suite','Passport verification, material proof, quality checks, authenticity records, and disputes.','{"NFC verification","Quality checklist","Counterfeit prevention","Dispute notes"}','{"authenticator","quality assurance","nfc"}','{"Expert verification","Audit trail","Conflict of interest control"}')
on conflict (id) do update
set
  group_key = excluded.group_key,
  group_label = excluded.group_label,
  title = excluded.title,
  broad_role = excluded.broad_role,
  audience = excluded.audience,
  description = excluded.description,
  suite_title = excluded.suite_title,
  suite_description = excluded.suite_description,
  capabilities = excluded.capabilities,
  marketplace_tags = excluded.marketplace_tags,
  trust_requirements = excluded.trust_requirements,
  updated_at = now();
