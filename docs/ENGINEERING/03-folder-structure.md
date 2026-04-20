# 03 - Folder Structure

## Document Status

**Status:** ✅ ACTIVE  
**Version:** 1.0.0  
**Last Updated:** 2026-01-26  
**Authority:** Engineering Standards

---

## Purpose

This document defines the **complete folder structure** for the project, the **purpose of each directory**, and the **rules for organizing code**.

**Why this matters:**
- Prevents chaos and disorganization
- Makes code easy to find
- Enforces architectural boundaries
- Enables team scalability
- Supports AI-driven development

---

## Root Structure

```
portfolio-v1/
├── .next/                  # Next.js build output (ignored)
├── node_modules/           # Dependencies (ignored)
├── public/                 # Static assets
├── src/                    # Application source code
├── docs/                   # Documentation OS
├── .env.local              # Local environment variables
├── .env.example            # Environment template
├── .eslintrc.json         # ESLint configuration
├── .gitignore             # Git ignore rules
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies and scripts
├── postcss.config.mjs     # PostCSS configuration
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project readme
```

---

## `/src` Structure (The Core)

```
/src
├── /app                    # Next.js App Router (Presentation Layer)
│   ├── /blog              # Blog routes
│   ├── /projects          # Projects routes
│   ├── /about             # About page
│   ├── /contact           # Contact page
│   ├── /guestbook         # Guestbook page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   ├── error.tsx          # Global error boundary
│   └── not-found.tsx      # 404 page
│
├── /components            # Shared UI Components (Presentation)
│   ├── /ui                # Base components (buttons, inputs, etc)
│   ├── /layout            # Layout components (header, footer, etc)
│   └── /shared            # Reusable business components
│
├── /features              # Feature Modules (Application Layer)
│   ├── /blog
│   │   ├── /components    # Blog-specific components
│   │   ├── /hooks         # Blog-specific hooks
│   │   ├── /services      # Blog business logic
│   │   ├── /types         # Blog types (if not shared)
│   │   ├── /schemas       # Blog validation schemas
│   │   └── index.ts       # Public API
│   │
│   ├── /projects
│   │   ├── /components
│   │   ├── /hooks
│   │   ├── /services
│   │   ├── /types
│   │   ├── /schemas
│   │   └── index.ts
│   │
│   ├── /contact
│   │   ├── /components
│   │   ├── /services
│   │   ├── /schemas
│   │   └── index.ts
│   │
│   └── /guestbook
│       ├── /components
│       ├── /services
│       ├── /schemas
│       └── index.ts
│
├── /types                 # Shared Types (Domain Layer)
│   ├── blog.ts
│   ├── project.ts
│   ├── common.ts
│   └── index.ts
│
├── /schemas               # Shared Validation Schemas (Domain Layer)
│   ├── blog.schema.ts
│   ├── project.schema.ts
│   ├── contact.schema.ts
│   └── index.ts
│
├── /lib                   # Infrastructure Layer
│   ├── /mdx               # MDX processing utilities
│   │   ├── mdx-loader.ts
│   │   ├── mdx-components.tsx
│   │   └── index.ts
│   │
│   ├── /db                # Database (future - Supabase)
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── index.ts
│   │
│   ├── /api               # API clients (future)
│   │   └── index.ts
│   │
│   └── /utils             # Utility functions
│       ├── cn.ts          # Class name utility
│       ├── date.ts        # Date utilities
│       ├── string.ts      # String utilities
│       └── index.ts
│
├── /config                # Configuration Files
│   ├── site.config.ts     # Site metadata
│   └── seo.config.ts      # SEO configuration
│
└── /styles                # Additional styles (if needed)
    └── components.css
```

---

## `/docs` Structure (Documentation OS)

