# 02 - System Architecture

## Architecture Status

**Status:** ✅ APPROVED  
**Version:** 1.0.0  
**Last Updated:** 2026-01-26  
**Review Date:** After Phase 2 completion

---

## Architecture Philosophy

This system follows **Clean Architecture** principles with **Feature-Based Organization**.

### Core Principles

1. **Separation of Concerns:** Each layer has a single responsibility
2. **Dependency Rule:** Dependencies point inward, never outward
3. **Framework Independence:** Business logic doesn't depend on frameworks
4. **Testability:** Architecture enables easy testing
5. **Scalability:** System grows without structural changes

---

## System Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │  ← UI Components, Pages
│  (React Components, Server Components)  │
├─────────────────────────────────────────┤
│         Application Layer               │  ← Features, Use Cases
│    (Business Logic, State, Hooks)       │
├─────────────────────────────────────────┤
│         Domain Layer                    │  ← Core Models, Schemas
│    (Types, Interfaces, Validators)      │
├─────────────────────────────────────────┤
│         Infrastructure Layer            │  ← External Concerns
│  (API, Database, File System, Cache)    │
└─────────────────────────────────────────┘
```

---

## Layer Responsibilities

### 1. Presentation Layer (`/src/app`, `/src/components`)

**What it does:**
- Renders UI
- Handles user interactions
- Manages component state
- Server and Client Components

**What it CANNOT do:**
- Direct database access
- Business logic
- Data validation (beyond UI)
- Direct API calls to external services

**Dependencies:**
- ✅ Can import from: Application Layer, Domain Layer
- ❌ Cannot import from: Infrastructure Layer directly

---

### 2. Application Layer (`/src/features`)

**What it does:**
- Implements use cases
- Orchestrates business logic
- Manages feature-specific state
- Custom hooks
- Feature services

**What it CANNOT do:**
- Render UI
- Direct framework coupling
- Hardcoded infrastructure details

**Dependencies:**
- ✅ Can import from: Domain Layer, Infrastructure Layer
- ❌ Cannot import from: Presentation Layer

---

### 3. Domain Layer (`/src/types`, `/src/schemas`)

**What it does:**
- Defines data models
- Type definitions
- Data validation schemas
- Business rules
- Core interfaces

**What it CANNOT do:**
- Import from any other layer
- Depend on frameworks
- Contain implementation details

**Dependencies:**
- ✅ Pure TypeScript/Zod only
- ❌ No imports from other layers

---

### 4. Infrastructure Layer (`/src/lib`)

**What it does:**
- Database connections
- API clients
- File system operations
- Cache management
- External service integrations

**What it CANNOT do:**
- Render UI
- Implement business logic
- Define domain models

**Dependencies:**
- ✅ Can import from: Domain Layer
- ❌ Cannot import from: Application or Presentation Layers

---

## Dependency Flow (CRITICAL)

### ✅ Allowed Import Directions

```
Presentation Layer
    ↓ (can import)
Application Layer
    ↓ (can import)
Domain Layer
    ↑ (can import)
Infrastructure Layer
```

### ❌ Forbidden Import Directions

```
Domain Layer → Any other layer (FORBIDDEN)
Infrastructure Layer → Application Layer (FORBIDDEN)
Infrastructure Layer → Presentation Layer (FORBIDDEN)
Presentation Layer → Infrastructure Layer (FORBIDDEN - must go through Application)
```

---

## Feature-Based Organization

Each feature is self-contained:

```
/src/features/blog
├── components/          # Feature-specific components
├── hooks/              # Feature-specific hooks
├── services/           # Feature business logic
├── schemas/            # Feature validation schemas
├── types/              # Feature types
└── index.ts            # Public API
```

### Feature Rules

1. **Encapsulation:** Features should be independent
2. **Single Responsibility:** One feature = one domain concern
3. **Public API:** Expose only what's needed via index.ts
4. **No Cross-Feature Imports:** Features don't import from each other (use shared/)

---

## Directory Structure (Architectural View)

```
/src
├── /app                    # Presentation Layer
│   ├── /blog              # Blog routes
│   ├── /projects          # Projects routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
│
├── /components            # Presentation Layer (Shared)
│   ├── /ui               # Base UI components
│   └── /shared           # Shared presentational components
│
├── /features             # Application Layer
│   ├── /blog
│   ├── /projects
│   ├── /contact
│   └── /guestbook
│
├── /types                # Domain Layer
│   ├── blog.ts
│   ├── project.ts
│   └── shared.ts
│
├── /schemas              # Domain Layer
│   ├── blog.schema.ts
│   └── project.schema.ts
│
├── /lib                  # Infrastructure Layer
│   ├── /mdx             # MDX processing
│   ├── /db              # Database (future)
│   ├── /api             # API clients
│   └── /utils           # Utilities
│
└── /config               # Configuration
    ├── site.config.ts
    └── seo.config.ts
