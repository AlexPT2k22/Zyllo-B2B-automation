-- TikTok Accounts table
-- Stores connected TikTok accounts and their access tokens

CREATE TABLE IF NOT EXISTS tiktok_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User reference
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- TikTok account data
    tiktok_user_id TEXT NOT NULL UNIQUE,  -- TikTok's open_id
    username TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    
    -- OAuth tokens
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    
    -- Scopes granted
    scopes TEXT[], -- e.g. ['user.info.basic', 'direct.message.read', 'direct.message.write']
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_tiktok_accounts_user_id ON tiktok_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_tiktok_accounts_tiktok_user_id ON tiktok_accounts(tiktok_user_id);

-- TikTok Messages table  
-- Stores incoming and outgoing TikTok DMs for processing

CREATE TABLE IF NOT EXISTS tiktok_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Message identifiers
    message_id TEXT UNIQUE, -- TikTok's message ID
    conversation_id TEXT,   -- TikTok conversation/thread ID
    sender_id TEXT NOT NULL,
    recipient_id TEXT NOT NULL,
    
    -- Message content
    message_text TEXT,
    message_type TEXT DEFAULT 'text', -- 'text', 'image', 'video', etc.
    
    -- Direction and status
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    processed BOOLEAN DEFAULT false,
    auto_replied BOOLEAN DEFAULT false,
    
    -- Which rule triggered the reply (if any)
    triggered_rule_id UUID,
    
    -- Timestamps
    timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for message queries
CREATE INDEX IF NOT EXISTS idx_tiktok_messages_sender ON tiktok_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_tiktok_messages_recipient ON tiktok_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_tiktok_messages_processed ON tiktok_messages(processed);
CREATE INDEX IF NOT EXISTS idx_tiktok_messages_timestamp ON tiktok_messages(timestamp DESC);

-- Add platform column to automations table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'automations' AND column_name = 'platform'
    ) THEN
        ALTER TABLE automations ADD COLUMN platform TEXT DEFAULT 'instagram';
    END IF;
END $$;

-- Update existing automations to have platform = 'instagram'
UPDATE automations SET platform = 'instagram' WHERE platform IS NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE tiktok_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiktok_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for TikTok Accounts
CREATE POLICY "Users can view own tiktok accounts"
    ON tiktok_accounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tiktok accounts"
    ON tiktok_accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tiktok accounts"
    ON tiktok_accounts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tiktok accounts"
    ON tiktok_accounts FOR DELETE
    USING (auth.uid() = user_id);

-- Service role bypass for Edge Functions
CREATE POLICY "Service role full access to tiktok_accounts"
    ON tiktok_accounts FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to tiktok_messages"
    ON tiktok_messages FOR ALL
    USING (auth.role() = 'service_role');

-- Webhook logs table (if not exists) - shared across platforms
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT DEFAULT 'unknown', -- 'instagram', 'tiktok', etc.
    body JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add platform column to webhook_logs if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'webhook_logs' AND column_name = 'platform'
    ) THEN
        ALTER TABLE webhook_logs ADD COLUMN platform TEXT DEFAULT 'unknown';
    END IF;
END $$;
