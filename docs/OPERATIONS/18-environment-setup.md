# 18 - Environment Setup

## Document Status

**Status:** ✅ ACTIVE  
**Version:** 1.0.0  
**Last Updated:** 2026-01-26  
**Authority:** Operations Standards

---

## Purpose

This document defines **how to set up development, staging, and production environments** for this project. Proper environment management is critical for security and reliability.

**Why this matters:**
- Security: Secrets stay secret
- Reliability: Consistent configuration
- Debugging: Clear separation of environments
- Collaboration: Easy onboarding

---

## Environments

### Development (Local)

**Purpose:** Local development on developer machines

**Characteristics:**
- Hot reload enabled
- Debug mode on
- Detailed error messages
- No caching
- Local database (if needed)

**URL:** `http://localhost:3000`

---

### Preview (Vercel)

**Purpose:** Test features before production

**Characteristics:**
- Production-like environment
- Safe for testing
- Unique URL per branch
- Temporary deployment

**URL:** `https://portfolio-v1-git-[branch]-[user].vercel.app`

---

### Production (Vercel)

**Purpose:** Live site for users

**Characteristics:**
- Optimized builds
- Caching enabled
- Error tracking
- Analytics enabled
- Performance monitoring

**URL:** `https://yourdomain.com`

---

## Environment Variables

### Required Variables

#### Development (.env.local)

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Portfolio Pro"

# Database (Phase 3+)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Analytics (Production only)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Email (Phase 3+)
# EMAIL_SERVER_HOST=smtp.example.com
# EMAIL_SERVER_PORT=587
# EMAIL_SERVER_USER=user@example.com
# EMAIL_SERVER_PASSWORD=password
# EMAIL_FROM=noreply@example.com
```

---

#### Production (Vercel)

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME="Portfolio Pro"

# Database (Phase 3+)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Error Tracking (Phase 4+)
SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=xxx

# Email (Phase 3+)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=user@example.com
EMAIL_SERVER_PASSWORD=password
EMAIL_FROM=noreply@yourdomain.com
```

---

### Environment Variable Template

**.env.example:**
```bash
# ===========================================
# ENVIRONMENT VARIABLES TEMPLATE
# ===========================================
# Copy this file to .env.local and fill in the values
# DO NOT commit .env.local to version control

# -----------------
# Site Configuration
# -----------------
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Portfolio Pro"

# -----------------
# Database (Optional - Phase 3+)
# -----------------
# Get these from https://supabase.com
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=

# -----------------
# Analytics (Optional)
# -----------------
# NEXT_PUBLIC_GA_ID=

# -----------------
# Email (Optional - Phase 3+)
# -----------------
# EMAIL_SERVER_HOST=
# EMAIL_SERVER_PORT=
# EMAIL_SERVER_USER=
# EMAIL_SERVER_PASSWORD=
# EMAIL_FROM=
```

---

## Environment Variable Validation

### Runtime Validation

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  // Public variables (exposed to client)
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SITE_NAME: z.string().min(1),
  
  // Database (optional for now)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  
  // Server-only variables
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NODE_ENV: process.env.NODE_ENV,
})

// Type-safe access
export type Env = z.infer<typeof envSchema>
```

---

## Setup Instructions

### Initial Setup

**Step 1: Clone Repository**
```bash
git clone https://github.com/yourusername/portfolio-v1.git
cd portfolio-v1
```

**Step 2: Install Dependencies**
```bash
npm install
```

**Step 3: Setup Environment Variables**
```bash
# Copy template
cp .env.example .env.local

# Edit .env.local with your values
# Use your favorite editor
code .env.local
```

**Step 4: Run Development Server**
```bash
npm run dev
```

**Step 5: Verify Setup**
- Open http://localhost:3000
- Check no errors in console
- Verify site loads correctly

---

### Database Setup (Phase 3+)

**Step 1: Create Supabase Project**
1. Go to https://supabase.com
2. Create new project
3. Wait for project provisioning

**Step 2: Get Credentials**
1. Go to Project Settings → API
2. Copy Project URL
3. Copy anon public key
4. Copy service_role key (keep secret!)

**Step 3: Add to .env.local**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

**Step 4: Run Migrations**
```bash
# Apply database migrations
npx supabase db push

