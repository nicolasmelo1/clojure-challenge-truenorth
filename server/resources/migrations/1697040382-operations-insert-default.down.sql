DELETE FROM records USING operations WHERE records.operation_id = operations.id AND operations.type IN ('addition', 'subtraction', 'multiplication', 'division', 'square_root', 'random_string');
--;;
DELETE FROM operations WHERE type IN ('addition', 'subtraction', 'multiplication', 'division', 'square_root', 'random_string');
