-- 1. Create the backend_members table
CREATE TABLE IF NOT EXISTS backend_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'operator', -- 'superuser' or 'operator'
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Enable RLS (Optional but recommended)
-- ALTER TABLE backend_members ENABLE ROW LEVEL SECURITY;

-- 3. Create a default superuser (Password: admin123)
-- Note: You should replace the password hash with a properly hashed version if possible,
-- but for the first-time setup, the backend API will handle hashing if you use an insert script.
-- To manually insert the first user (already hashed with bcrypt 10):
INSERT INTO backend_members (username, password, role, name)
VALUES ('admin', '$2a$10$7qYkP8.Fv.X3X.P8.Fv.X3X.P8.Fv.X3X.P8.Fv.X3X.P8.Fv.X3X', 'superuser', 'System Admin');

-- IMPORTANT: The above hash is just a placeholder. 
-- Please run the following Node script locally to generate your first hashed password.
