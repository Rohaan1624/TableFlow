DROP VIEW IF EXISTS public_menu;

CREATE VIEW public_menu AS
SELECT
  m.name AS item_name,
  m.description AS item_description,
  m.price AS item_price,
  m.img_url AS item_url,
  m.restaurant_id AS restaurant_id,
  r.name AS restaurant_name,
  r.address AS restaurant_address,
  r.logo_url AS restaurant_logo,
  c.id AS category_id,
  c.name AS category_name

FROM
    menu m
JOIN restaurants r ON m.restaurant_id = r.id
LEFT JOIN categories c ON m.category_id = c.id
WHERE
    m.is_available = true;


GRANT SELECT ON public_menu TO anon, authenticated;