CREATE TABLE IF NOT EXISTS records (
    "id" serial NOT NULL,
    "operation_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" NUMERIC(100, 5) NOT NULL,
    "user_balance" NUMERIC(100, 5) NOT NULL,
    "operation_response" TEXT,
    "date" TIMESTAMP NOT NULL DEFAULT current_timestamp,

    CONSTRAINT "records_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "records_operation_id_fkey" FOREIGN KEY ("operation_id") REFERENCES "operations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);