```

---

## Data Flow Patterns

### 1. Static Content (MDX)

```
MDX Files → MDX Loader (lib) → Blog Service (feature) → Blog Page (app)
```

### 2. Dynamic Features (Future)

```
User Action → Server Action (app) → Feature Service → Database (lib) → Response
```

### 3. Form Handling

```
Form Submit → Validation (schema) → Service (feature) → Database/API (lib)
```

---

## Technology Decisions

### Core Stack

**Framework:** Next.js 15 (App Router)
- **Why:** Server Components, modern React, built-in optimizations
- **Alternative Considered:** Remix, Astro
- **Decision:** Next.js offers best balance of performance and DX

**Language:** TypeScript
- **Why:** Type safety, better DX, catches errors early
- **Alternative:** JavaScript
- **Decision:** Professional projects require TypeScript

**Styling:** Tailwind CSS
- **Why:** Utility-first, fast development, consistent design
- **Alternative:** CSS Modules, Styled Components
- **Decision:** Tailwind is industry standard

**Content:** MDX
- **Why:** Static-first, SEO-friendly, flexible
- **Alternative:** Headless CMS, Database
- **Decision:** MDX for initial phase, database for dynamic features later

**Validation:** Zod
- **Why:** Type-safe validation, excellent DX, runtime safety
- **Alternative:** Yup, Joi
- **Decision:** Zod integrates perfectly with TypeScript

---

## Component Architecture

### Server Components (Default)

```typescript
// app/blog/page.tsx
import { getBlogPosts } from '@/features/blog'

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return <BlogList posts={posts} />
}
```

**When to use:**
- Data fetching
- Static content
- SEO-critical pages

---

### Client Components (When Needed)

```typescript
'use client'

// features/blog/components/BlogSearch.tsx
import { useState } from 'react'

export function BlogSearch() {
  const [query, setQuery] = useState('')
  // Interactive logic here
}
```

**When to use:**
- Interactivity
- Browser APIs
- Event handlers
- State management

---

## State Management

### Local State
- Use React `useState` for component-level state
- Use `useReducer` for complex component state

### Server State
- Server Components for data fetching
- No client-side state management library needed initially

### Form State
- React Hook Form for complex forms
- Native form handling for simple forms

### Future (Phase 3+)
- Consider Zustand for global client state if needed
- Server Actions for mutations

---

## Error Boundaries

```
App Root
  ├── Global Error Boundary
  │   ├── Page Error Boundary
  │   │   └── Feature Error Boundary
```

Each level handles appropriate errors:
- **Global:** App-wide crashes
- **Page:** Route-level errors
- **Feature:** Feature-specific errors

---

## Performance Architecture

### Build-Time Optimization
- Static generation by default
- Dynamic only when necessary
- Image optimization
- Code splitting

### Runtime Optimization
- Component lazy loading
- Route-based code splitting
- Asset optimization

### Measurement
- Core Web Vitals tracking
- Performance budgets enforced
- Regular performance audits

---

## Security Architecture

### Layers of Security

1. **Input Validation:** Zod schemas at entry points
2. **Sanitization:** XSS prevention
3. **Rate Limiting:** API protection (future)
4. **Authentication:** Secure auth flow (future)
5. **Authorization:** Role-based access (future)

---

## Testing Architecture

### Testing Pyramid

```
    /\
   /  \     E2E Tests (Few)
  /____\    
 /      \   Integration Tests (Some)
/________\  Unit Tests (Many)
```

**Unit Tests:**
- Pure functions
- Utilities
- Schemas
- Services

**Integration Tests:**
- Features
- API routes
- Database operations

**E2E Tests:**
- Critical user flows
- Main features
- Purchase/subscription flows (future)

---

## Deployment Architecture

### Environments

1. **Development:** Local machine
2. **Preview:** Vercel preview deployments
3. **Staging:** Pre-production testing (future)
4. **Production:** Live site

### CI/CD Pipeline

```
Code Push → Lint → Type Check → Tests → Build → Deploy
```

All must pass before deployment.

---

## Scalability Strategy

### Phase 1: Static First (Current)
- MDX content
- No database
- Fast, simple, cheap

### Phase 2: Hybrid
- Static + dynamic features
- Database for interactive features
- Server Actions

### Phase 3: Full Dynamic
- User accounts
- Personalization
- Analytics
- Admin panel

### Phase 4: Multi-Tenant (Future SaaS)
- Multiple portfolios
- Subscription management
- Advanced features

**Architecture supports all phases without major rewrites.**

---

## Migration Patterns

### Adding New Features

1. Create feature in `/src/features/feature-name`
2. Define types in feature or `/src/types`
3. Define schemas if needed
4. Implement services
5. Create components
6. Wire up to routes

### Adding Database

1. Setup Supabase
2. Create tables
3. Add db client to `/src/lib/db`
4. Update feature services
5. Add error handling
6. Update types

**No major refactoring needed.**

---

## Architectural Decisions Record (ADR)

### ADR-001: App Router over Pages Router
**Date:** 2026-01-26  
**Status:** Accepted  
**Context:** Next.js 15 supports both  
**Decision:** Use App Router  
**Consequences:** Better performance, React Server Components, modern patterns

### ADR-002: Feature-Based Organization
**Date:** 2026-01-26  
**Status:** Accepted  
**Context:** Need scalable code organization  
**Decision:** Feature-based over layer-based  
**Consequences:** Better encapsulation, clearer boundaries

### ADR-003: Static-First Approach
**Date:** 2026-01-26  
**Status:** Accepted  
**Context:** Performance and SEO critical  
**Decision:** Static generation by default  
**Consequences:** Fast sites, excellent SEO, simple infrastructure

---

## Architecture Validation

This architecture is valid when:

✅ Layers are properly separated  
✅ Dependencies flow correctly  
✅ Features are independent  
✅ Testing is easy  
✅ Performance meets budgets  
✅ Security requirements met  
✅ Changes don't cascade

---

## Review and Evolution

**Review Triggers:**
- After each major phase
- When adding new layer
- When patterns emerge
- Performance issues
- Security concerns

**Evolution Process:**
1. Document problem
2. Propose solution
3. Evaluate alternatives
4. Update architecture
5. Migrate gradually

---

## Status

- **Architecture Type:** Clean Architecture + Feature-Based
- **Status:** ✅ Approved
- **Stability:** Stable (minor refinements expected)
- **Next Review:** After Phase 2