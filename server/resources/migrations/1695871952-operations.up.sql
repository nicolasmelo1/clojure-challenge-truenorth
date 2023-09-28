CREATE TYPE operations_type AS ENUM ('addition', 'subtraction', 'multiplication', 'division', 'square_root', 'random_string');
--;;
CREATE TABLE IF NOT EXISTS operations (
    "id" serial NOT NULL,
    "type" "operations_type" NOT NULL,
    "cost" NUMERIC(100, 5) NOT NULL DEFAULT RANDOM(),

    CONSTRAINT "operations_pkey" PRIMARY KEY ("id")
);