```
/docs
├── /CORE                   # Project foundation
│   ├── 00-project-overview.md
│   ├── 01-project-rules.md (🔒 LOCKED)
│   └── 02-architecture.md
│
├── /ENGINEERING            # Engineering standards
│   ├── 03-folder-structure.md (this file)
│   ├── 04-coding-standards.md
│   ├── 05-error-handling.md
│   ├── 06-testing-strategy.md
│   ├── 07-database-rules.md
│   ├── 08-performance-budget.md
│   └── 09-dependency-management.md
│
├── /AI                     # AI agent control
│   ├── 10-ai-system-overview.md
│   ├── 11-agent-architect.md
│   ├── 12-agent-code.md
│   ├── 13-agent-test.md
│   ├── 14-agent-security.md
│   ├── 15-agent-performance.md
│   ├── 16-agent-doc.md
│   └── 17-agent-deploy.md
│
├── /OPERATIONS             # Operational procedures
│   ├── 18-environment-setup.md
│   ├── 19-security-checklist.md
│   ├── 20-deployment-process.md
│   └── 21-monitoring.md
│
└── /GOVERNANCE             # Project governance
    ├── 22-approval-process.md
    ├── 23-code-review-rules.md
    └── 24-ownership-model.md
```

---

## `/public` Structure

```
/public
├── /images                 # Image assets
│   ├── /blog              # Blog images
│   ├── /projects          # Project images
│   └── /icons             # Icons and logos
│
├── /fonts                  # Custom fonts (if any)
├── favicon.ico
├── robots.txt
└── sitemap.xml            # Generated or static
```

---

## Directory Rules

### 1. `/app` - Presentation Layer Rules

**Purpose:** Next.js routing and page components

**Rules:**
- ✅ Only routing, layouts, and page components
- ✅ Can import from `/components`, `/features`, `/lib`
- ❌ NO business logic here
- ❌ NO direct database access
- ❌ NO data validation logic

**File Naming:**
- `page.tsx` - Route page component
- `layout.tsx` - Layout component
- `loading.tsx` - Loading state
- `error.tsx` - Error boundary
- `not-found.tsx` - 404 page

**Example:**
```typescript
// ✅ CORRECT
import { getBlogPosts } from '@/features/blog'

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return <BlogList posts={posts} />
}

// ❌ WRONG - Business logic in page
export default async function BlogPage() {
  const files = fs.readdirSync('./content')
  const posts = files.map(f => {
    // parsing logic here
  })
  return <BlogList posts={posts} />
}
```

---

### 2. `/components` - Shared UI Rules

**Purpose:** Reusable presentation components

**Subdirectories:**
- `/ui` - Base components (Button, Input, Card, etc.)
- `/layout` - Layout components (Header, Footer, Navigation)
- `/shared` - Shared business components

**Rules:**
- ✅ Pure presentation components
- ✅ Can accept props and render
- ✅ Can use basic hooks (useState, useEffect)
- ❌ NO business logic
- ❌ NO direct API calls
- ❌ NO direct database access

**File Naming:**
- PascalCase for components: `Button.tsx`, `BlogCard.tsx`
- Co-locate styles if component-specific
- One component per file (unless tightly coupled)

**Example:**
```typescript
// components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={/* styles */}
    >
      {children}
    </button>
  )
}
```

---

### 3. `/features` - Application Layer Rules

**Purpose:** Feature modules with business logic

**Structure per feature:**
```
/features/feature-name
├── /components       # Feature-specific components
├── /hooks           # Feature-specific hooks
├── /services        # Business logic
├── /types           # Feature types (if not shared)
├── /schemas         # Validation schemas
└── index.ts         # Public API exports
```

**Rules:**
- ✅ Feature encapsulation
- ✅ Can import from `/lib`, `/types`, `/schemas`
- ✅ Export public API via index.ts
- ❌ NO imports from other features
- ❌ NO circular dependencies

**index.ts Pattern:**
```typescript
// features/blog/index.ts
export { BlogList } from './components/BlogList'
export { useBlogSearch } from './hooks/useBlogSearch'
export { getBlogPosts, getBlogPost } from './services/blog.service'
export type { BlogPost, BlogMeta } from './types'
```

