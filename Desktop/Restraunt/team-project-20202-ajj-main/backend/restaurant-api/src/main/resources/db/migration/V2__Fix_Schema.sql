-- Drop existing booking table
DROP TABLE IF EXISTS booking;

-- Recreate booking table with correct schema
CREATE TABLE booking (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    restaurant_id BIGINT NOT NULL REFERENCES restaurant(id),
    table_id BIGINT NOT NULL REFERENCES restaurant_table(id),
    date VARCHAR(10) NOT NULL,
    time VARCHAR(8) NOT NULL,
    party_size INT NOT NULL,
    special_request TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 