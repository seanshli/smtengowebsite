-- Adds a contact route to staff accounts.
--
-- RUN THIS BEFORE DEPLOYING the branch that adds email/phone to member
-- creation. api/admin/members.ts inserts these columns, so if the deploy
-- lands first, creating a member fails with a column-not-found error.
-- Both are nullable: existing rows stay valid, and the API only requires
-- that at least one of the two is supplied for NEW members.

ALTER TABLE backend_members ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE backend_members ADD COLUMN IF NOT EXISTS phone TEXT;

-- Optional: backfill your existing accounts so every row is reachable.
-- UPDATE backend_members SET email = 'you@smtengo.com' WHERE username = 'seanshli';