**Service Pattern:**
```typescript
// features/blog/services/blog.service.ts
import { loadMDX } from '@/lib/mdx'
import { BlogPostSchema } from '@/schemas/blog.schema'
import type { BlogPost } from '@/types/blog'

export async function getBlogPosts(): Promise<BlogPost[]> {
  // Business logic here
}
```

---

### 4. `/types` - Domain Layer Rules

**Purpose:** Shared type definitions

**Rules:**
- ✅ Pure TypeScript types and interfaces
- ✅ NO imports from other layers
- ✅ Export via index.ts
- ❌ NO logic or functions
- ❌ NO framework dependencies

**File Naming:**
- Singular: `blog.ts`, `project.ts`, `user.ts`

**Example:**
```typescript
// types/blog.ts
export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  content: string
  tags: string[]
}

export interface BlogMeta {
  slug: string
  title: string
  description: string
  publishedAt: string
}
```

---

### 5. `/schemas` - Validation Layer Rules

**Purpose:** Data validation schemas (Zod)

**Rules:**
- ✅ Use Zod for runtime validation
- ✅ Can reference `/types`
- ✅ Export via index.ts
- ❌ NO business logic

**File Naming:**
- Match type file: `blog.schema.ts`, `project.schema.ts`

**Example:**
```typescript
// schemas/blog.schema.ts
import { z } from 'zod'

export const BlogPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(200),
  publishedAt: z.string().datetime(),
  content: z.string().min(1),
  tags: z.array(z.string()),
})

export type BlogPost = z.infer<typeof BlogPostSchema>
```

---

### 6. `/lib` - Infrastructure Layer Rules

**Purpose:** External integrations and utilities

**Subdirectories:**
- `/mdx` - MDX processing
- `/db` - Database (future)
- `/api` - API clients (future)
- `/utils` - Utility functions

**Rules:**
- ✅ Can import from `/types`, `/schemas`
- ✅ Framework-specific code allowed
- ❌ NO business logic
- ❌ NO UI components

**Example:**
```typescript
// lib/mdx/mdx-loader.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export async function loadMDXFile(slug: string) {
  const filePath = path.join(process.cwd(), 'content', `${slug}.mdx`)
  const source = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(source)
  return { data, content }
}
```

---

### 7. `/config` - Configuration Rules

**Purpose:** Application configuration

**Rules:**
- ✅ Export configuration objects
- ✅ Type-safe configurations
- ❌ NO logic or functions
- ❌ NO secrets (use env variables)

**Example:**
```typescript
// config/site.config.ts
export const siteConfig = {
  name: 'Portfolio Pro',
  description: 'Developer portfolio and blog',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  author: {
    name: 'Abdullah Selim',
    email: '3bdullahselim@gmail.com',
    github: 'Abdollahselim',
  },
}
```

---

## Import Path Rules

### Absolute Imports (✅ Use These)

```typescript
// ✅ CORRECT
import { Button } from '@/components/ui/Button'
import { getBlogPosts } from '@/features/blog'
import { BlogPost } from '@/types/blog'
import { cn } from '@/lib/utils'
```

### Relative Imports (❌ Avoid)

```typescript
// ❌ AVOID
import { Button } from '../../../components/ui/Button'
import { getBlogPosts } from '../../features/blog'
```

**Exception:** Within the same feature, relative imports are acceptable:
```typescript
// features/blog/components/BlogList.tsx
import { useBlogSearch } from '../hooks/useBlogSearch' // ✅ OK
```

---

## Import Direction Rules (CRITICAL)

### ✅ Allowed

```
app/ → components/ ✅
app/ → features/ ✅
app/ → lib/ ✅

features/ → lib/ ✅
features/ → types/ ✅
features/ → schemas/ ✅

lib/ → types/ ✅
lib/ → schemas/ ✅

components/ → types/ ✅
```

### ❌ Forbidden

```
lib/ → features/ ❌
lib/ → components/ ❌
lib/ → app/ ❌

types/ → ANY ❌
schemas/ → ANY (except types) ❌

features/blog → features/projects ❌
```

---

## Naming Conventions

