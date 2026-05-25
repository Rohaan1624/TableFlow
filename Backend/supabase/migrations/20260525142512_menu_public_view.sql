CREATE VIEW public_menu AS
SELECT
  m.name AS menu_name,
  m.description AS menu_description,
  m.restaurant_id AS restaurant_id,
  r.name AS restaurant_name,
  r.address AS restaurant_address,
  r.logo_url AS restaurant_logo
FROM
    menu m
JOIN restaurants r ON m.restaurant_id = r.id;
