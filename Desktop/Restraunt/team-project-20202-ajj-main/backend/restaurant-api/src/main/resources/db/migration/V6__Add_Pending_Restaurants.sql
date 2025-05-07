-- Add pending restaurants for admin approval demo
INSERT INTO restaurant (name, cuisine, location, status, rating, image_url, lat, lng) VALUES
('Sakura Sushi House', 'Japanese', 'Downtown San Jose', 'PENDING_APPROVAL', 4.5, 'https://source.unsplash.com/800x600/?sushi,japanese', 37.3382, -121.8863),
('La Paella', 'Spanish', 'Campbell', 'PENDING_APPROVAL', 4.3, 'https://source.unsplash.com/800x600/?paella,spanish', 37.2872, -121.9500),
('Mumbai Street Food', 'Indian', 'Sunnyvale', 'PENDING_APPROVAL', 4.7, 'https://source.unsplash.com/800x600/?indian,food', 37.3688, -122.0363),
('The Greek Corner', 'Greek', 'Mountain View', 'PENDING_APPROVAL', 4.4, 'https://source.unsplash.com/800x600/?greek,food', 37.3861, -122.0839),
('Seoul Kitchen', 'Korean', 'Santa Clara', 'PENDING_APPROVAL', 4.6, 'https://source.unsplash.com/800x600/?korean,food', 37.3541, -121.9552);

-- Also add some tables for these restaurants
INSERT INTO restaurant_table (restaurant_id, capacity, table_number)
SELECT r.id, 4, 'T1' FROM restaurant r WHERE r.name = 'Sakura Sushi House'
UNION ALL
SELECT r.id, 6, 'T2' FROM restaurant r WHERE r.name = 'Sakura Sushi House'
UNION ALL
SELECT r.id, 4, 'T1' FROM restaurant r WHERE r.name = 'La Paella'
UNION ALL
SELECT r.id, 8, 'T2' FROM restaurant r WHERE r.name = 'La Paella'
UNION ALL
SELECT r.id, 4, 'T1' FROM restaurant r WHERE r.name = 'Mumbai Street Food'
UNION ALL
SELECT r.id, 6, 'T2' FROM restaurant r WHERE r.name = 'Mumbai Street Food'
UNION ALL
SELECT r.id, 4, 'T1' FROM restaurant r WHERE r.name = 'The Greek Corner'
UNION ALL
SELECT r.id, 6, 'T2' FROM restaurant r WHERE r.name = 'The Greek Corner'
UNION ALL
SELECT r.id, 4, 'T1' FROM restaurant r WHERE r.name = 'Seoul Kitchen'
UNION ALL
SELECT r.id, 8, 'T2' FROM restaurant r WHERE r.name = 'Seoul Kitchen'; 