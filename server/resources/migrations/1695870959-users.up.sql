CREATE TYPE users_status AS ENUM ('active', 'inactive');
--;;
CREATE TABLE IF NOT EXISTS users (
    "id" serial NOT NULL,
    -- Reference: https://www.mindbaz.com/en/email-deliverability/what-is-the-maximum-size-of-an-mail-address/
    "username" VARCHAR(320) NOT NULL UNIQUE,
    "password" TEXT,
    "status" "users_status" NOT NULL DEFAULT 'active',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
