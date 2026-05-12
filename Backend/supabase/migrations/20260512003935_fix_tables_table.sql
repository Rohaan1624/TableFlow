DROP TABLE tables CASCADE;
CREATE TABLE tables (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id  UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  number         INT NOT NULL,
  capacity       INT NOT NULL DEFAULT 4,
  shape VARCHAR(10) DEFAULT 'square', -- 'square' or 'round'
  pos_x          FLOAT,
  pos_y          FLOAT,
  height         FLOAT,
  width          FLOAT
);