# Or if using migration files
npx supabase migration up
```

---

## Vercel Deployment Setup

### Initial Deployment

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Login to Vercel**
```bash
vercel login
```

**Step 3: Link Project**
```bash
vercel link
```

**Step 4: Add Environment Variables**
```bash
# Add production environment variables
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# ... add all required variables
```

**Step 5: Deploy**
```bash
# Deploy to production
vercel --prod
```

---

### Environment Variables in Vercel

**Via Vercel Dashboard:**
1. Go to project settings
2. Navigate to Environment Variables
3. Add variables one by one
4. Select environments (Production, Preview, Development)

**Via CLI:**
```bash
# Add variable to production
vercel env add VARIABLE_NAME production

# Add variable to all environments
vercel env add VARIABLE_NAME

# List all variables
vercel env ls

# Remove variable
vercel env rm VARIABLE_NAME production
```

---

## Configuration Files

### Next.js Config

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // React strict mode
  reactStrictMode: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-supabase-project.supabase.co',
      },
    ],
  },
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
}

export default nextConfig
```

---

### TypeScript Config

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    },
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Development Workflow

### Daily Development

```bash
# Pull latest changes
git pull origin main

# Install/update dependencies
npm install

# Start development server
npm run dev

# Run in separate terminals:
npm run type-check  # TypeScript checking
npm test -- --watch # Tests in watch mode
```

---

### Before Committing

```bash
# Run all checks
npm run lint        # ESLint
npm run type-check  # TypeScript
npm test           # Tests
npm run build      # Build check
```

---

## Environment-Specific Behavior

### Development Mode

```typescript
// Show detailed errors
if (process.env.NODE_ENV === 'development') {
  console.log('Detailed error:', error)
}

// Enable debug features
const enableDebug = process.env.NODE_ENV === 'development'
```

---

### Production Mode

```typescript
// Generic error messages
if (process.env.NODE_ENV === 'production') {
  console.error('Error occurred')
  // Log to error tracking service
}

// Disable debug features
const enableDebug = false
```

---

## Troubleshooting

### Common Issues

**Issue: Environment variables not loading**

Solution:
```bash
# Restart dev server
# Environment variables are loaded at startup

# Verify .env.local exists
ls -la .env.local

# Check for typos in variable names
# Must start with NEXT_PUBLIC_ for client access
```

---

**Issue: Build fails locally**

Solution:
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install

# Try building again
npm run build
```

---

**Issue: Different behavior local vs production**

Solution:
```bash
# Test production build locally
npm run build
npm start

# This runs production mode locally
```

---

## Security Best Practices

### Environment Variables

**DO:**
✅ Use .env.local for local development  
✅ Add .env.local to .gitignore  
✅ Use NEXT_PUBLIC_ prefix for client-exposed vars  
✅ Validate environment variables at runtime  
✅ Rotate secrets regularly  

**DON'T:**
❌ Commit .env.local to git  
❌ Expose server secrets to client  
❌ Hardcode secrets in code  
❌ Share production credentials  
❌ Use same secrets across environments  

---

### Secret Management

```typescript
// ❌ WRONG - Exposed to client
const apiKey = process.env.API_KEY

// ✅ CORRECT - Server-only
// Only import in server components or API routes
import { env } from '@/lib/env'
const apiKey = env.SUPABASE_SERVICE_ROLE_KEY
```

---

## Environment Checklist

### Development Environment

✅ Node.js 20+ installed  
✅ npm installed  
✅ Git configured  
✅ .env.local created  
✅ Dependencies installed  
✅ Development server runs  
✅ No console errors  

### Production Environment

✅ Vercel project created  
✅ Domain configured  
✅ SSL certificate active  
✅ Environment variables set  
✅ Build succeeds  
✅ Deployment works  
✅ Analytics configured  

---

## Status

- **Document Type:** Operations Standard
- **Status:** ✅ Active
- **Compliance:** Mandatory
- **Review:** When adding new environment variables