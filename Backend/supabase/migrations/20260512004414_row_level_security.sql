-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RESTAURANTS
-- User can only see and edit their own restaurant
-- ============================================
CREATE POLICY "owner can view own restaurant"
  ON restaurants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "owner can insert own restaurant"
  ON restaurants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "owner can update own restaurant"
  ON restaurants FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "owner can delete own restaurant"
  ON restaurants FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- MENU
-- User can only access menu items belonging to their restaurant
-- ============================================
CREATE POLICY "owner can view own menu"
  ON menu FOR SELECT
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "owner can insert own menu"
  ON menu FOR INSERT
  WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "owner can update own menu"
  ON menu FOR UPDATE
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "owner can delete own menu"
  ON menu FOR DELETE
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- TABLES
-- ============================================
CREATE POLICY "owner can view own tables"
  ON tables FOR SELECT
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "owner can insert own tables"
  ON tables FOR INSERT
  WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "owner can update own tables"
  ON tables FOR UPDATE
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "owner can delete own tables"
  ON tables FOR DELETE
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- RESERVATIONS
-- ============================================
CREATE POLICY "owner can view own reservations"
  ON reservations FOR SELECT
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "owner can insert own reservations"
  ON reservations FOR INSERT
  WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "owner can update own reservations"
  ON reservations FOR UPDATE
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "owner can delete own reservations"
  ON reservations FOR DELETE
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- ORDERS
-- ============================================
CREATE POLICY "owner can view own orders"
  ON orders FOR SELECT
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "owner can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "owner can update own orders"
  ON orders FOR UPDATE
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "owner can delete own orders"
  ON orders FOR DELETE
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- ITEMS
-- Items don't have restaurant_id so we join up through orders
-- ============================================
CREATE POLICY "owner can view own items"
  ON items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "owner can insert own items"
  ON items FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "owner can update own items"
  ON items FOR UPDATE
  USING (
    order_id IN (
      SELECT id FROM orders WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "owner can delete own items"
  ON items FOR DELETE
  USING (
    order_id IN (
      SELECT id FROM orders WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE user_id = auth.uid()
      )
    )
  );