# 04 - Coding Standards

## Document Status

**Status:** ✅ ACTIVE  
**Version:** 1.0.0  
**Last Updated:** 2026-01-26  
**Authority:** Engineering Standards

---

## Purpose

This document defines **how we write code** in this project. Not guidelines or suggestions—**mandatory standards** that every line of code must follow.

**Why this matters:**
- Code consistency across the entire project
- Easier code reviews and maintenance
- Reduced bugs from unclear patterns
- Better collaboration (human + AI)
- Professional-grade codebase

---

## Core Principles

### 1. Clarity Over Cleverness

```typescript
// ❌ WRONG - Too clever
const x = a?.b?.c ?? d || e

// ✅ CORRECT - Clear and explicit
const value = data?.user?.profile ?? defaultProfile
```

**Rule:** If you need to explain how it works, it's too clever.

---

### 2. Explicit Over Implicit

```typescript
// ❌ WRONG - Implicit behavior
function update(data: any) {
  // What does this update?
}

// ✅ CORRECT - Explicit intent
function updateBlogPost(postId: string, data: BlogPostUpdate) {
  // Clear purpose
}
```

**Rule:** Function names must describe exactly what they do.

---

### 3. Type Safety First

```typescript
// ❌ WRONG
const data: any = await fetch('/api/posts')

// ✅ CORRECT
const data: BlogPost[] = await fetch('/api/posts').then(res => res.json())

// ✅ BETTER
const response = await fetch('/api/posts')
const data = BlogPostSchema.array().parse(await response.json())
```

**Rule:** NO `any` types. Use proper types or `unknown` with type guards.

---

### 4. Error Handling is Not Optional

```typescript
// ❌ WRONG
async function getBlogPost(slug: string) {
  const post = await loadMDX(slug)
  return post
}

// ✅ CORRECT
async function getBlogPost(slug: string): Promise<Result<BlogPost>> {
  try {
    const post = await loadMDX(slug)
    return { success: true, data: post }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
```

**Rule:** Every function that can fail must handle errors explicitly.

---

## TypeScript Standards

### Type Definitions

**Use `interface` for object shapes:**
```typescript
// ✅ CORRECT
interface BlogPost {
  slug: string
  title: string
  content: string
}
```

**Use `type` for unions, intersections, utilities:**
```typescript
// ✅ CORRECT
type Status = 'draft' | 'published' | 'archived'
type BlogPostWithAuthor = BlogPost & { author: Author }
```

---

### No `any` - Ever

```typescript
// ❌ FORBIDDEN
function process(data: any) {}

// ✅ CORRECT - Use proper types
function process(data: BlogPost) {}

// ✅ CORRECT - If truly unknown
function process(data: unknown) {
  if (isValidData(data)) {
    // Now TypeScript knows the type
  }
}
```

---

### Use Strict Type Checking

**tsconfig.json must have:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

### Prefer `const` Over `let`

```typescript
// ❌ WRONG
let posts = []
posts = await getBlogPosts()

// ✅ CORRECT
const posts = await getBlogPosts()
```

**Rule:** Use `const` by default. Only use `let` when reassignment is necessary.

---

### Function Return Types

```typescript
// ❌ WRONG - No return type
async function getBlogPosts() {
  return await loadAllPosts()
}

// ✅ CORRECT - Explicit return type
async function getBlogPosts(): Promise<BlogPost[]> {
  return await loadAllPosts()
}
```

**Rule:** Always specify return types for functions.

---

## React Standards

### Component Structure

```typescript
// ✅ STANDARD STRUCTURE

// 1. Imports (grouped)
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useBlogSearch } from '@/features/blog'
import type { BlogPost } from '@/types/blog'

// 2. Type definitions
interface BlogListProps {
  posts: BlogPost[]
  showSearch?: boolean
}

// 3. Component
export function BlogList({ posts, showSearch = false }: BlogListProps) {
  // 4. Hooks (at the top)
  const [query, setQuery] = useState('')
  const { filteredPosts } = useBlogSearch(posts, query)
  
  // 5. Event handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }
  
  // 6. Render
  return (
    <div>
      {showSearch && <input onChange={handleSearch} />}
      {filteredPosts.map(post => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
```

---

### Server Components (Default)

```typescript
// app/blog/page.tsx
// ✅ No 'use client' = Server Component by default

import { getBlogPosts } from '@/features/blog'

export default async function BlogPage() {
  const posts = await getBlogPosts()
  
  return (
    <main>
      <h1>Blog</h1>
      <BlogList posts={posts} />
    </main>
  )
}
```

**Rule:** Server Components by default. Only add `'use client'` when needed.

---

### Client Components (When Needed)

```typescript
'use client'

// ✅ Use when you need:
// - Interactivity (onClick, onChange)
// - React hooks (useState, useEffect)
// - Browser APIs (localStorage, window)

import { useState } from 'react'

export function BlogSearch() {
  const [query, setQuery] = useState('')
  
  return (
    <input 
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}
```

