-- CUENTAS DE PILOTOS Y ADMINISTRADOR
-- Pegá todo en Supabase → SQL Editor → New query → Run.

-- 1) Perfiles: quién es cada usuario y qué rol tiene
create table if not exists public.perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  usuario text unique not null,
  nombre text unique not null,
  rol text not null default 'piloto' check (rol in ('admin', 'piloto')),
  creado timestamptz not null default now()
);
alter table public.perfiles enable row level security;

create or replace function public.es_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.perfiles where id = auth.uid() and rol = 'admin');
$$;

create or replace function public.mi_nombre() returns text
language sql stable security definer set search_path = public as $$
  select nombre from public.perfiles where id = auth.uid();
$$;

drop policy if exists "perfil propio o admin" on public.perfiles;
create policy "perfil propio o admin" on public.perfiles
  for select to authenticated using (id = auth.uid() or public.es_admin());
revoke all on public.perfiles from anon;
grant select on public.perfiles to authenticated;

-- 2) Sesiones: el admin hace todo, cada piloto solo ve las suyas, sin login no se ve nada
drop policy if exists "ver sesiones" on public.sesiones;
drop policy if exists "cargar sesiones" on public.sesiones;
drop policy if exists "borrar sesiones" on public.sesiones;
drop policy if exists "admin todo" on public.sesiones;
drop policy if exists "piloto ve las suyas" on public.sesiones;
revoke all on public.sesiones from anon;
grant select, insert, delete on public.sesiones to authenticated;
create policy "admin todo" on public.sesiones
  for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "piloto ve las suyas" on public.sesiones
  for select to authenticated using (piloto = public.mi_nombre());

-- 3) Archivos: privados. El admin hace todo, cada piloto solo baja los de sus sesiones
update storage.buckets set public = false where id = 'archivos';
drop policy if exists "ver archivos" on storage.objects;
drop policy if exists "subir archivos" on storage.objects;
drop policy if exists "borrar archivos" on storage.objects;
drop policy if exists "archivos admin" on storage.objects;
drop policy if exists "archivos piloto" on storage.objects;
create policy "archivos admin" on storage.objects
  for all to authenticated
  using (bucket_id = 'archivos' and public.es_admin())
  with check (bucket_id = 'archivos' and public.es_admin());
create policy "archivos piloto" on storage.objects
  for select to authenticated
  using (bucket_id = 'archivos' and exists (
    select 1 from public.sesiones s where s.archivo = storage.objects.name and s.piloto = public.mi_nombre()));

-- 4) Funciones para crear cuentas, cambiar contraseñas y borrar cuentas (solo admin)
create or replace function public.crear_usuario(p_usuario text, p_clave text, p_nombre text, p_rol text default 'piloto')
returns uuid language plpgsql security definer set search_path = public, extensions, auth as $$
declare v_id uuid := gen_random_uuid(); v_email text;
begin
  if not (public.es_admin() or (auth.uid() is null and session_user not in ('authenticator', 'anon', 'authenticated'))) then
    raise exception 'Solo el administrador puede crear cuentas';
  end if;
  p_usuario := lower(trim(p_usuario)); p_nombre := trim(p_nombre);
  if p_usuario !~ '^[a-z0-9._-]{3,30}$' then raise exception 'Usuario inválido: usá de 3 a 30 letras, números, punto, guion o guion bajo'; end if;
  if length(p_clave) < 6 then raise exception 'La contraseña tiene que tener al menos 6 caracteres'; end if;
  if p_nombre = '' then raise exception 'Falta el nombre del piloto'; end if;
  if p_rol not in ('admin', 'piloto') then raise exception 'Rol inválido'; end if;
  if exists (select 1 from public.perfiles where usuario = p_usuario) then raise exception 'Ese usuario ya existe'; end if;
  if exists (select 1 from public.perfiles where lower(nombre) = lower(p_nombre)) then raise exception 'Ese piloto ya tiene una cuenta'; end if;
  v_email := p_usuario || '@psdata.app';
  insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token)
  values ('00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated', v_email,
    crypt(p_clave, gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (gen_random_uuid(), v_id, v_id::text,
    jsonb_build_object('sub', v_id::text, 'email', v_email, 'email_verified', true), 'email', now(), now(), now());
  insert into public.perfiles (id, usuario, nombre, rol) values (v_id, p_usuario, p_nombre, p_rol);
  return v_id;
end $$;

create or replace function public.cambiar_clave(p_id uuid, p_clave text)
returns void language plpgsql security definer set search_path = public, extensions, auth as $$
begin
  if not public.es_admin() then raise exception 'Solo el administrador puede cambiar contraseñas'; end if;
  if length(p_clave) < 6 then raise exception 'La contraseña tiene que tener al menos 6 caracteres'; end if;
  update auth.users set encrypted_password = crypt(p_clave, gen_salt('bf')), updated_at = now() where id = p_id;
end $$;

create or replace function public.eliminar_usuario(p_id uuid)
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if not public.es_admin() then raise exception 'Solo el administrador puede borrar cuentas'; end if;
  if (select rol from public.perfiles where id = p_id) = 'admin'
     and (select count(*) from public.perfiles where rol = 'admin') <= 1 then
    raise exception 'No podés borrar el único administrador';
  end if;
  delete from auth.users where id = p_id;
end $$;

revoke all on function public.crear_usuario(text, text, text, text) from public, anon;
revoke all on function public.cambiar_clave(uuid, text) from public, anon;
revoke all on function public.eliminar_usuario(uuid) from public, anon;
grant execute on function public.crear_usuario(text, text, text, text) to authenticated;
grant execute on function public.cambiar_clave(uuid, text) to authenticated;
grant execute on function public.eliminar_usuario(uuid) to authenticated;

notify pgrst, 'reload schema';
