CREATE TABLE restaurants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name         VARCHAR(255) NOT NULL,
  address      TEXT,
  logo_url     TEXT,
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE menu (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id  UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name           VARCHAR(255) NOT NULL,
  description    TEXT,
  ingredients    TEXT,
  img_url        TEXT,
  price          DECIMAL(10,2) NOT NULL,
  is_available   BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tables (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id  UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  number         INT NOT NULL,
  capacity       INT NOT NULL DEFAULT 4,
  pos_x          FLOAT,
  pos_y          FLOAT,
  height         FLOAT,
  width          FLOAT
);

CREATE TABLE reservations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id  UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_id       UUID NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  status         INT DEFAULT 0,
  seated_at      TIMESTAMP DEFAULT NOW(),
  closed_at      TIMESTAMP
);

CREATE TABLE orders (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id  UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  status         INT DEFAULT 0,
  notes          TEXT,
  total          DECIMAL(10,2) DEFAULT 0.00,
  time_placed    TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_id        UUID NOT NULL REFERENCES menu(id) ON DELETE RESTRICT,
  qty            INT NOT NULL DEFAULT 1,
  unit_price     DECIMAL(10,2) NOT NULL,
  total          DECIMAL(10,2) NOT NULL,
  notes          TEXT,
  status         INT DEFAULT 0
);