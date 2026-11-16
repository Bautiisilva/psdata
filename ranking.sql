-- RANKING: mejor vuelta de cada sesión
alter table public.sesiones add column if not exists mejor_vuelta numeric(8,3)
  check (mejor_vuelta is null or (mejor_vuelta > 5 and mejor_vuelta < 600));

alter table public.sesiones add column if not exists vueltas numeric(8,3)[];

-- Cualquier usuario con login ve nombres y tiempos para el ranking (nada de archivos ni otros datos)
create or replace function public.ranking_datos()
returns table (piloto text, fecha date, pista text, tipo text, mejor_vuelta numeric)
language sql stable security definer set search_path = public as $$
  select piloto, fecha, pista, tipo, mejor_vuelta from public.sesiones
  where mejor_vuelta is not null and auth.uid() is not null;
$$;
revoke all on function public.ranking_datos() from public, anon;
grant execute on function public.ranking_datos() to authenticated;

notify pgrst, 'reload schema';
