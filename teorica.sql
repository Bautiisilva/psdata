-- VUELTA TEÓRICA (mejores microsectores)
alter table public.sesiones add column if not exists vuelta_teorica numeric(8,3);
alter table public.sesiones add column if not exists microsectores jsonb;
grant update on public.sesiones to authenticated;
notify pgrst, 'reload schema';