**When to use `'use client'`:**
- Event handlers
- React hooks
- Browser APIs
- Third-party libraries that use client features

---

### Props Interface Naming

```typescript
// ✅ CORRECT - Props suffix
interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  // ...
}
```

---

### Component Export Pattern

```typescript
// ❌ WRONG
export default function BlogCard() {}

// ✅ CORRECT - Named exports
export function BlogCard() {}

// ✅ EXCEPTION - Page components (Next.js requirement)
// app/blog/page.tsx
export default function BlogPage() {}
```

**Rule:** Use named exports for components, except Next.js pages.

---

### Conditional Rendering

```typescript
// ❌ WRONG - Nested ternaries
{isLoading ? <Spinner /> : error ? <Error /> : <Content />}

// ✅ CORRECT - Early returns
if (isLoading) return <Spinner />
if (error) return <Error />
return <Content />

// ✅ CORRECT - Clear conditions
{isLoading && <Spinner />}
{error && <Error message={error} />}
{!isLoading && !error && <Content />}
```

---

## Async/Await Standards

### Always Use Try-Catch

```typescript
// ❌ WRONG
async function loadData() {
  const data = await fetch('/api/data')
  return data
}

// ✅ CORRECT
async function loadData(): Promise<Result<Data>> {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
```

---

### Result Type Pattern

```typescript
// Define in /types/common.ts
export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

// Usage
async function getBlogPost(slug: string): Promise<Result<BlogPost>> {
  try {
    const post = await loadMDX(slug)
    return { success: true, data: post }
  } catch (error) {
    return { 
      success: false, 
      error: 'Failed to load blog post' 
    }
  }
}

// Calling code
const result = await getBlogPost('my-post')
if (result.success) {
  console.log(result.data.title)
} else {
  console.error(result.error)
}
```

---

## Naming Conventions

### Variables

```typescript
// ✅ CORRECT - Descriptive camelCase
const blogPosts = []
const currentUser = {}
const isAuthenticated = false
const hasMorePosts = true

// ❌ WRONG - Unclear abbreviations
const bp = []
const usr = {}
const auth = false
```

---

### Functions

```typescript
// ✅ CORRECT - Verb + Noun
function getBlogPost() {}
function createUser() {}
function updateProfile() {}
function deleteDraft() {}
function validateEmail() {}
function formatDate() {}

// ❌ WRONG - Unclear purpose
function blog() {}
function handle() {}
function process() {}
```

---

### Boolean Variables

```typescript
// ✅ CORRECT - is/has/should prefix
const isLoading = false
const hasError = false
const shouldShowModal = true
const canEdit = false

// ❌ WRONG
const loading = false
const error = false
const modal = true
```

---

### Constants

```typescript
// ✅ CORRECT - UPPER_SNAKE_CASE
const MAX_POSTS_PER_PAGE = 10
const API_BASE_URL = 'https://api.example.com'
const DEFAULT_TIMEOUT = 5000

// ❌ WRONG
const maxPostsPerPage = 10
const apiBaseUrl = 'https://api.example.com'
```

---

## Code Organization

### File Structure

```typescript
// ✅ CORRECT ORDER

// 1. Imports - External libraries first
import { useState } from 'react'
import { z } from 'zod'

// 2. Internal imports - grouped by layer
import { Button } from '@/components/ui/Button'
import { getBlogPosts } from '@/features/blog'
import type { BlogPost } from '@/types/blog'

// 3. Types and interfaces
interface ComponentProps {
  // ...
}

// 4. Constants
const MAX_ITEMS = 10

// 5. Helper functions
function formatDate(date: string) {
  // ...
}

// 6. Main component/function
export function Component() {
  // ...
}
```

---

### Function Length

```typescript
// ❌ TOO LONG - Over 50 lines
function processData() {
  // 100 lines of logic
}

// ✅ CORRECT - Break into smaller functions
function processData() {
  const validated = validateData()
  const transformed = transformData(validated)
  const result = saveData(transformed)
  return result
}

function validateData() {
  // validation logic
}

function transformData(data: ValidatedData) {
  // transformation logic
}

function saveData(data: TransformedData) {
  // save logic
}
```

**Rule:** Functions should be under 50 lines. If longer, refactor.

---

## Comments and Documentation

### When to Comment

```typescript
// ✅ GOOD - Explain WHY, not WHAT
// Using setTimeout instead of setInterval to prevent overlapping calls
setTimeout(checkStatus, 5000)

// ❌ BAD - Obvious comment
// Set x to 5
const x = 5
```

---

### JSDoc for Public APIs

```typescript
/**
 * Retrieves all published blog posts sorted by date
 * 
 * @returns Array of blog posts or empty array if none found
 * @throws {Error} If unable to read content directory
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  // implementation
}
```

---

### TODO Comments

```typescript
// TODO: Add pagination support
// TODO: Optimize query performance
// FIXME: Handle edge case when posts array is empty
// NOTE: This function will be deprecated in v2
```

---

## Error Handling Patterns

