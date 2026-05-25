-- Run this in your Supabase SQL editor: https://supabase.com/dashboard/project/_/sql

-- Shops table
create table if not exists shops (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  description text,
  phone       text,
  address     text,
  theme       text default 'minimal',
  created_at  timestamptz default now()
);

alter table shops enable row level security;

-- Anyone can read shops (public storefronts)
create policy "public_read_shops" on shops
  for select using (true);

-- Users can only insert/update/delete their own shops
create policy "owner_insert_shops" on shops
  for insert with check (auth.uid() = user_id);

create policy "owner_update_shops" on shops
  for update using (auth.uid() = user_id);

create policy "owner_delete_shops" on shops
  for delete using (auth.uid() = user_id);


-- Products table
create table if not exists products (
  id         uuid primary key default gen_random_uuid(),
  shop_id    uuid references shops(id) on delete cascade not null,
  name       text not null,
  price      text not null,
  image      text,
  "order"    integer default 0,
  created_at timestamptz default now()
);

alter table products enable row level security;

-- Anyone can read products (public storefronts)
create policy "public_read_products" on products
  for select using (true);

-- Only the shop owner can insert/update/delete products
create policy "owner_insert_products" on products
  for insert with check (
    exists (
      select 1 from shops where shops.id = products.shop_id and shops.user_id = auth.uid()
    )
  );

create policy "owner_update_products" on products
  for update using (
    exists (
      select 1 from shops where shops.id = products.shop_id and shops.user_id = auth.uid()
    )
  );

create policy "owner_delete_products" on products
  for delete using (
    exists (
      select 1 from shops where shops.id = products.shop_id and shops.user_id = auth.uid()
    )
  );
