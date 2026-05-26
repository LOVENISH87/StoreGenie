-- Add builder_data column to shops
alter table shops
add column if not exists builder_data jsonb default '{}'::jsonb;

-- Create storage bucket for shop images
insert into storage.buckets (id, name, public)
values ('shop_images', 'shop_images', true)
on conflict (id) do nothing;

-- Add RLS for storage
-- Allow public access to view images
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'shop_images' );

-- Allow authenticated users to upload images
create policy "Auth Upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'shop_images' );

create policy "Auth Update"
on storage.objects for update
to authenticated
using ( bucket_id = 'shop_images' );

create policy "Auth Delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'shop_images' );
