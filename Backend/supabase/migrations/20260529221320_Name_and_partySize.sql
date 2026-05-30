ALTER TABLE public.reservations
  ADD COLUMN customer_name text,
  ADD COLUMN party_size integer;