### Custom Error Types

```typescript
// lib/errors.ts
export class BlogNotFoundError extends Error {
  constructor(slug: string) {
    super(`Blog post not found: ${slug}`)
    this.name = 'BlogNotFoundError'
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
```

---

### Error Handling in Services

```typescript
// features/blog/services/blog.service.ts
export async function getBlogPost(slug: string): Promise<Result<BlogPost>> {
  try {
    // Validate input
    if (!slug || slug.trim() === '') {
      throw new ValidationError('Slug is required')
    }
    
    // Load data
    const post = await loadMDX(slug)
    
    if (!post) {
      throw new BlogNotFoundError(slug)
    }
    
    // Validate output
    const validated = BlogPostSchema.parse(post)
    
    return { success: true, data: validated }
    
  } catch (error) {
    // Log error (in production)
    console.error('Error loading blog post:', error)
    
    // Return user-friendly error
    if (error instanceof BlogNotFoundError) {
      return { success: false, error: 'Blog post not found' }
    }
    
    if (error instanceof ValidationError) {
      return { success: false, error: error.message }
    }
    
    return { success: false, error: 'Failed to load blog post' }
  }
}
```

---

## Performance Standards

### Avoid Unnecessary Re-renders

```typescript
// ❌ WRONG - Creates new function on every render
function Component() {
  return <button onClick={() => console.log('click')}>Click</button>
}

// ✅ CORRECT - Stable function reference
function Component() {
  const handleClick = () => console.log('click')
  return <button onClick={handleClick}>Click</button>
}

// ✅ BETTER - useCallback for expensive operations
function Component() {
  const handleClick = useCallback(() => {
    // expensive operation
  }, [])
  return <button onClick={handleClick}>Click</button>
}
```

---

### Lazy Loading

```typescript
// ✅ CORRECT - Lazy load heavy components
import { lazy } from 'react'

const HeavyChart = lazy(() => import('./components/HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}
```

---

### Image Optimization

```typescript
// ❌ WRONG
<img src="/images/hero.jpg" alt="Hero" />

// ✅ CORRECT - Use Next.js Image
import Image from 'next/image'

<Image 
  src="/images/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
/>
```

---

## Testing Standards

### Test File Naming

```
BlogCard.tsx
BlogCard.test.tsx    ✅ CORRECT

blog.service.ts
blog.service.test.ts ✅ CORRECT
```

---

### Test Structure

```typescript
// BlogCard.test.tsx
import { render, screen } from '@testing-library/react'
import { BlogCard } from './BlogCard'

describe('BlogCard', () => {
  const mockPost = {
    slug: 'test-post',
    title: 'Test Post',
    description: 'Test description',
    publishedAt: '2026-01-26',
  }
  
  it('renders post title', () => {
    render(<BlogCard post={mockPost} />)
    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })
  
  it('renders post description', () => {
    render(<BlogCard post={mockPost} />)
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })
})
```

---

## Code Smells to Avoid

### 1. Magic Numbers

```typescript
// ❌ WRONG
if (posts.length > 10) {}

// ✅ CORRECT
const MAX_POSTS_PER_PAGE = 10
if (posts.length > MAX_POSTS_PER_PAGE) {}
```

---

### 2. Deep Nesting

```typescript
// ❌ WRONG
if (user) {
  if (user.posts) {
    if (user.posts.length > 0) {
      if (user.posts[0].published) {
        // do something
      }
    }
  }
}

// ✅ CORRECT - Early returns
if (!user) return
if (!user.posts || user.posts.length === 0) return
if (!user.posts[0].published) return

// do something
```

---

### 3. Long Parameter Lists

```typescript
// ❌ WRONG
function createPost(title, description, content, author, date, tags, featured) {}

// ✅ CORRECT - Use object parameter
interface CreatePostParams {
  title: string
  description: string
  content: string
  author: string
  date: string
  tags: string[]
  featured?: boolean
}

function createPost(params: CreatePostParams) {}
```

---

## Git Commit Standards

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

**Examples:**
```
feat(blog): add MDX rendering support

fix(projects): correct image loading issue

docs(readme): update setup instructions

refactor(blog): extract post loading logic
```

---

## ESLint Configuration

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

---

## Code Review Checklist

Before submitting code for review:

✅ TypeScript strict mode passing  
✅ No `any` types  
✅ Error handling implemented  
✅ Tests written and passing  
✅ ESLint warnings resolved  
✅ Performance impact considered  
✅ Documentation updated  
✅ Commit messages follow standards  

---

## Enforcement

### Automated
- ESLint on pre-commit (Husky)
- TypeScript in CI/CD
- Prettier for formatting

### Manual
- Code reviews
- Pair programming
- Architecture reviews

### Consequences
- First violation: Educational
- Repeated violations: Mandatory rewrite
- Systematic violations: Process review

---

## Status

- **Document Type:** Engineering Standard
- **Status:** ✅ Active
- **Compliance:** Mandatory
- **Review:** Quarterly