# 07 - Database Rules

## Document Status

**Status:** ✅ ACTIVE  
**Version:** 1.0.0  
**Last Updated:** 2026-01-26  
**Authority:** Engineering Standards

---

## Purpose

This document defines **how we work with databases** in this project. Even though we start with static content (MDX), these rules govern future database integration.

**Why this matters:**
- Data integrity: Prevent data corruption
- Performance: Optimize queries from the start
- Security: Protect sensitive data
- Scalability: Support growth
- Maintainability: Clear patterns for data access

---

## Database Strategy

### Phase 1: Static First (Current)
```
Content → MDX Files → File System
```

**No database needed yet.**

### Phase 2: Hybrid (Phase 3+)
```
Static Content → MDX Files
Dynamic Features → Supabase (PostgreSQL)
```

**Examples:**
- Blog posts → MDX
- Projects → MDX
- Guestbook → Supabase
- Contact messages → Supabase

### Phase 3: Full Dynamic (Future)
```
All Content → Supabase
Advanced Features → Real-time, auth, storage
```

---

## Technology Choice

### Selected: Supabase (PostgreSQL)

**Why Supabase:**
- ✅ PostgreSQL (industry standard)
- ✅ Built-in auth
- ✅ Real-time subscriptions
- ✅ Row-level security
- ✅ Excellent TypeScript support
- ✅ Free tier for development
- ✅ Easy Vercel integration

**Alternatives Considered:**
- PlanetScale: Good, but MySQL
- Prisma + PostgreSQL: More setup
- MongoDB: NoSQL not needed
- Firebase: Less control

**Decision:** Supabase provides the best balance of features, DX, and cost.

---

## Database Architecture

### Schema Organization

```
public/
├── guestbook_entries
│   ├── id (uuid, primary key)
│   ├── name (text)
│   ├── message (text)
│   ├── email (text, optional)
│   ├── created_at (timestamp)
│   └── updated_at (timestamp)
│
├── contact_messages
│   ├── id (uuid, primary key)
│   ├── name (text)
│   ├── email (text)
│   ├── message (text)
│   ├── status (enum: new, read, replied)
│   ├── created_at (timestamp)
│   └── ip_address (text, for rate limiting)
│
└── analytics_events (future)
    ├── id (uuid, primary key)
    ├── event_type (text)
    ├── page_path (text)
    ├── user_agent (text)
    └── created_at (timestamp)
```

---

## Database Client Setup

### Configuration

```typescript
// lib/db/client.ts

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false, // Server-side only
    },
  }
)
```

---

### Type Safety

```typescript
// lib/db/types.ts
// Generated from Supabase CLI: npx supabase gen types typescript

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      guestbook_entries: {
        Row: {
          id: string
          name: string
          message: string
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          message: string
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          message?: string
          email?: string | null
          updated_at?: string
        }
      }
      // Other tables...
    }
  }
}
```

---

## Data Access Patterns

### Pattern 1: Repository Pattern

```typescript
// lib/db/repositories/guestbook.repository.ts

import { supabase } from '../client'
import type { Database } from '../types'
import type { Result } from '@/types/common'

type GuestbookEntry = Database['public']['Tables']['guestbook_entries']['Row']
type GuestbookInsert = Database['public']['Tables']['guestbook_entries']['Insert']

export class GuestbookRepository {
  /**
   * Get all guestbook entries
   */
  async getAll(): Promise<Result<GuestbookEntry[]>> {
    try {
      const { data, error } = await supabase
        .from('guestbook_entries')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Error fetching guestbook entries:', error)
      return {
        success: false,
        error: 'Failed to load guestbook entries'
      }
    }
  }
  
  /**
   * Create new entry
   */
  async create(entry: GuestbookInsert): Promise<Result<GuestbookEntry>> {
    try {
      const { data, error } = await supabase
        .from('guestbook_entries')
        .insert(entry)
        .select()
        .single()
      
      if (error) throw error
      if (!data) throw new Error('No data returned')
      
      return { success: true, data }
    } catch (error) {
      console.error('Error creating guestbook entry:', error)
      return {
        success: false,
        error: 'Failed to create entry'
      }
    }
  }
  
  /**
   * Delete entry by ID
   */
  async delete(id: string): Promise<Result<void>> {
    try {
      const { error } = await supabase
        .from('guestbook_entries')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      return { success: true, data: undefined }
    } catch (error) {
      console.error('Error deleting guestbook entry:', error)
      return {
        success: false,
        error: 'Failed to delete entry'
      }
    }
  }
}

// Export singleton instance
export const guestbookRepository = new GuestbookRepository()
```

---

### Pattern 2: Service Layer Usage

