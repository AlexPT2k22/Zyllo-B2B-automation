-- 1. Grant Permissions to Database Roles (Crucial!)
-- When tables are created via SQL, 'anon' (public) users often don't get permissions by default.
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON public.activity_log TO anon, authenticated, service_role;
GRANT ALL ON public.instagram_messages TO anon, authenticated, service_role;
GRANT ALL ON public.instagram_accounts TO anon, authenticated, service_role;
GRANT ALL ON public.automations TO anon, authenticated, service_role;

-- 2. Reset & Fix RLS Policies for Activity Log
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Remove conflicting policies
DROP POLICY IF EXISTS "Users can view own logs" ON public.activity_log;
DROP POLICY IF EXISTS "Public insert logs" ON public.activity_log;
DROP POLICY IF EXISTS "Allow inserts for everyone" ON public.activity_log;
DROP POLICY IF EXISTS "Service role can insert logs" ON public.activity_log;

-- Create permissive policies
CREATE POLICY "Enable insert for all" 
  ON public.activity_log 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Enable select for owners" 
  ON public.activity_log 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- 3. Reset & Fix RLS for Messages
ALTER TABLE public.instagram_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert messages" ON public.instagram_messages;
DROP POLICY IF EXISTS "Users view all messages" ON public.instagram_messages;

CREATE POLICY "Enable insert for all messages" 
  ON public.instagram_messages 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Enable select for all messages" 
  ON public.instagram_messages 
  FOR SELECT 
  USING (true);