### Files

**Components:**
- PascalCase: `Button.tsx`, `BlogList.tsx`, `ProjectCard.tsx`

**Services/Utilities:**
- camelCase: `blogService.ts`, `dateUtils.ts`, `mdxLoader.ts`

**Types/Schemas:**
- Singular: `blog.ts`, `project.schema.ts`

**Config:**
- kebab-case: `site.config.ts`, `seo.config.ts`

### Folders

- kebab-case: `blog-posts/`, `user-profile/`, `api-client/`
- Exception: Next.js dynamic routes: `[slug]/`, `[id]/`

### Variables

```typescript
// camelCase for variables and functions
const blogPosts = []
function getBlogPost() {}

// PascalCase for components and classes
function BlogCard() {}
class BlogService {}

// UPPER_SNAKE_CASE for constants
const MAX_POSTS_PER_PAGE = 10
const API_BASE_URL = 'https://api.example.com'
```

---

## Co-location Rules

### When to Co-locate

**Components:**
```
/features/blog
├── /components
│   ├── BlogList.tsx
│   └── BlogList.test.tsx   # Test next to component
```

**Styles (if needed):**
```
/components/ui
├── Button.tsx
└── Button.module.css        # Component-specific styles
```

### When NOT to Co-locate

- Shared types → `/types`
- Shared schemas → `/schemas`
- Shared utilities → `/lib/utils`

---

## Content Organization

### Blog Content
```
/content/blog
├── my-first-post.mdx
├── second-post.mdx
└── /images
    ├── post-1-hero.jpg
    └── post-2-diagram.png
```

### Project Case Studies
```
/content/projects
├── ecommerce-platform.mdx
├── task-manager.mdx
└── /images
    └── project-screenshots/
```

---

## Special Files

### Environment Variables

```
.env.local              # Local development (gitignored)
.env.example           # Template (committed)
.env.production        # Production (Vercel)
```

### Configuration Files

```
next.config.ts         # Next.js config
tsconfig.json         # TypeScript config
tailwind.config.ts    # Tailwind config
eslintrc.json         # ESLint rules
```

---

## Scalability Guidelines

### When to Create New Feature

Create new feature when:
- Represents distinct domain concept
- Has its own data models
- Can be developed independently

### When to Add to Existing Feature

Add to existing when:
- Closely related functionality
- Shares same data models
- Tightly coupled behavior

### When to Create Shared Component

Move to `/components` when:
- Used by 3+ features
- Generic and reusable
- Has no business logic

---

## File Size Guidelines

**Maximum file size:**
- Components: ~200 lines
- Services: ~300 lines
- Utilities: ~150 lines

**If exceeded:**
- Split into smaller files
- Extract sub-components
- Refactor into smaller functions

---

## Enforcement

### Automated

```json
// tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Linting

- ESLint rules for import order
- Circular dependency detection
- File naming validation

### Code Review

- Verify structure in PR reviews
- Check import directions
- Validate file placement

---

## Migration Path

### Adding New Feature

1. Create feature folder
2. Add to `/features/feature-name`
3. Create subdirectories as needed
4. Implement services first
5. Build components
6. Wire to routes

### Refactoring Existing Code

1. Identify misplaced files
2. Move to correct location
3. Update imports
4. Test thoroughly
5. Update documentation

---

## Anti-Patterns to Avoid

### ❌ God Folders
```
/utils
├── everything.ts      # 5000 lines
```

### ❌ Circular Dependencies
```
features/blog → features/projects → features/blog
```

### ❌ Deep Nesting
```
/features/blog/components/list/items/card/header/title/text.tsx  # TOO DEEP
```

### ❌ Mixed Concerns
```
/features/blog
├── BlogList.tsx       # Component
├── api-client.ts      # Infrastructure
├── database.ts        # Infrastructure
└── types.ts          # Domain
```

---

## Status

- **Document Type:** Engineering Standard
- **Status:** ✅ Active
- **Compliance:** Mandatory
- **Review:** Quarterly or when patterns emerge