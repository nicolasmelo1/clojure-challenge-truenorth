CREATE TABLE IF NOT EXISTS __migrations(
    id serial PRIMARY KEY,
    name VARCHAR(280) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp
);
