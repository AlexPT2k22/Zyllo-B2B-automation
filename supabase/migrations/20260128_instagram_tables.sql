-- Instagram Accounts table
-- Stores connected Instagram business accounts and their access tokens

CREATE TABLE IF NOT EXISTS instagram_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User reference (for when you add auth)
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Instagram account data
    instagram_user_id TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL,
    account_type TEXT, -- 'BUSINESS' or 'CREATOR'
    media_count INTEGER DEFAULT 0,
    
    -- OAuth tokens
    access_token TEXT NOT NULL,
    token_expires_at TIMESTAMPTZ,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_user_id ON instagram_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_ig_user_id ON instagram_accounts(instagram_user_id);

-- Instagram Messages table  
-- Stores incoming and outgoing DMs for processing

CREATE TABLE IF NOT EXISTS instagram_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Message identifiers
    message_id TEXT UNIQUE, -- Instagram's message ID
    sender_id TEXT NOT NULL,
    recipient_id TEXT NOT NULL,
    
    -- Message content
    message_text TEXT,
    message_type TEXT DEFAULT 'text', -- 'text', 'image', 'story_reply', etc.
    
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
CREATE INDEX IF NOT EXISTS idx_instagram_messages_sender ON instagram_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_instagram_messages_recipient ON instagram_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_instagram_messages_processed ON instagram_messages(processed);
CREATE INDEX IF NOT EXISTS idx_instagram_messages_timestamp ON instagram_messages(timestamp DESC);

-- Automation Rules table
-- Stores user-defined automation rules

CREATE TABLE IF NOT EXISTS automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Owner
    instagram_account_id UUID REFERENCES instagram_accounts(id) ON DELETE CASCADE,
    
    -- Rule configuration
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    
    -- Trigger conditions (JSON)
    trigger_type TEXT NOT NULL CHECK (trigger_type IN ('keyword', 'comment', 'dm', 'story_reply')),
    trigger_keywords TEXT[], -- Array of keywords to match
    trigger_match_type TEXT DEFAULT 'contains' CHECK (trigger_match_type IN ('contains', 'exact', 'starts_with')),
    
    -- Action configuration
    action_type TEXT NOT NULL CHECK (action_type IN ('reply', 'dm', 'tag', 'notify')),
    action_message TEXT, -- The reply message template
    action_delay_seconds INTEGER DEFAULT 0, -- Delay before action
    
    -- Stats
    times_triggered INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for rule lookups
CREATE INDEX IF NOT EXISTS idx_automation_rules_account ON automation_rules(instagram_account_id);
CREATE INDEX IF NOT EXISTS idx_automation_rules_active ON automation_rules(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE instagram_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies (for when you add auth)
-- Users can only see their own data

CREATE POLICY "Users can view own instagram accounts"
    ON instagram_accounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own instagram accounts"
    ON instagram_accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own instagram accounts"
    ON instagram_accounts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own instagram accounts"
    ON instagram_accounts FOR DELETE
    USING (auth.uid() = user_id);

-- Service role bypass for Edge Functions
CREATE POLICY "Service role full access to instagram_accounts"
    ON instagram_accounts FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to instagram_messages"
    ON instagram_messages FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to automation_rules"
    ON automation_rules FOR ALL
    USING (auth.role() = 'service_role');