```typescript
// features/guestbook/services/guestbook.service.ts

import { guestbookRepository } from '@/lib/db/repositories/guestbook.repository'
import { GuestbookEntrySchema } from '../schemas/guestbook.schema'
import type { Result } from '@/types/common'

export async function getGuestbookEntries() {
  return await guestbookRepository.getAll()
}

export async function createGuestbookEntry(
  data: unknown
): Promise<Result<void>> {
  try {
    // Validate input
    const validated = GuestbookEntrySchema.safeParse(data)
    
    if (!validated.success) {
      return {
        success: false,
        error: 'Invalid entry data'
      }
    }
    
    // Create entry
    const result = await guestbookRepository.create(validated.data)
    
    if (!result.success) {
      return result
    }
    
    return { success: true, data: undefined }
    
  } catch (error) {
    console.error('Error in createGuestbookEntry:', error)
    return {
      success: false,
      error: 'Failed to create entry'
    }
  }
}
```

---

## Query Rules

### 1. Always Use Type-Safe Queries

```typescript
// ❌ WRONG - No type safety
const { data } = await supabase
  .from('guestbook_entries')
  .select('*')

// ✅ CORRECT - Full type safety
const { data, error } = await supabase
  .from('guestbook_entries')
  .select('*')

if (error) throw error
// data is typed as GuestbookEntry[]
```

---

### 2. Handle Errors Explicitly

```typescript
// ❌ WRONG - Ignoring errors
const { data } = await supabase
  .from('guestbook_entries')
  .select('*')

// ✅ CORRECT - Explicit error handling
const { data, error } = await supabase
  .from('guestbook_entries')
  .select('*')

if (error) {
  console.error('Database error:', error)
  return { success: false, error: 'Failed to fetch data' }
}
```

---

### 3. Use Selective Queries

```typescript
// ❌ WRONG - Fetching unnecessary data
const { data } = await supabase
  .from('guestbook_entries')
  .select('*')

// ✅ CORRECT - Select only needed fields
const { data } = await supabase
  .from('guestbook_entries')
  .select('id, name, message, created_at')
```

---

### 4. Implement Pagination

```typescript
// ✅ CORRECT - Paginated query
const PAGE_SIZE = 10

async function getGuestbookPage(page: number = 0) {
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  
  const { data, error, count } = await supabase
    .from('guestbook_entries')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)
  
  if (error) throw error
  
  return {
    entries: data || [],
    total: count || 0,
    hasMore: (count || 0) > to + 1
  }
}
```

---

### 5. Use Indexes for Common Queries

```sql
-- Migration: Add indexes for performance

-- Index for date-based sorting
CREATE INDEX idx_guestbook_created_at 
ON guestbook_entries(created_at DESC);

-- Index for contact message status
CREATE INDEX idx_contact_status 
ON contact_messages(status);

-- Composite index for filtering + sorting
CREATE INDEX idx_contact_status_created 
ON contact_messages(status, created_at DESC);
```

---

## Security Rules

### Row-Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Guestbook: Public read, authenticated write
CREATE POLICY "Anyone can view guestbook entries"
ON guestbook_entries FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert entries"
ON guestbook_entries FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Contact: No public access
CREATE POLICY "Only admins can view contact messages"
ON contact_messages FOR SELECT
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Anyone can submit contact forms"
ON contact_messages FOR INSERT
WITH CHECK (true);
```

---

### Validation at Database Level

```sql
-- Check constraints
ALTER TABLE guestbook_entries
ADD CONSTRAINT check_name_length 
CHECK (char_length(name) >= 2 AND char_length(name) <= 50);

ALTER TABLE guestbook_entries
ADD CONSTRAINT check_message_length 
CHECK (char_length(message) >= 10 AND char_length(message) <= 500);

-- Email validation
ALTER TABLE guestbook_entries
ADD CONSTRAINT check_email_format
CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
```

---

## Migration Strategy

### Migration Files

```
supabase/
└── migrations/
    ├── 20260126000001_create_guestbook.sql
    ├── 20260126000002_create_contact_messages.sql
    └── 20260126000003_add_indexes.sql
```

---

### Sample Migration

```sql
-- supabase/migrations/20260126000001_create_guestbook.sql

-- Create guestbook_entries table
CREATE TABLE IF NOT EXISTS guestbook_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add constraints
ALTER TABLE guestbook_entries
ADD CONSTRAINT check_name_length 
CHECK (char_length(name) >= 2 AND char_length(name) <= 50);

ALTER TABLE guestbook_entries
ADD CONSTRAINT check_message_length 
CHECK (char_length(message) >= 10 AND char_length(message) <= 500);

-- Add indexes
CREATE INDEX idx_guestbook_created_at 
ON guestbook_entries(created_at DESC);

-- Enable RLS
ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view guestbook entries"
ON guestbook_entries FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert entries"
ON guestbook_entries FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_guestbook_updated_at
BEFORE UPDATE ON guestbook_entries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## Performance Rules

### 1. Connection Pooling

```typescript
// ✅ CORRECT - Reuse single client instance
// lib/db/client.ts
export const supabase = createClient(url, key)

// Import and use everywhere
import { supabase } from '@/lib/db/client'
```

---

### 2. Query Optimization

