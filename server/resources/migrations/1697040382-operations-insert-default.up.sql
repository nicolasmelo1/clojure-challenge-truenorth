INSERT INTO operations (id, type) VALUES 
    (1, CAST('addition' AS operations_type)),
    (2, CAST('subtraction' AS operations_type)),
    (3, CAST('multiplication' AS operations_type)),
    (4, CAST('division' AS operations_type)),
    (5, CAST('square_root' AS operations_type)),
    (6, CAST('random_string' AS operations_type))
ON CONFLICT DO NOTHING;
