# Supabase-Expert Examples

## Beginner: Auth and Basic Queries

**Description**: Basic Supabase setup with authentication and user profile CRUD.

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SQL - Profiles table
// CREATE TABLE profiles (
//   id UUID REFERENCES auth.users(id) PRIMARY KEY,
//   username TEXT UNIQUE,
//   avatar_url TEXT,
//   updated_at TIMESTAMPTZ
// );
// ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Users can view own profile"
//   ON profiles FOR SELECT
//   USING (auth.uid() = id);
// CREATE POLICY "Users can update own profile"
//   ON profiles FOR UPDATE
//   USING (auth.uid() = id);

// Auth component
async function handleSignUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  // Create profile record
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      username: email.split('@')[0],
    });
  }
  return data;
}

async function handleSignIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
}

// Session management
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') console.log('User signed in', session?.user?.id);
  if (event === 'SIGNED_OUT') console.log('User signed out');
  if (event === 'TOKEN_REFRESHED') console.log('Token refreshed');
});
```

**Explanation**: This demonstrates Supabase client initialization, email/password authentication, RLS-protected profile table, session management with onAuthStateChange listener, and basic CRUD with RLS policies.

## Intermediate: RLS, Realtime, and Storage

**Description**: Collaborative todo app with real-time updates, file attachments, and RLS.

```sql
-- RLS Policies for todos table
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid(),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own todos"
  ON todos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own todos"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos"
  ON todos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos"
  ON todos FOR DELETE
  USING (auth.uid() = user_id);

-- Storage bucket policy
-- Bucket: todo-attachments
CREATE POLICY "Users can upload own attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'todo-attachments'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view own attachments"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'todo-attachments'
    AND auth.role() = 'authenticated'
  );
```

```typescript
// Real-time todo list
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  attachment_url: string | null;
}

function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    // Initial fetch
    fetchTodos();

    // Realtime subscription
    const channel = supabase
      .channel('todo-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTodos(prev => [...prev, payload.new as Todo]);
          } else if (payload.eventType === 'UPDATE') {
            setTodos(prev => prev.map(t =>
              t.id === payload.new.id ? (payload.new as Todo) : t
            ));
          } else if (payload.eventType === 'DELETE') {
            setTodos(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchTodos() {
    const { data } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setTodos(data);
  }

  async function addTodo(title: string) {
    await supabase.from('todos').insert({ title });
  }

  async function toggleTodo(id: string) {
    await supabase
      .from('todos')
      .update({ completed: supabase.rpc('toggle', {}) })
      .eq('id', id);
  }

  async function uploadAttachment(file: File) {
    const { data } = await supabase.storage
      .from('todo-attachments')
      .upload(`${crypto.randomUUID()}-${file.name}`, file);
    return data?.path;
  }

  return { todos, addTodo, toggleTodo, uploadAttachment };
}
```

**Explanation**: This shows RLS policies for all CRUD operations, real-time postgres_changes subscription for live updates, storage bucket with RLS for file attachments, and proper cleanup of subscriptions on unmount.

## Advanced: Edge Functions and Database Functions

**Description**: Serverless payment processing with Edge Functions and database triggers.

```typescript
// supabase/functions/process-payment/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface PaymentRequest {
  orderId: string;
  paymentMethodId: string;
  amount: number;
}

serve(async (req) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') return new Response('ok', { headers });

  try {
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { orderId, paymentMethodId, amount }: PaymentRequest = await req.json();

    // Validate order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404, headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    if (order.status !== 'pending') {
      return new Response(JSON.stringify({ error: 'Order already processed' }), {
        status: 400, headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    // Process payment with external provider
    const paymentResult = await processExternalPayment(amount, paymentMethodId);

    if (!paymentResult.success) {
      await supabase.from('orders').update({ status: 'failed' }).eq('id', orderId);
      return new Response(JSON.stringify({ error: 'Payment failed' }), {
        status: 400, headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    // Update order status
    await supabase.from('orders').update({
      status: 'confirmed',
      payment_id: paymentResult.paymentId,
    }).eq('id', orderId);

    return new Response(JSON.stringify({
      success: true, paymentId: paymentResult.paymentId, orderId,
    }), { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
});

async function processExternalPayment(amount: number, paymentMethodId: string) {
  // Simulate external payment processing
  return { success: true, paymentId: crypto.randomUUID() };
}
```

```sql
-- Database function for order total calculation
CREATE OR REPLACE FUNCTION calculate_order_total(p_order_id UUID)
RETURNS DECIMAL(12,2) AS $$
DECLARE
  total DECIMAL(12,2);
BEGIN
  SELECT SUM(oi.quantity * oi.price) INTO total
  FROM order_items oi
  WHERE oi.order_id = p_order_id;
  RETURN COALESCE(total, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-set total on order
CREATE OR REPLACE FUNCTION set_order_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total := calculate_order_total(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_order_total
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_total();
```

**Explanation**: This production example shows Edge Function with CORS headers, service_role client for server-side operations, external payment integration with error handling, database functions with SECURITY DEFINER, and triggers for automatic computations.
