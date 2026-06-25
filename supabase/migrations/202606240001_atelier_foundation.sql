create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;
create extension if not exists vector;

create type public.app_role as enum ('customer', 'artisan', 'designer', 'mua', 'seller', 'admin');
create type public.media_type as enum ('image', 'video');
create type public.vendor_availability as enum ('available', 'limited', 'offline');
create type public.order_status as enum ('draft', 'quoted', 'approved', 'in_progress', 'delivered', 'cancelled', 'disputed');
create type public.milestone_status as enum ('pending', 'approved', 'released', 'disputed');
create type public.escrow_entry_type as enum ('capture', 'hold', 'release', 'refund', 'fee');
create type public.payment_provider as enum ('paystack', 'mtn_momo', 'stripe');
create type public.auction_status as enum ('draft', 'live', 'ended', 'settled', 'cancelled');
create type public.swipe_value as enum ('left', 'right');
create type public.notification_kind as enum ('follow', 'bid', 'milestone', 'guild', 'message');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.has_role(required_role public.app_role)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and required_role = any(roles)
      and deleted_at is null
  );
end;
$$;

create or replace function public.is_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return public.has_role('admin');
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text not null,
  avatar_url text,
  cover_url text,
  bio text default '',
  region text default 'Greater Accra',
  city text default 'Accra',
  roles public.app_role[] not null default array['customer']::public.app_role[],
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.vendor_profiles (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  studio_name text not null,
  specialties text[] not null default '{}',
  portfolio jsonb not null default '[]',
  services text[] not null default '{}',
  location_region text not null default 'Greater Accra',
  location_city text not null default 'Accra',
  price_min numeric(12,2) default 0,
  price_max numeric(12,2) default 0,
  rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  verified boolean not null default false,
  availability public.vendor_availability not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.follows (
  id uuid primary key default uuid_generate_v4(),
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (follower_id, following_id)
);

create table public.posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  caption text not null default '',
  visibility text not null default 'public',
  like_count integer not null default 0,
  comment_count integer not null default 0,
  save_count integer not null default 0,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.post_media (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references public.posts(id) on delete cascade,
  bucket text not null default 'posts',
  path text not null,
  media_type public.media_type not null,
  alt text not null default '',
  width integer,
  height integer,
  duration_seconds numeric(8,2),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.reels (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  video_path text not null,
  poster_path text,
  caption text not null default '',
  sound text,
  like_count integer not null default 0,
  comment_count integer not null default 0,
  share_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.stories (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  media_path text not null,
  media_type public.media_type not null default 'image',
  title text not null default '',
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.likes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  target_table text not null,
  target_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (user_id, target_table, target_id)
);

create table public.comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references public.posts(id) on delete cascade,
  reel_id uuid references public.reels(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (post_id is not null or reel_id is not null)
);

create table public.saves (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  target_table text not null,
  target_id uuid not null,
  board_name text not null default 'Saved',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (user_id, target_table, target_id, board_name)
);

create table public.hashtags (
  id uuid primary key default uuid_generate_v4(),
  tag text not null unique,
  usage_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  created_by uuid not null references public.profiles(id) on delete cascade,
  title text,
  is_group boolean not null default false,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.conversation_members (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  last_read_at timestamptz,
  muted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (conversation_id, profile_id)
);

create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text,
  attachment_path text,
  order_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.live_streams (
  id uuid primary key default uuid_generate_v4(),
  host_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  rtc_provider text not null default 'mock',
  rtc_room text not null,
  status text not null default 'scheduled',
  shopping_pins jsonb not null default '[]',
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.stream_viewers (
  id uuid primary key default uuid_generate_v4(),
  stream_id uuid not null references public.live_streams(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  presence_ref text not null,
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.measurements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  owner_label text not null default 'Self',
  version integer not null default 1,
  scale_reference text not null,
  raw_keypoints jsonb not null default '{}',
  derived_fields jsonb not null default '{}',
  height_cm numeric(6,2),
  chest_cm numeric(6,2),
  waist_cm numeric(6,2),
  hips_cm numeric(6,2),
  shoulder_cm numeric(6,2),
  inseam_cm numeric(6,2),
  sleeve_cm numeric(6,2),
  confidence numeric(4,3) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (user_id, owner_label, version)
);

create table public.garments (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  maker_id uuid references public.profiles(id) on delete set null,
  passport_id uuid not null default uuid_generate_v4() unique,
  name text not null,
  image_path text,
  materials text[] not null default '{}',
  care_instructions text not null default '',
  ownership_history jsonb not null default '[]',
  transfer_pending_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.designs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  prompt text not null,
  image_path text,
  provider text not null default 'mock',
  status text not null default 'draft',
  broadcast_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.remixes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source_path text not null,
  output_path text,
  prompt text not null,
  sustainability_note text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.moodboards (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  artisan_id uuid references public.profiles(id) on delete set null,
  order_id uuid,
  title text not null,
  locked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.moodboard_cards (
  id uuid primary key default uuid_generate_v4(),
  moodboard_id uuid not null references public.moodboards(id) on delete cascade,
  image_path text not null,
  title text not null,
  tags text[] not null default '{}',
  embedding_id uuid,
  matched boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.moodboard_swipes (
  id uuid primary key default uuid_generate_v4(),
  card_id uuid not null references public.moodboard_cards(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  value public.swipe_value not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (card_id, user_id)
);

create table public.products (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null default '',
  price numeric(12,2) not null,
  currency text not null default 'GHS',
  image_path text,
  size_range jsonb not null default '{}',
  inventory integer not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.guild_orders (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  status public.order_status not null default 'draft',
  total_amount numeric(12,2) not null default 0,
  currency text not null default 'GHS',
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  vendor_id uuid references public.vendor_profiles(id) on delete set null,
  guild_order_id uuid references public.guild_orders(id) on delete set null,
  status public.order_status not null default 'draft',
  subtotal numeric(12,2) not null default 0,
  currency text not null default 'GHS',
  payment_provider public.payment_provider,
  provider_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  vendor_id uuid references public.vendor_profiles(id) on delete set null,
  description text not null,
  quantity integer not null default 1,
  unit_price numeric(12,2) not null default 0,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.guild_participants (
  id uuid primary key default uuid_generate_v4(),
  guild_order_id uuid not null references public.guild_orders(id) on delete cascade,
  vendor_id uuid references public.vendor_profiles(id) on delete set null,
  profile_id uuid references public.profiles(id) on delete set null,
  role_label text not null,
  quote_amount numeric(12,2) not null default 0,
  payout_percentage numeric(5,2) not null default 0,
  status text not null default 'invited',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.milestones (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  guild_order_id uuid references public.guild_orders(id) on delete cascade,
  participant_id uuid references public.guild_participants(id) on delete set null,
  label text not null,
  amount numeric(12,2) not null default 0,
  status public.milestone_status not null default 'pending',
  proof_path text,
  client_approved_at timestamptz,
  artisan_approved_at timestamptz,
  release_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (order_id is not null or guild_order_id is not null)
);

create table public.escrow_ledger (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  guild_order_id uuid references public.guild_orders(id) on delete cascade,
  milestone_id uuid references public.milestones(id) on delete set null,
  profile_id uuid references public.profiles(id) on delete set null,
  provider public.payment_provider not null,
  provider_reference text,
  entry_type public.escrow_entry_type not null,
  amount numeric(12,2) not null,
  currency text not null default 'GHS',
  status text not null default 'pending',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.auctions (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  title text not null,
  image_path text,
  size_range jsonb not null,
  current_bid numeric(12,2) not null default 0,
  bid_count integer not null default 0,
  ends_at timestamptz not null,
  anti_snipe_seconds integer not null default 120,
  status public.auction_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.bids (
  id uuid primary key default uuid_generate_v4(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  bidder_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(12,2) not null,
  accepted boolean not null default false,
  reject_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.fabric_catalog (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid references public.vendor_profiles(id) on delete set null,
  name text not null,
  origin text,
  price_per_yard numeric(12,2) not null,
  tags text[] not null default '{}',
  stock_yards numeric(10,2) not null default 0,
  image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.cost_estimates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  fabric_id uuid references public.fabric_catalog(id) on delete set null,
  design_id uuid references public.designs(id) on delete set null,
  measurement_id uuid references public.measurements(id) on delete set null,
  garment_type text not null,
  yardage numeric(8,2) not null,
  trims_amount numeric(12,2) not null default 0,
  labour_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  breakdown jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewee_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  kind public.notification_kind not null,
  title text not null,
  body text not null default '',
  read_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.embeddings (
  id uuid primary key default uuid_generate_v4(),
  owner_table text not null,
  owner_id uuid not null,
  content text not null,
  embedding vector(1536) not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index profiles_roles_idx on public.profiles using gin (roles);
create index vendor_profiles_profile_idx on public.vendor_profiles(profile_id);
create index posts_author_created_idx on public.posts(author_id, created_at desc);
create index post_media_post_idx on public.post_media(post_id, sort_order);
create index reels_author_created_idx on public.reels(author_id, created_at desc);
create index stories_author_expires_idx on public.stories(author_id, expires_at);
create index comments_post_idx on public.comments(post_id, created_at);
create index messages_conversation_created_idx on public.messages(conversation_id, created_at);
create index measurements_user_version_idx on public.measurements(user_id, owner_label, version desc);
create index garments_passport_idx on public.garments(passport_id);
create index auctions_status_ends_idx on public.auctions(status, ends_at);
create index bids_auction_amount_idx on public.bids(auction_id, amount desc);
create index notifications_profile_read_idx on public.notifications(profile_id, read_at, created_at desc);
create index embeddings_vector_idx on public.embeddings using ivfflat (embedding vector_cosine_ops) with (lists = 100);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'vendor_profiles', 'follows', 'posts', 'post_media', 'reels', 'stories',
    'likes', 'comments', 'saves', 'hashtags', 'messages', 'conversations',
    'conversation_members', 'live_streams', 'stream_viewers', 'measurements',
    'garments', 'designs', 'remixes', 'moodboards', 'moodboard_cards',
    'moodboard_swipes', 'products', 'orders', 'order_items', 'guild_orders',
    'guild_participants', 'milestones', 'escrow_ledger', 'auctions', 'bids',
    'fabric_catalog', 'cost_estimates', 'reviews', 'notifications', 'embeddings'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
    if table_name = any(array[
      'profiles', 'vendor_profiles', 'follows', 'posts', 'post_media', 'reels', 'stories',
      'likes', 'comments', 'saves', 'hashtags', 'live_streams', 'stream_viewers',
      'products', 'auctions', 'bids', 'fabric_catalog', 'reviews'
    ]) then
      execute format('create policy %L on public.%I for select to authenticated using (deleted_at is null)', table_name || ' authenticated read', table_name);
    end if;
    execute format('create policy %L on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', table_name || ' admin manage', table_name);
  end loop;
end;
$$;

create policy "profiles insert own" on public.profiles
for insert to authenticated
with check (id = auth.uid());

create policy "profiles update own" on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "vendor manage own profile" on public.vendor_profiles
for all to authenticated
using (profile_id = auth.uid() and (public.has_role('artisan') or public.has_role('designer') or public.has_role('mua') or public.has_role('seller')))
with check (profile_id = auth.uid() and (public.has_role('artisan') or public.has_role('designer') or public.has_role('mua') or public.has_role('seller')));

create policy "social content owner insert" on public.posts
for insert to authenticated
with check (author_id = auth.uid());

create policy "social content owner update" on public.posts
for update to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

create policy "reels owner insert" on public.reels
for insert to authenticated
with check (author_id = auth.uid());

create policy "stories owner insert" on public.stories
for insert to authenticated
with check (author_id = auth.uid());

create policy "likes self manage" on public.likes
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "comments self manage" on public.comments
for all to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

create policy "saves self manage" on public.saves
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "conversation member read" on public.conversations
for select to authenticated
using (
  exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = id
      and cm.profile_id = auth.uid()
      and cm.deleted_at is null
  )
);

create policy "conversation member self read" on public.conversation_members
for select to authenticated
using (
  profile_id = auth.uid()
  or exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = public.conversation_members.conversation_id
      and cm.profile_id = auth.uid()
      and cm.deleted_at is null
  )
);

create policy "conversation creator insert" on public.conversations
for insert to authenticated
with check (created_by = auth.uid());

create policy "conversation member insert own" on public.conversation_members
for insert to authenticated
with check (
  profile_id = auth.uid()
  or exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and c.created_by = auth.uid()
      and c.deleted_at is null
  )
);

create policy "messages member read" on public.messages
for select to authenticated
using (
  exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = public.messages.conversation_id
      and cm.profile_id = auth.uid()
      and cm.deleted_at is null
  )
);

create policy "messages member insert" on public.messages
for insert to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = public.messages.conversation_id
      and cm.profile_id = auth.uid()
      and cm.deleted_at is null
  )
);

create policy "measurements owner manage" on public.measurements
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "garments owner maker manage" on public.garments
for all to authenticated
using (owner_id = auth.uid() or maker_id = auth.uid())
with check (owner_id = auth.uid() or maker_id = auth.uid());

create policy "designs owner manage" on public.designs
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "remixes owner manage" on public.remixes
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "moodboard participant manage" on public.moodboards
for all to authenticated
using (client_id = auth.uid() or artisan_id = auth.uid())
with check (client_id = auth.uid() or artisan_id = auth.uid());

create policy "moodboard cards participant read" on public.moodboard_cards
for select to authenticated
using (
  exists (
    select 1 from public.moodboards m
    where m.id = public.moodboard_cards.moodboard_id
      and (m.client_id = auth.uid() or m.artisan_id = auth.uid())
      and m.deleted_at is null
  )
);

create policy "moodboard cards participant write" on public.moodboard_cards
for insert to authenticated
with check (
  exists (
    select 1 from public.moodboards m
    where m.id = public.moodboard_cards.moodboard_id
      and (m.client_id = auth.uid() or m.artisan_id = auth.uid())
      and m.deleted_at is null
  )
);

create policy "moodboard swipes self manage" on public.moodboard_swipes
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "products seller manage" on public.products
for all to authenticated
using (seller_id = auth.uid() and (public.has_role('seller') or public.has_role('artisan') or public.has_role('designer')))
with check (seller_id = auth.uid() and (public.has_role('seller') or public.has_role('artisan') or public.has_role('designer')));

create policy "orders buyer read manage" on public.orders
for all to authenticated
using (buyer_id = auth.uid() or public.is_admin())
with check (buyer_id = auth.uid() or public.is_admin());

create policy "orders vendor participant read" on public.orders
for select to authenticated
using (
  vendor_id in (select id from public.vendor_profiles where profile_id = auth.uid())
  or exists (
    select 1
    from public.guild_participants gp
    where gp.guild_order_id = public.orders.guild_order_id
      and (
        gp.profile_id = auth.uid()
        or gp.vendor_id in (select id from public.vendor_profiles where profile_id = auth.uid())
      )
      and gp.deleted_at is null
  )
);

create policy "order items participant read" on public.order_items
for select to authenticated
using (
  exists (
    select 1 from public.orders o
    where o.id = order_id
      and o.buyer_id = auth.uid()
      and o.deleted_at is null
  )
  or vendor_id in (select id from public.vendor_profiles where profile_id = auth.uid())
);

create policy "guild client manage" on public.guild_orders
for all to authenticated
using (client_id = auth.uid())
with check (client_id = auth.uid());

create policy "guild participant read" on public.guild_orders
for select to authenticated
using (
  exists (
    select 1
    from public.guild_participants gp
    where gp.guild_order_id = public.guild_orders.id
      and (
        gp.profile_id = auth.uid()
        or gp.vendor_id in (select id from public.vendor_profiles where profile_id = auth.uid())
      )
      and gp.deleted_at is null
  )
);

create policy "guild participant row read" on public.guild_participants
for select to authenticated
using (
  profile_id = auth.uid()
  or exists (
    select 1 from public.guild_orders go
    where go.id = guild_order_id
      and go.client_id = auth.uid()
      and go.deleted_at is null
  )
  or vendor_id in (select id from public.vendor_profiles where profile_id = auth.uid())
);

create policy "milestone participant read" on public.milestones
for select to authenticated
using (
  exists (
    select 1 from public.orders o
    where o.id = order_id
      and o.buyer_id = auth.uid()
      and o.deleted_at is null
  )
  or exists (
    select 1 from public.guild_orders go
    where go.id = guild_order_id
      and go.client_id = auth.uid()
      and go.deleted_at is null
  )
  or participant_id in (
    select gp.id from public.guild_participants gp
    where gp.profile_id = auth.uid()
       or gp.vendor_id in (select id from public.vendor_profiles where profile_id = auth.uid())
  )
);

create policy "escrow participant read" on public.escrow_ledger
for select to authenticated
using (
  profile_id = auth.uid()
  or exists (
    select 1 from public.orders o
    where o.id = order_id
      and o.buyer_id = auth.uid()
      and o.deleted_at is null
  )
  or exists (
    select 1 from public.guild_orders go
    where go.id = guild_order_id
      and go.client_id = auth.uid()
      and go.deleted_at is null
  )
);

create policy "auction seller manage" on public.auctions
for all to authenticated
using (seller_id = auth.uid() and (public.has_role('seller') or public.has_role('artisan') or public.has_role('designer')))
with check (seller_id = auth.uid() and (public.has_role('seller') or public.has_role('artisan') or public.has_role('designer')));

create policy "bids bidder insert" on public.bids
for insert to authenticated
with check (bidder_id = auth.uid());

create policy "fabric vendor manage" on public.fabric_catalog
for all to authenticated
using (
  vendor_id in (select id from public.vendor_profiles where profile_id = auth.uid())
  or public.is_admin()
)
with check (
  vendor_id in (select id from public.vendor_profiles where profile_id = auth.uid())
  or public.is_admin()
);

create policy "cost estimates owner manage" on public.cost_estimates
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "notifications recipient manage" on public.notifications
for all to authenticated
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

create or replace function public.match_vendors_by_embedding(query_embedding vector(1536), match_count int default 12)
returns table (
  vendor_id uuid,
  profile_id uuid,
  studio_name text,
  location_region text,
  similarity double precision
)
language sql
stable
security definer
set search_path = public
as $$
  select
    vp.id as vendor_id,
    vp.profile_id,
    vp.studio_name,
    vp.location_region,
    1 - (e.embedding <=> query_embedding) as similarity
  from public.embeddings e
  join public.vendor_profiles vp
    on e.owner_table = 'vendor_profiles'
   and e.owner_id = vp.id
  where vp.deleted_at is null
  order by e.embedding <=> query_embedding
  limit match_count;
$$;

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('posts', 'posts', true),
  ('reels', 'reels', true),
  ('designs', 'designs', false),
  ('remixes', 'remixes', false),
  ('proofs', 'proofs', false),
  ('passports', 'passports', true)
on conflict (id) do nothing;

create policy "public read public media buckets" on storage.objects
for select
to public
using (bucket_id in ('avatars', 'posts', 'reels', 'passports'));

create policy "authenticated read private owned media" on storage.objects
for select
to authenticated
using (bucket_id in ('designs', 'remixes', 'proofs') and owner = auth.uid());

create policy "authenticated upload scoped media" on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('avatars', 'posts', 'reels', 'designs', 'remixes', 'proofs', 'passports')
  and owner = auth.uid()
);

create policy "authenticated update owned media" on storage.objects
for update
to authenticated
using (owner = auth.uid())
with check (owner = auth.uid());

create policy "authenticated delete owned media" on storage.objects
for delete
to authenticated
using (owner = auth.uid());
