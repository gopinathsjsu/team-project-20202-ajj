-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20)
);

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurant (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cuisine VARCHAR(255),
    location VARCHAR(255),
    rating FLOAT,
    price_range VARCHAR(10),
    description TEXT,
    image_url TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    address TEXT
);

-- Restaurant tables
CREATE TABLE IF NOT EXISTS restaurant_table (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL REFERENCES restaurant(id),
    capacity INT NOT NULL,
    table_number VARCHAR(50) NOT NULL,
    UNIQUE(restaurant_id, table_number)
);

-- Availability slots
CREATE TABLE IF NOT EXISTS availability_slots (
    id BIGSERIAL PRIMARY KEY,
    table_id BIGINT NOT NULL REFERENCES restaurant_table(id),
    available_at TIMESTAMP NOT NULL,
    is_booked BOOLEAN NOT NULL DEFAULT false,
    UNIQUE(table_id, available_at)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS booking (
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