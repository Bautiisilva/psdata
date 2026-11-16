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
