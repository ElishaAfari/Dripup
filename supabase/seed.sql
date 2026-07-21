insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  ('11111111-1111-4111-8111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ama@atelier.local', crypt('password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Ama Owusu"}', now(), now()),
  ('22222222-2222-4222-8222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'kofi@atelier.local', crypt('password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Kofi Mensah"}', now(), now()),
  ('33333333-3333-4333-8333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'esi@atelier.local', crypt('password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Esi Addo"}', now(), now()),
  ('44444444-4444-4444-8444-444444444444', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nadia@atelier.local', crypt('password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Nadia Boateng"}', now(), now()),
  ('55555555-5555-4555-8555-555555555555', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'kwame@atelier.local', crypt('password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Kwame Badu"}', now(), now()),
  ('66666666-6666-4666-8666-666666666666', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'afia@atelier.local', crypt('password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Afia Sarpong"}', now(), now()),
  ('77777777-7777-4777-8777-777777777777', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'selorm@atelier.local', crypt('password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Selorm Ankomah"}', now(), now()),
  ('88888888-8888-4888-8888-888888888888', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mansa@atelier.local', crypt('password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Mansa Darko"}', now(), now()),
  ('99999999-9999-4999-8999-999999999999', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nana@atelier.local', crypt('password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Nana Yeboah"}', now(), now()),
  ('aaaaaaaa-aaaa-4aaa-8aaa-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'theo@atelier.local', crypt('password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Theo Mensah"}', now(), now()),
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'yvonne@atelier.local', crypt('password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Yvonne Osei"}', now(), now())
on conflict (id) do nothing;

insert into auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
values
  ('11111111-1111-4111-9111-111111111111', '11111111-1111-4111-8111-111111111111', 'ama@atelier.local', '{"sub":"11111111-1111-4111-8111-111111111111","email":"ama@atelier.local"}', 'email', now(), now(), now()),
  ('22222222-2222-4222-9222-222222222222', '22222222-2222-4222-8222-222222222222', 'kofi@atelier.local', '{"sub":"22222222-2222-4222-8222-222222222222","email":"kofi@atelier.local"}', 'email', now(), now(), now()),
  ('33333333-3333-4333-9333-333333333333', '33333333-3333-4333-8333-333333333333', 'esi@atelier.local', '{"sub":"33333333-3333-4333-8333-333333333333","email":"esi@atelier.local"}', 'email', now(), now(), now()),
  ('44444444-4444-4444-9444-444444444444', '44444444-4444-4444-8444-444444444444', 'nadia@atelier.local', '{"sub":"44444444-4444-4444-8444-444444444444","email":"nadia@atelier.local"}', 'email', now(), now(), now()),
  ('55555555-5555-4555-9555-555555555555', '55555555-5555-4555-8555-555555555555', 'kwame@atelier.local', '{"sub":"55555555-5555-4555-8555-555555555555","email":"kwame@atelier.local"}', 'email', now(), now(), now()),
  ('66666666-6666-4666-9666-666666666666', '66666666-6666-4666-8666-666666666666', 'afia@atelier.local', '{"sub":"66666666-6666-4666-8666-666666666666","email":"afia@atelier.local"}', 'email', now(), now(), now()),
  ('77777777-7777-4777-9777-777777777777', '77777777-7777-4777-8777-777777777777', 'selorm@atelier.local', '{"sub":"77777777-7777-4777-8777-777777777777","email":"selorm@atelier.local"}', 'email', now(), now(), now()),
  ('88888888-8888-4888-9888-888888888888', '88888888-8888-4888-8888-888888888888', 'mansa@atelier.local', '{"sub":"88888888-8888-4888-8888-888888888888","email":"mansa@atelier.local"}', 'email', now(), now(), now()),
  ('99999999-9999-4999-9999-999999999999', '99999999-9999-4999-8999-999999999999', 'nana@atelier.local', '{"sub":"99999999-9999-4999-8999-999999999999","email":"nana@atelier.local"}', 'email', now(), now(), now()),
  ('aaaaaaaa-aaaa-4aaa-9aaa-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-000000000001', 'theo@atelier.local', '{"sub":"aaaaaaaa-aaaa-4aaa-8aaa-000000000001","email":"theo@atelier.local"}', 'email', now(), now(), now()),
  ('bbbbbbbb-bbbb-4bbb-9bbb-000000000001', 'bbbbbbbb-bbbb-4bbb-8bbb-000000000001', 'yvonne@atelier.local', '{"sub":"bbbbbbbb-bbbb-4bbb-8bbb-000000000001","email":"yvonne@atelier.local"}', 'email', now(), now(), now())
on conflict (provider, provider_id) do nothing;

insert into public.profiles (id, username, display_name, avatar_url, cover_url, bio, region, city, roles, professional_role_ids, primary_profession)
values
  ('11111111-1111-4111-8111-111111111111', 'ama.thread', 'Ama Owusu', 'avatars/ama.jpg', 'posts/atelier.jpg', 'Bespoke womenswear and sculptural corsetry.', 'Greater Accra', 'Accra', array['customer','artisan','designer']::public.app_role[], array['bespoke-tailor-seamstress','bridal-kente-couturier','fashion-designer'], 'bespoke-tailor-seamstress'),
  ('22222222-2222-4222-8222-222222222222', 'kofi.sole', 'Kofi Mensah', 'avatars/kofi.jpg', 'posts/sneakers.jpg', 'Sneaker restoration and custom wedding footwear.', 'Ashanti', 'Kumasi', array['customer','artisan','seller']::public.app_role[], array['cordwainer-shoemaker','sneaker-customizer','footwear-restoration-expert'], 'sneaker-customizer'),
  ('33333333-3333-4333-8333-333333333333', 'esi.looks', 'Esi Addo', 'avatars/esi.jpg', 'posts/makeup.jpg', 'Editorial makeup artist and bridal beauty lead.', 'Central', 'Cape Coast', array['customer','mua']::public.app_role[], array['makeup-artist','skin-glow-consultant'], 'makeup-artist'),
  ('44444444-4444-4444-8444-444444444444', 'nadia.fits', 'Nadia Boateng', 'avatars/nadia.jpg', 'posts/wardrobe.jpg', 'Collector of sharp tailoring and wearable drama.', 'Greater Accra', 'Tema', array['customer']::public.app_role[], array['bespoke-client','trend-observer'], 'bespoke-client'),
  ('55555555-5555-4555-8555-555555555555', 'kwame.kente', 'Kwame Badu', 'avatars/kwame.jpg', 'posts/textile.jpg', 'Kente weaving house producing custom strips and provenance-backed textile lots.', 'Ashanti', 'Bonwire', array['customer','artisan','seller']::public.app_role[], array['kente-weaver','textile-artisan','fabric-vendor'], 'kente-weaver'),
  ('66666666-6666-4666-8666-666666666666', 'afia.styles', 'Afia Sarpong', 'avatars/afia.jpg', 'posts/editorial.jpg', 'Stylist and creative director building campaign looks, wedding guilds, and trend reports.', 'Greater Accra', 'East Legon', array['customer','designer']::public.app_role[], array['fashion-stylist','creative-director','fashion-blogger-influencer'], 'fashion-stylist'),
  ('77777777-7777-4777-8777-777777777777', 'selorm.frame', 'Selorm Ankomah', 'avatars/selorm.jpg', 'posts/studio.jpg', 'Fashion photographer and videographer capturing campaign drops, fittings, and runway films.', 'Greater Accra', 'Labone', array['customer','artisan']::public.app_role[], array['fashion-photographer','fashion-videographer','model'], 'fashion-photographer'),
  ('88888888-8888-4888-8888-888888888888', 'mansa.crown', 'Mansa Darko', 'avatars/mansa.jpg', 'posts/hair.jpg', 'Braids, locs, lace-front construction, and raw hair sourcing for editorial and bridal clients.', 'Greater Accra', 'Madina', array['customer','artisan','seller']::public.app_role[], array['professional-braider','wig-architect','natural-hair-loctician','raw-hair-vendor'], 'professional-braider'),
  ('99999999-9999-4999-8999-999999999999', 'nana.gold', 'Nana Yeboah', 'avatars/nana.jpg', 'posts/jewelry.jpg', 'Goldsmith, bead stringer, and regalia curator for premium ceremony pieces and authenticated heirlooms.', 'Ashanti', 'Kumasi', array['customer','artisan','seller']::public.app_role[], array['goldsmith-silversmith','beadmaker-stringer','traditional-regalia-curator','accessory-designer'], 'goldsmith-silversmith'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-000000000001', 'theo.dispatch', 'Theo Mensah', 'avatars/theo.jpg', 'posts/logistics.jpg', 'Garment-safe dispatch for fabrics, fittings, proofs, returns, and ceremony delivery windows.', 'Greater Accra', 'Tema', array['customer','seller']::public.app_role[], array['logistics-dispatch-partner'], 'logistics-dispatch-partner'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000001', 'yvonne.authlab', 'Yvonne Osei', 'avatars/yvonne.jpg', 'posts/passport.jpg', 'Authenticator and QA expert verifying premium textiles, designer pieces, NFC passports, and milestone disputes.', 'Greater Accra', 'Airport City', array['customer','admin']::public.app_role[], array['authenticator-qa'], 'authenticator-qa')
on conflict (id) do nothing;

insert into public.profile_professional_roles (profile_id, role_id, is_primary, visibility)
select
  p.id,
  role_id,
  role_id = p.primary_profession,
  'public'
from public.profiles p
cross join unnest(p.professional_role_ids) as role_id
where p.deleted_at is null
on conflict (profile_id, role_id) do update
set is_primary = excluded.is_primary,
    visibility = excluded.visibility,
    updated_at = now();

insert into public.vendor_profiles (id, profile_id, studio_name, specialties, services, role_tags, suite_key, location_region, location_city, price_min, price_max, rating, review_count, verified)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'Ama Thread House', array['Bespoke gowns','Corsetry','Kente accents'], array['Request a quote','Guild order lead','Fit-check alterations'], array['bespoke-tailor-seamstress','bridal-kente-couturier','fashion-designer'], 'apparel', 'Greater Accra', 'Accra', 850, 6500, 4.9, 217, true),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '22222222-2222-4222-8222-222222222222', 'Sole Lab Kumasi', array['Sneaker remake','Leather soles','NFC passports'], array['Custom pair','Repair','Guild footwear'], array['cordwainer-shoemaker','sneaker-customizer','footwear-restoration-expert'], 'footwear', 'Ashanti', 'Kumasi', 350, 2800, 4.8, 143, true),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', '33333333-3333-4333-8333-333333333333', 'Esi Looks Studio', array['Bridal MUA','Editorial glam','Skin prep'], array['Event booking','Guild beauty','Live demos'], array['makeup-artist','skin-glow-consultant'], 'beauty', 'Central', 'Cape Coast', 500, 3200, 4.7, 89, true),
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', '55555555-5555-4555-8555-555555555555', 'Bonwire Provenance Looms', array['Handwoven kente','Ceremony panels','Material passports'], array['Custom weave order','Fabric lots','Authenticity notes'], array['kente-weaver','textile-artisan','fabric-vendor'], 'textiles', 'Ashanti', 'Bonwire', 280, 4900, 4.9, 168, true),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', '66666666-6666-4666-8666-666666666666', 'Afia Style Bureau', array['Wedding styling','Campaign direction','Moodboard curation'], array['Style brief','Guild coordination','Trend report'], array['fashion-stylist','creative-director','fashion-blogger-influencer'], 'media', 'Greater Accra', 'East Legon', 700, 8500, 4.8, 121, true),
  ('ffffffff-ffff-4fff-8fff-ffffffffffff', '77777777-7777-4777-8777-777777777777', 'Selorm Frame House', array['Campaign shoots','Runway reels','Portfolio film'], array['Book shoot','Live event capture','Product content'], array['fashion-photographer','fashion-videographer','model'], 'media', 'Greater Accra', 'Labone', 600, 7200, 4.7, 96, true),
  ('12121212-1212-4212-8212-121212121212', '88888888-8888-4888-8888-888888888888', 'Mansa Crown Hair', array['Knotless braids','Custom lace wigs','Loc maintenance'], array['Book appointment','Source bundles','Guild beauty'], array['professional-braider','wig-architect','natural-hair-loctician','raw-hair-vendor'], 'beauty', 'Greater Accra', 'Madina', 220, 4600, 4.8, 134, true),
  ('13131313-1313-4313-8313-131313131313', '99999999-9999-4999-8999-999999999999', 'Nana Gold and Beads', array['Gold emblems','Waist beads','Regalia curation'], array['Commission piece','Regalia sourcing','Passport verification'], array['goldsmith-silversmith','beadmaker-stringer','traditional-regalia-curator','accessory-designer'], 'jewelry', 'Ashanti', 'Kumasi', 400, 22000, 4.9, 77, true),
  ('14141414-1414-4414-8414-141414141414', 'aaaaaaaa-aaaa-4aaa-8aaa-000000000001', 'Theo Garment Dispatch', array['Garment-safe delivery','Fabric pickups','Proof-of-delivery'], array['Schedule dispatch','Return pickup','Guild route'], array['logistics-dispatch-partner'], 'operations', 'Greater Accra', 'Tema', 45, 850, 4.6, 62, true)
on conflict (id) do nothing;

insert into public.posts (id, author_id, caption, like_count, comment_count, save_count)
values
  ('10000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'Final fitting: off-shoulder column gown with hand-beaded kente flashes.', 1208, 94, 311),
  ('10000000-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', 'Rebuilt heel, dyed panels, and tagged the garment passport.', 768, 55, 144),
  ('10000000-0000-4000-8000-000000000003', '33333333-3333-4333-8333-333333333333', 'Soft matte skin, copper lids, and a veil-ready finish.', 982, 66, 205),
  ('10000000-0000-4000-8000-000000000004', '55555555-5555-4555-8555-555555555555', 'New kente strip batch finished with provenance notes for bridal couturiers and fabric vendors.', 1120, 73, 260),
  ('10000000-0000-4000-8000-000000000005', '66666666-6666-4666-8666-666666666666', 'Styling board locked for a three-vendor ceremony guild: couturier, MUA, jeweler.', 1540, 88, 421),
  ('10000000-0000-4000-8000-000000000006', '88888888-8888-4888-8888-888888888888', 'Knotless braid map, raw hair bundle proof, and install care notes ready for the client.', 903, 49, 189)
on conflict (id) do nothing;

insert into public.post_media (post_id, bucket, path, media_type, alt, sort_order)
values
  ('10000000-0000-4000-8000-000000000001', 'posts', 'gown.jpg', 'image', 'Editorial gown fitting', 0),
  ('10000000-0000-4000-8000-000000000002', 'posts', 'sneakers.jpg', 'image', 'Restored sneakers', 0),
  ('10000000-0000-4000-8000-000000000003', 'posts', 'makeup.jpg', 'image', 'Makeup palette', 0),
  ('10000000-0000-4000-8000-000000000004', 'posts', 'textile.jpg', 'image', 'Handwoven textile batch', 0),
  ('10000000-0000-4000-8000-000000000005', 'posts', 'editorial.jpg', 'image', 'Editorial styling board', 0),
  ('10000000-0000-4000-8000-000000000006', 'posts', 'hair.jpg', 'image', 'Hair styling workstation', 0);

insert into public.reels (id, author_id, video_path, poster_path, caption, sound, like_count, comment_count, share_count)
values
  ('11000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'reels/draping.mp4', 'posts/atelier.jpg', 'Draping a neckline from sketch to muslin.', 'Studio shears, take 04', 24800, 1180, 640),
  ('11000000-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', 'reels/sole-swap.mp4', 'posts/sneakers.jpg', 'A sole swap in 38 seconds.', 'Rubber press rhythm', 13600, 420, 312)
on conflict (id) do nothing;

insert into public.stories (id, author_id, media_path, media_type, title, expires_at)
values
  ('12000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'posts/fabric.jpg', 'image', 'Fabric run', now() + interval '24 hours'),
  ('12000000-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', 'posts/sneakers.jpg', 'image', 'Sole dye', now() + interval '24 hours'),
  ('12000000-0000-4000-8000-000000000003', '33333333-3333-4333-8333-333333333333', 'posts/makeup.jpg', 'image', 'Skin prep', now() + interval '24 hours'),
  ('12000000-0000-4000-8000-000000000004', '44444444-4444-4444-8444-444444444444', 'posts/wardrobe.jpg', 'image', 'Final pinning', now() + interval '24 hours')
on conflict (id) do nothing;

insert into public.follows (follower_id, following_id)
values
  ('44444444-4444-4444-8444-444444444444', '11111111-1111-4111-8111-111111111111'),
  ('44444444-4444-4444-8444-444444444444', '22222222-2222-4222-8222-222222222222'),
  ('11111111-1111-4111-8111-111111111111', '44444444-4444-4444-8444-444444444444')
on conflict (follower_id, following_id) do nothing;

insert into public.conversations (id, created_by, title, is_group, last_message_at)
values ('80000000-0000-4000-8000-000000000001', '44444444-4444-4444-8444-444444444444', 'Nadia wedding guild', true, now())
on conflict (id) do nothing;

insert into public.conversation_members (conversation_id, profile_id, last_read_at)
values
  ('80000000-0000-4000-8000-000000000001', '44444444-4444-4444-8444-444444444444', now()),
  ('80000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', now()),
  ('80000000-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', now()),
  ('80000000-0000-4000-8000-000000000001', '33333333-3333-4333-8333-333333333333', now())
on conflict (conversation_id, profile_id) do nothing;

insert into public.messages (id, conversation_id, sender_id, body, attachment_path, read_at)
values
  ('81000000-0000-4000-8000-000000000001', '80000000-0000-4000-8000-000000000001', '44444444-4444-4444-8444-444444444444', 'Can we lock the silhouette from the matched moodboard and add gold sandals?', null, now()),
  ('81000000-0000-4000-8000-000000000002', '80000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'Yes. I attached the combined quote card with tailor, MUA, and shoemaker splits.', 'designs/nadia-kente-gown.png', now())
on conflict (id) do nothing;

insert into public.live_streams (id, host_id, title, rtc_provider, rtc_room, status, shopping_pins, started_at)
values (
  '82000000-0000-4000-8000-000000000001',
  '11111111-1111-4111-8111-111111111111',
  'Ama Thread House live fitting',
  'mock',
  'ama-live-shopping',
  'live',
  '[{"type":"auction","id":"60000000-0000-4000-8000-000000000001","label":"Emerald midi"}]',
  now()
)
on conflict (id) do nothing;

insert into public.measurements (
  id, user_id, owner_label, version, scale_reference, raw_keypoints, derived_fields,
  height_cm, chest_cm, waist_cm, hips_cm, shoulder_cm, inseam_cm, sleeve_cm, confidence
)
values (
  '20000000-0000-4000-8000-000000000001',
  '44444444-4444-4444-8444-444444444444',
  'Nadia',
  3,
  'bank_card',
  '{"front":[{"name":"left_shoulder","x":0.42,"y":0.21,"score":0.96}],"side":[]}',
  '{"fit_model":"movenet_mock"}',
  170, 91, 72, 101, 41, 78, 58, 0.92
)
on conflict (id) do nothing;

insert into public.fabric_catalog (id, vendor_id, name, origin, price_per_yard, tags, stock_yards)
values
  ('30000000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Handwoven kente panel', 'Bonwire', 420, array['heritage','structured'], 28),
  ('30000000-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Italian crepe satin', 'Milan', 260, array['drape','evening'], 45),
  ('30000000-0000-4000-8000-000000000003', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Organic cotton drill', 'Tamale', 95, array['upcycle','daywear'], 64)
on conflict (id) do nothing;

insert into public.designs (id, user_id, prompt, image_path, provider, status, broadcast_at)
values (
  '40000000-0000-4000-8000-000000000001',
  '44444444-4444-4444-8444-444444444444',
  'Flowing kente-accented evening gown, off-shoulder neckline, matte gold beadwork.',
  'designs/nadia-kente-gown.png',
  'mock',
  'broadcast',
  now()
)
on conflict (id) do nothing;

insert into public.remixes (id, user_id, source_path, output_path, prompt, sustainability_note, status)
values (
  '41000000-0000-4000-8000-000000000001',
  '44444444-4444-4444-8444-444444444444',
  'posts/wardrobe.jpg',
  'remixes/corset-wrap.png',
  'Turn this oversized shirt into a corset wrap top.',
  'Keeps most of the original cotton in circulation.',
  'draft'
)
on conflict (id) do nothing;

insert into public.products (id, seller_id, title, description, price, currency, image_path, size_range, inventory, active)
values (
  '42000000-0000-4000-8000-000000000001',
  '11111111-1111-4111-8111-111111111111',
  'Emerald sculpted midi dress',
  'Ready-to-bid smart-sized dress with NFC-ready passport.',
  2650,
  'GHS',
  'posts/gown.jpg',
  '{"chest":[88,96],"waist":[68,76],"hips":[96,106]}',
  1,
  true
)
on conflict (id) do nothing;

insert into public.guild_orders (id, client_id, title, status, total_amount, approved_at)
values ('50000000-0000-4000-8000-000000000001', '44444444-4444-4444-8444-444444444444', 'Nadia engagement look', 'approved', 7420, now())
on conflict (id) do nothing;

insert into public.orders (id, buyer_id, vendor_id, guild_order_id, status, subtotal, currency, payment_provider, provider_reference)
values (
  '51000000-0000-4000-8000-000000000001',
  '44444444-4444-4444-8444-444444444444',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '50000000-0000-4000-8000-000000000001',
  'approved',
  7420,
  'GHS',
  'paystack',
  'seed_paystack_ref'
)
on conflict (id) do nothing;

insert into public.order_items (id, order_id, product_id, vendor_id, description, quantity, unit_price, metadata)
values
  ('51100000-0000-4000-8000-000000000001', '51000000-0000-4000-8000-000000000001', null, 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Tailor lead gown build', 1, 5200, '{"guild_role":"tailor"}'),
  ('51100000-0000-4000-8000-000000000002', '51000000-0000-4000-8000-000000000001', null, 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Custom gold sandals', 1, 1420, '{"guild_role":"shoemaker"}'),
  ('51100000-0000-4000-8000-000000000003', '51000000-0000-4000-8000-000000000001', null, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Bridal MUA session', 1, 800, '{"guild_role":"mua"}')
on conflict (id) do nothing;

insert into public.guild_participants (guild_order_id, vendor_id, profile_id, role_label, quote_amount, payout_percentage, status)
values
  ('50000000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'Tailor lead', 5200, 70.08, 'accepted'),
  ('50000000-0000-4000-8000-000000000001', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '22222222-2222-4222-8222-222222222222', 'Shoemaker', 1420, 19.14, 'accepted'),
  ('50000000-0000-4000-8000-000000000001', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', '33333333-3333-4333-8333-333333333333', 'MUA', 800, 10.78, 'accepted');

insert into public.milestones (id, order_id, guild_order_id, label, amount, status, proof_path, client_approved_at, artisan_approved_at)
values
  ('52000000-0000-4000-8000-000000000001', '51000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', 'Deposit', 1800, 'released', null, now(), now()),
  ('52000000-0000-4000-8000-000000000002', '51000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', 'Fabric sourced', 1250, 'approved', 'proofs/fabric-sourced.jpg', now(), now()),
  ('52000000-0000-4000-8000-000000000003', '51000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', 'Cutting', 900, 'pending', null, null, null)
on conflict (id) do nothing;

insert into public.escrow_ledger (id, order_id, guild_order_id, milestone_id, profile_id, provider, provider_reference, entry_type, amount, currency, status, metadata)
values
  ('53000000-0000-4000-8000-000000000001', '51000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', '52000000-0000-4000-8000-000000000001', '44444444-4444-4444-8444-444444444444', 'paystack', 'seed_capture', 'capture', 7420, 'GHS', 'captured', '{"note":"seed escrow ledger"}'),
  ('53000000-0000-4000-8000-000000000002', '51000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', '52000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'paystack', 'seed_release_deposit', 'release', 1800, 'GHS', 'released', '{"note":"seed milestone release"}')
on conflict (id) do nothing;

insert into public.auctions (id, seller_id, title, image_path, size_range, current_bid, bid_count, ends_at, status)
values (
  '60000000-0000-4000-8000-000000000001',
  '11111111-1111-4111-8111-111111111111',
  'Emerald sculpted midi dress',
  'posts/gown.jpg',
  '{"chest":[88,96],"waist":[68,76],"hips":[96,106]}',
  2650,
  31,
  now() + interval '1 day',
  'live'
)
on conflict (id) do nothing;

insert into public.bids (id, auction_id, bidder_id, amount, accepted)
values
  ('61000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 2400, true),
  ('61000000-0000-4000-8000-000000000002', '60000000-0000-4000-8000-000000000001', '44444444-4444-4444-8444-444444444444', 2650, true)
on conflict (id) do nothing;

insert into public.cost_estimates (id, user_id, fabric_id, design_id, measurement_id, garment_type, yardage, trims_amount, labour_amount, total_amount, breakdown)
values (
  '62000000-0000-4000-8000-000000000001',
  '44444444-4444-4444-8444-444444444444',
  '30000000-0000-4000-8000-000000000001',
  '40000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  'Off-shoulder evening gown',
  5.5,
  380,
  1800,
  4490,
  '{"rules":"seed estimate"}'
)
on conflict (id) do nothing;

insert into public.garments (id, owner_id, maker_id, passport_id, name, image_path, materials, care_instructions, ownership_history)
values (
  '70000000-0000-4000-8000-000000000001',
  '44444444-4444-4444-8444-444444444444',
  '11111111-1111-4111-8111-111111111111',
  '7a8ef9f2-2c60-4f02-8d43-f1d8a79f18d6',
  'Kente flash column gown',
  'passports/kente-flash-column.jpg',
  array['Crepe satin','Handwoven kente','Glass beadwork'],
  'Dry clean only. Store with padded hanger and breathable garment bag.',
  '[{"owner":"Nadia Boateng","acquired_at":"2026-06-12"}]'
)
on conflict (id) do nothing;

insert into public.moodboards (id, client_id, artisan_id, order_id, title)
values ('90000000-0000-4000-8000-000000000001', '44444444-4444-4444-8444-444444444444', '11111111-1111-4111-8111-111111111111', '51000000-0000-4000-8000-000000000001', 'Copper evening romance')
on conflict (id) do nothing;

insert into public.moodboard_cards (id, moodboard_id, image_path, title, tags, matched)
values
  ('91000000-0000-4000-8000-000000000001', '90000000-0000-4000-8000-000000000001', 'posts/gown.jpg', 'Column line', array['clean','formal'], true),
  ('91000000-0000-4000-8000-000000000002', '90000000-0000-4000-8000-000000000001', 'posts/fabric.jpg', 'Textile story', array['texture','warm'], false),
  ('91000000-0000-4000-8000-000000000003', '90000000-0000-4000-8000-000000000001', 'posts/kente.jpg', 'Kente flash', array['heritage','accent'], true)
on conflict (id) do nothing;

insert into public.moodboard_swipes (card_id, user_id, value)
values
  ('91000000-0000-4000-8000-000000000001', '44444444-4444-4444-8444-444444444444', 'right'),
  ('91000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'right'),
  ('91000000-0000-4000-8000-000000000002', '44444444-4444-4444-8444-444444444444', 'left')
on conflict (card_id, user_id) do nothing;

insert into public.reviews (id, reviewer_id, reviewee_id, order_id, rating, body)
values ('92000000-0000-4000-8000-000000000001', '44444444-4444-4444-8444-444444444444', '11111111-1111-4111-8111-111111111111', '51000000-0000-4000-8000-000000000001', 5, 'Precise fitting and beautiful communication.')
on conflict (id) do nothing;

insert into public.notifications (id, profile_id, actor_id, kind, title, body, metadata)
values
  ('93000000-0000-4000-8000-000000000001', '44444444-4444-4444-8444-444444444444', '11111111-1111-4111-8111-111111111111', 'milestone', 'Milestone proof uploaded', 'Ama added fabric sourcing proof for your guild order.', '{"guild_order_id":"50000000-0000-4000-8000-000000000001"}'),
  ('93000000-0000-4000-8000-000000000002', '44444444-4444-4444-8444-444444444444', '11111111-1111-4111-8111-111111111111', 'bid', 'Bid accepted', 'Your smart-sized bid on the emerald midi is now leading.', '{"auction_id":"60000000-0000-4000-8000-000000000001"}')
on conflict (id) do nothing;

insert into public.embeddings (id, owner_table, owner_id, content, embedding, metadata)
values
  ('94000000-0000-4000-8000-000000000001', 'vendor_profiles', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Bespoke gowns corsetry kente accents Accra', array_fill(0.01::real, array[1536])::vector, '{"seed":true}'),
  ('94000000-0000-4000-8000-000000000002', 'vendor_profiles', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Sneaker remake leather soles Kumasi', array_fill(0.02::real, array[1536])::vector, '{"seed":true}'),
  ('94000000-0000-4000-8000-000000000003', 'vendor_profiles', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Bridal makeup editorial glam Cape Coast', array_fill(0.03::real, array[1536])::vector, '{"seed":true}')
on conflict (id) do nothing;
