-- NÚMERO DE TANDA
alter table public.sesiones add column if not exists tanda smallint check (tanda is null or tanda between 1 and 7);
notify pgrst, 'reload schema';

-- FP1, FP2, Qualy, Final 1 y Final 2 (se guardan como 8 a 12)
alter table public.sesiones drop constraint if exists sesiones_tanda_check;
alter table public.sesiones add constraint sesiones_tanda_check check (tanda is null or tanda between 1 and 12);
notify pgrst, 'reload schema';
