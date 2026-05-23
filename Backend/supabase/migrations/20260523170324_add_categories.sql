CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu ADD COLUMN category_id uuid REFERENCES categories(id) ON DELETE SET NULL;

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own categories"
ON categories FOR ALL
TO authenticated
USING (restaurant_id IN (
  SELECT id FROM restaurants WHERE user_id = auth.uid()
));