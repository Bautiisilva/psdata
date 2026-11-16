-- Pegá esto en Supabase → SQL Editor → New query → Run
create table if not exists public.sesiones (
  id uuid primary key,
  piloto text not null,
  fecha date not null,
  hora time not null,
  kart integer not null,
  tipo text not null,
  motor text not null,
  creado timestamptz not null default now()
);

alter table public.sesiones enable row level security;

-- Cualquiera que entre a la página puede ver, cargar y borrar sesiones.
drop policy if exists "ver sesiones" on public.sesiones;
drop policy if exists "cargar sesiones" on public.sesiones;
drop policy if exists "borrar sesiones" on public.sesiones;
create policy "ver sesiones" on public.sesiones for select to anon using (true);
create policy "cargar sesiones" on public.sesiones for insert to anon with check (true);
create policy "borrar sesiones" on public.sesiones for delete to anon using (true);

grant select, insert, delete on public.sesiones to anon;

-- ARCHIVOS DEL LOGGER (agregado después)
alter table public.sesiones add column if not exists archivo text;
alter table public.sesiones add column if not exists archivo_nombre text;

insert into storage.buckets (id, name, public, file_size_limit)
values ('archivos', 'archivos', true, 52428800)
on conflict (id) do nothing;

drop policy if exists "ver archivos" on storage.objects;
drop policy if exists "subir archivos" on storage.objects;
drop policy if exists "borrar archivos" on storage.objects;
create policy "ver archivos" on storage.objects for select to anon using (bucket_id = 'archivos');
create policy "subir archivos" on storage.objects for insert to anon with check (bucket_id = 'archivos');
create policy "borrar archivos" on storage.objects for delete to anon using (bucket_id = 'archivos');

notify pgrst, 'reload schema';

-- PISTA (agregado después)
alter table public.sesiones add column if not exists pista text;
notify pgrst, 'reload schema';

-- CUENTAS (agregado después): ver cuentas.sql

-- RANKING (agregado después): ver ranking.sql

-- TANDA (agregado después): ver tanda.sql
