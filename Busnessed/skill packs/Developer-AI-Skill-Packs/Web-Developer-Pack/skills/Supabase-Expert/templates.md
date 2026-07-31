# Supabase-Expert Templates

## Template 1: Supabase Client Setup

**Name**: `supabase-client-template`
**Description**: Supabase client initialization with session management.

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: { 'x-app-name': '{{appName}}' },
  },
});

// Session initialization
export async function initSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Auth state listener
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}
```

**Usage Notes**: Replace `{{appName}}` with application name. Generate TypeScript types with `supabase gen types typescript --local > database.types.ts`.

## Template 2: RLS Policy Template

**Name**: `rls-policy-template`
**Description**: Row Level Security policies for common patterns.

```sql
-- Enable RLS
ALTER TABLE {{table}} ENABLE ROW LEVEL SECURITY;

-- User-specific access
CREATE POLICY "Users can view own {{table}}"
  ON {{table}} FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can create
CREATE POLICY "Authenticated users can create {{table}}"
  ON {{table}} FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- User-specific update
CREATE POLICY "Users can update own {{table}}"
  ON {{table}} FOR UPDATE
  USING (auth.uid() = user_id);

-- User-specific delete
CREATE POLICY "Users can delete own {{table}}"
  ON {{table}} FOR DELETE
  USING (auth.uid() = user_id);

-- Admin access (requires custom claim)
CREATE POLICY "Admins can access all {{table}}"
  ON {{table}} FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Public read (no auth required)
CREATE POLICY "Public can view {{table}}"
  ON {{table}} FOR SELECT
  USING (true);
```

**Usage Notes**: Replace `{{table}}` with the actual table name. Adjust user_id field if different. Test each policy with different user roles.

## Template 3: Realtime Subscription

**Name**: `realtime-template`
**Description**: Subscribe to database changes with proper cleanup.

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export function useRealtime{{Entity}}() {
  const [{{entities}}, set{{Entities}}] = useState<{{Entity}}[]>([]);

  useEffect(() => {
    fetch{{Entities}}();

    const channel = supabase
      .channel('{{channelName}}')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: '{{table}}',
          filter: `{{filterField}}=eq.{{filterValue}}`,
        },
        (payload: RealtimePostgresChangesPayload<{{Entity}}>) => {
          handleChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function handleChange(payload: RealtimePostgresChangesPayload<{{Entity}}>) {
    switch (payload.eventType) {
      case 'INSERT':
        set{{Entities}}(prev => [payload.new!, ...prev]);
        break;
      case 'UPDATE':
        set{{Entities}}(prev =>
          prev.map(item => item.id === payload.new!.id ? payload.new! : item)
        );
        break;
      case 'DELETE':
        set{{Entities}}(prev =>
          prev.filter(item => item.id !== payload.old!.id)
        );
        break;
    }
  }

  async function fetch{{Entities}}() {
    const { data } = await supabase
      .from('{{table}}')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) set{{Entities}}(data);
  }

  return { {{entities}}, set{{Entities}} };
}
```

**Usage Notes**: Replace `{{Entity}}`/`{{Entities}}` (e.g., `Message`/`messages`), `{{table}}`, `{{channelName}}` (e.g., `messages-channel`), `{{filterField}}`, `{{filterValue}}`.

## Template 4: Edge Function

**Name**: `edge-function-template`
**Description**: Supabase Edge Function with CORS and error handling.

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const body = await req.json();
    const { action, data } = body;

    switch (action) {
      case '{{action1}}':
        // Handle action 1
        break;
      case '{{action2}}':
        // Handle action 2
        break;
      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

**Usage Notes**: Replace `{{action1}}`, `{{action2}}` with action names (e.g., `send-email`, `process-payment`). Deploy with `supabase functions deploy function-name`.

## Template 5: Storage Bucket with RLS

**Name**: `storage-template`
**Description**: Storage bucket creation and security policies.

```sql
-- Create bucket (via dashboard or SQL)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('{{bucketName}}', '{{bucketName}}', false);

-- Upload policy
CREATE POLICY "Authenticated users can upload to {{bucketName}}"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = '{{bucketName}}'
    AND auth.role() = 'authenticated'
  );

-- Read own files
CREATE POLICY "Users can read own files in {{bucketName}}"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = '{{bucketName}}'
    AND auth.uid() = owner
  );

-- Delete own files
CREATE POLICY "Users can delete own files in {{bucketName}}"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = '{{bucketName}}'
    AND auth.uid() = owner
  );

-- Public read (if public bucket)
CREATE POLICY "Public can read {{bucketName}}"
  ON storage.objects FOR SELECT
  USING (bucket_id = '{{bucketName}}');
```

```typescript
// Upload file with RLS
async function uploadFile(file: File, path?: string) {
  const filePath = path || `${crypto.randomUUID()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('{{bucketName}}')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
  if (error) throw error;
  return data.path;
}
```

**Usage Notes**: Replace `{{bucketName}}` (e.g., `user-avatars`, `document-uploads`). Choose policies based on whether the bucket is public or private.

## Template 6: Migration Script

**Name**: `migration-template`
**Description**: Supabase migration for schema changes.

```sql
-- Migration: {{description}}
-- Timestamp: {{timestamp}}

-- UP
CREATE TABLE IF NOT EXISTS {{table}} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  {{field1}} {{type1}} NOT NULL,
  {{field2}} {{type2}} DEFAULT {{default2}},
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE {{table}} ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own {{table}}"
  ON {{table}} FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_{{table}}_user ON {{table}}(user_id);
CREATE INDEX idx_{{table}}_created ON {{table}}(created_at DESC);

-- DOWN
DROP TABLE IF EXISTS {{table}};
```

**Usage Notes**: Replace `{{description}}`, `{{timestamp}}`, `{{table}}`, columns. Create with `supabase migration new {{name}}`. Apply with `supabase db push`.

## Template 7: Auth Helper Component

**Name**: `auth-template`
**Description**: Auth component with OAuth and email login.

```typescript
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

export function AuthPage() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="dark"
        providers={['google', 'github', 'discord']}
        redirectTo="{{redirectUrl}}"
        onlyThirdPartyProviders={false}
        magicLink={true}
        socialLayout="horizontal"
      />
    </div>
  );
}

// Handle redirect with session
export function AuthCallback() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = '{{redirectAfterLogin}}';
      }
    });
  }, []);
}
```

**Usage Notes**: Replace `{{redirectUrl}}` (e.g., `http://localhost:3000/auth/callback`), `{{redirectAfterLogin}}` (e.g., `/dashboard`).

## Template 8: Database Function

**Name**: `db-function-template`
**Description**: PostgreSQL function with SECURITY DEFINER.

```sql
CREATE OR REPLACE FUNCTION {{function_name}}({{params}})
RETURNS {{return_type}} AS $$
BEGIN
  {{function_body}}
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION {{function_name}}({{params}}) TO authenticated;

-- Call from client
const { data, error } = await supabase.rpc('{{function_name}}', {
  {{param1}}: value1,
  {{param2}}: value2,
});
```

**Usage Notes**: Replace `{{function_name}}`, `{{params}}`, `{{return_type}}`, `{{function_body}}`. Use SECURITY DEFINER when function needs to bypass RLS.
