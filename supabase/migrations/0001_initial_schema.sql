create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tenants enable row level security;

create policy "Tenants are manageable by authenticated users"
  on public.tenants for all
  to authenticated
  using (true)
  with check (true);

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  slug text not null,
  title text,
  destination_url text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, slug)
);

alter table public.links enable row level security;

create policy "Links are manageable by authenticated users"
  on public.links for all
  to authenticated
  using (true)
  with check (true);

create table if not exists public.clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.links(id) on delete cascade,
  clicked_at timestamptz not null default now(),
  ip_hash text,
  user_agent text,
  referer text,
  country text,
  city text
);

alter table public.clicks enable row level security;

create policy "Clicks are insertable by anonymous"
  on public.clicks for insert
  to anon, authenticated
  with check (true);

create policy "Clicks are viewable by authenticated users"
  on public.clicks for select
  to authenticated
  using (true);

create index idx_tenants_slug on public.tenants(slug);
create index idx_links_tenant_slug on public.links(tenant_id, slug);
create index idx_clicks_link_id on public.clicks(link_id);
create index idx_clicks_clicked_at on public.clicks(clicked_at);

-- Trigger to auto-update updated_at
 create or replace function public.set_updated_at()
 returns trigger as $$
 begin
   new.updated_at = now();
   return new;
 end;
 $$ language plpgsql;

create trigger tenants_updated_at
  before update on public.tenants
  for each row execute function public.set_updated_at();

create trigger links_updated_at
  before update on public.links
  for each row execute function public.set_updated_at();
