-- Create reviews table
CREATE TABLE IF NOT EXISTS restaurant_review (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL REFERENCES restaurant(id),
    reviewer_name VARCHAR(255) NOT NULL,
    rating FLOAT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

-- Insert sample reviews for restaurants
INSERT INTO restaurant_review (restaurant_id, reviewer_name, rating, review_text, review_date) VALUES
(1, 'John Smith', 4.5, 'Great food and atmosphere! The service was excellent.', CURRENT_TIMESTAMP),
(1, 'Sarah Johnson', 5.0, 'Best Italian food in town. Will definitely come back!', CURRENT_TIMESTAMP),
(1, 'Michael Brown', 4.0, 'Good food but a bit pricey. Nice ambiance though.', CURRENT_TIMESTAMP),
(2, 'Emily Davis', 4.8, 'Amazing sushi! Fresh and delicious.', CURRENT_TIMESTAMP),
(2, 'David Wilson', 4.2, 'Great service and authentic Japanese cuisine.', CURRENT_TIMESTAMP),
(2, 'Lisa Anderson', 4.5, 'Love their ramen selection. Very authentic taste.', CURRENT_TIMESTAMP),
(3, 'Robert Taylor', 4.7, 'Best Mexican food I''ve had in a while!', CURRENT_TIMESTAMP),
(3, 'Jennifer Martinez', 4.3, 'Great margaritas and tacos. Fun atmosphere.', CURRENT_TIMESTAMP),
(3, 'James Garcia', 4.6, 'Authentic Mexican flavors. Highly recommended!', CURRENT_TIMESTAMP),
(4, 'Patricia Lee', 4.9, 'Excellent Chinese cuisine. The dim sum is amazing!', CURRENT_TIMESTAMP),
(4, 'Thomas Chen', 4.4, 'Great variety of dishes. Good for large groups.', CURRENT_TIMESTAMP),
(4, 'Mary Wong', 4.7, 'Authentic flavors and generous portions.', CURRENT_TIMESTAMP),
(5, 'William Kim', 4.8, 'Best Korean BBQ in the area!', CURRENT_TIMESTAMP),
(5, 'Elizabeth Park', 4.5, 'Great selection of banchan. Service is top-notch.', CURRENT_TIMESTAMP),
(5, 'Richard Choi', 4.6, 'Authentic Korean flavors. Love the atmosphere.', CURRENT_TIMESTAMP); 