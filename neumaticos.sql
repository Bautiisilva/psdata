-- NEUMÁTICOS Y CONDICIÓN DE PISTA
alter table public.sesiones add column if not exists neumaticos text;
alter table public.sesiones add column if not exists condicion text;
notify pgrst, 'reload schema';
