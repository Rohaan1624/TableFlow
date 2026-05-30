ALTER TABLE public.restaurants
  ADD COLUMN stripe_customer_id text,
  ADD COLUMN subscription_status text DEFAULT 'none',
  ADD COLUMN subscription_end timestamp;