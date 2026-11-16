-- NÚMERO DE TANDA
alter table public.sesiones add column if not exists tanda smallint check (tanda is null or tanda between 1 and 7);
notify pgrst, 'reload schema';
