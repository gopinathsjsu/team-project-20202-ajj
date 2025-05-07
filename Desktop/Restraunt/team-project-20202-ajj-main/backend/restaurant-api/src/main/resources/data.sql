INSERT INTO restaurant (name, cuisine, location, rating, opening_time, closing_time, total_capacity, slot_duration_minutes) VALUES
('Pasta Palace', 'Italian', 'Downtown', 4.5, '11:00', '22:00', 40, 60),
('Sushi Central', 'Japanese', 'Uptown', 4.7, '12:00', '23:00', 30, 60),
('Taco Town', 'Mexican', 'Midtown', 4.2, '10:00', '22:00', 35, 60),
('Burger Barn', 'American', 'Suburb', 4.0, '11:00', '21:00', 45, 60),
('Curry Corner', 'Indian', 'City Center', 4.3, '12:00', '23:00', 38, 60),
('Noodle Nest', 'Chinese', 'Chinatown', 4.6, '11:00', '22:30', 42, 60),
('Pizza Plaza', 'Italian', 'East Side', 4.4, '11:00', '23:00', 36, 60),
('BBQ Haven', 'American', 'West End', 4.1, '12:00', '22:00', 50, 60),
('Vegan Vibes', 'Vegan', 'Green District', 4.8, '09:00', '21:00', 28, 60),
('Seafood Shack', 'Seafood', 'Harbor', 4.5, '12:00', '22:00', 44, 60),
('Bistro Bliss', 'French', 'Old Town', 4.7, '17:00', '23:00', 32, 60),
('Tapas Tavern', 'Spanish', 'Market Square', 4.3, '16:00', '23:00', 40, 60),
('Kebab Kingdom', 'Middle Eastern', 'South Side', 4.2, '11:00', '22:00', 35, 60),
('Dim Sum Delight', 'Chinese', 'Central Park', 4.6, '10:00', '21:00', 48, 60),
('Steakhouse Supreme', 'American', 'Financial District', 4.4, '16:00', '23:00', 40, 60);

-- Update any existing null party_size values to 1
UPDATE booking SET party_size = 1 WHERE party_size IS NULL;