```typescript
// ❌ WRONG - N+1 query problem
for (const entry of entries) {
  const user = await getUser(entry.user_id)
}

// ✅ CORRECT - Single query with join
const { data } = await supabase
  .from('guestbook_entries')
  .select(`
    *,
    user:users(name, avatar)
  `)
```

---

### 3. Caching Strategy

```typescript
// Server component with cache
export const revalidate = 60 // Revalidate every 60 seconds

export async function GuestbookPage() {
  const entries = await getGuestbookEntries()
  return <GuestbookList entries={entries} />
}
```

---

## Data Validation

### Double Validation Pattern

```typescript
// 1. Client-side validation (UX)
const schema = z.object({
  name: z.string().min(2).max(50),
  message: z.string().min(10).max(500),
})

// 2. Server-side validation (Security)
export async function createEntry(data: unknown) {
  const validated = schema.safeParse(data)
  if (!validated.success) {
    return { error: 'Invalid data' }
  }
  // Continue...
}

// 3. Database constraints (Last line of defense)
-- Already defined in migration
```

---

## Rate Limiting

### IP-Based Rate Limiting

```typescript
// lib/db/repositories/rate-limit.repository.ts

const RATE_LIMIT = {
  WINDOW: 60 * 60 * 1000, // 1 hour
  MAX_REQUESTS: 5,
}

export async function checkRateLimit(
  ip: string,
  action: string
): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - RATE_LIMIT.WINDOW)
  
  const { count } = await supabase
    .from('rate_limits')
    .select('*', { count: 'exact' })
    .eq('ip', ip)
    .eq('action', action)
    .gte('created_at', windowStart.toISOString())
  
  const requests = count || 0
  const allowed = requests < RATE_LIMIT.MAX_REQUESTS
  const remaining = Math.max(0, RATE_LIMIT.MAX_REQUESTS - requests)
  
  return { allowed, remaining }
}
```

---

## Backup Strategy

### Automated Backups

**Supabase provides:**
- Daily automatic backups (free tier: 7 days retention)
- Point-in-time recovery (paid plans)

**Manual backups:**
```bash
# Export database
npx supabase db dump -f backup.sql

# Restore database
psql -h db.xxx.supabase.co -U postgres -d postgres -f backup.sql
```

---

## Testing Database Code

### Using Test Database

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.TEST_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.TEST_SUPABASE_ANON_KEY,
    },
  },
})
```

---

### Integration Tests

```typescript
// lib/db/repositories/guestbook.repository.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { guestbookRepository } from './guestbook.repository'

describe('GuestbookRepository', () => {
  let testEntryId: string
  
  beforeEach(async () => {
    // Create test entry
    const result = await guestbookRepository.create({
      name: 'Test User',
      message: 'Test message',
    })
    
    if (result.success) {
      testEntryId = result.data.id
    }
  })
  
  afterEach(async () => {
    // Cleanup
    if (testEntryId) {
      await guestbookRepository.delete(testEntryId)
    }
  })
  
  it('fetches all entries', async () => {
    const result = await guestbookRepository.getAll()
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.length).toBeGreaterThan(0)
    }
  })
  
  it('creates new entry', async () => {
    const result = await guestbookRepository.create({
      name: 'New User',
      message: 'New message',
    })
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('New User')
      // Cleanup
      await guestbookRepository.delete(result.data.id)
    }
  })
})
```

---

## Environment Variables

### Required Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# For admin operations (server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

---

### Validation

```typescript
// lib/db/env.ts

import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
})
```

---

## Database Checklist

Before adding new table:

✅ Define schema in migration  
✅ Add constraints and validations  
✅ Create indexes for common queries  
✅ Enable RLS  
✅ Define security policies  
✅ Generate TypeScript types  
✅ Create repository class  
✅ Add service layer  
✅ Write integration tests  
✅ Document usage  

---

## Common Anti-Patterns to Avoid

### ❌ Direct Database Access in Components

```typescript
// ❌ WRONG
export default async function Page() {
  const { data } = await supabase
    .from('guestbook_entries')
    .select('*')
  
  return <List data={data} />
}

// ✅ CORRECT
export default async function Page() {
  const result = await getGuestbookEntries()
  
  if (!result.success) {
    return <Error />
  }
  
  return <List data={result.data} />
}
```

---

### ❌ Ignoring Errors

```typescript
// ❌ WRONG
const { data } = await supabase.from('entries').select('*')
return data // Could be null

// ✅ CORRECT
const { data, error } = await supabase.from('entries').select('*')
if (error) throw error
return data || []
```

---

### ❌ No Pagination

```typescript
// ❌ WRONG - Loading all records
const { data } = await supabase.from('entries').select('*')

// ✅ CORRECT - Paginated
const { data } = await supabase
  .from('entries')
  .select('*')
  .range(0, 9) // First 10 records
```

---

## Status

- **Document Type:** Engineering Standard
- **Status:** ✅ Active (Will be used in Phase 3+)
- **Compliance:** Mandatory when database is added
- **Review:** Before Phase 3 starts