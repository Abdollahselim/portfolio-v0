# 05 - Error Handling Standards

## Document Status

**Status:** ✅ ACTIVE  
**Version:** 1.0.0  
**Last Updated:** 2026-01-26  
**Authority:** Engineering Standards

---

## Purpose

This document defines **how we handle errors** at every layer of the application. Proper error handling is not optional—it's a **fundamental requirement** for production-grade software.

**Why this matters:**
- User experience: Users never see technical errors
- Debugging: Clear error messages speed up debugging
- Reliability: Graceful degradation instead of crashes
- Monitoring: Trackable errors for improvement
- Security: Don't expose sensitive information

---

## Core Principles

### 1. Never Fail Silently

```typescript
// ❌ WRONG - Silent failure
try {
  await saveData()
} catch (error) {
  // Nothing happens - user has no idea something failed
}

// ✅ CORRECT - Explicit handling
try {
  await saveData()
} catch (error) {
  console.error('Failed to save data:', error)
  showErrorToast('Unable to save. Please try again.')
}
```

**Rule:** Every error must be handled explicitly, logged, and communicated.

---

### 2. User-Friendly Messages

```typescript
// ❌ WRONG - Technical error to user
catch (error) {
  alert('Error: ENOENT: no such file or directory')
}

// ✅ CORRECT - User-friendly message
catch (error) {
  alert('We couldn\'t find that blog post. Please try another.')
}
```

**Rule:** Never show technical error messages to users.

---

### 3. Fail Fast, Recover Gracefully

```typescript
// ✅ CORRECT - Validate early
function updatePost(slug: string, data: unknown) {
  // Fail fast
  if (!slug) throw new ValidationError('Slug is required')
  
  // Validate data structure
  const validated = PostSchema.parse(data)
  
  // Now proceed with confidence
  return savePost(slug, validated)
}
```

**Rule:** Validate inputs immediately, fail with clear errors.

---

### 4. Layer-Appropriate Error Handling

```typescript
// Infrastructure Layer - Technical errors
throw new DatabaseConnectionError('Unable to connect to database')

// Application Layer - Business errors  
throw new PostNotFoundError('Blog post not found')

// Presentation Layer - User errors
return <ErrorMessage>Unable to load blog post. Please try again.</ErrorMessage>
```

**Rule:** Each layer handles errors at its appropriate abstraction level.

---

## Error Types Hierarchy

### Base Error Types

```typescript
// lib/errors/base.ts

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
```

---

### Domain-Specific Errors

```typescript
// lib/errors/domain.ts

// 400 - Bad Request
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400)
  }
}

// 404 - Not Found
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404)
  }
}

// 401 - Unauthorized
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401)
  }
}

// 403 - Forbidden
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN', 403)
  }
}

// 409 - Conflict
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409)
  }
}

// 500 - Internal Server Error
export class InternalError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 'INTERNAL_ERROR', 500)
  }
}
```

---

### Feature-Specific Errors

```typescript
// features/blog/errors.ts

export class BlogNotFoundError extends NotFoundError {
  constructor(slug: string) {
    super(`Blog post "${slug}"`)
  }
}

export class InvalidBlogDataError extends ValidationError {
  constructor(field: string) {
    super(`Invalid blog data: ${field}`)
  }
}

// features/projects/errors.ts

export class ProjectNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Project "${id}"`)
  }
}
```

---

## Result Type Pattern

### Standard Result Type

```typescript
// types/common.ts

export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E }

// With error details
export type DetailedResult<T> =
  | { success: true; data: T }
  | { 
      success: false
      error: string
      code: string
      details?: unknown
    }
```

---

### Usage in Services

```typescript
// features/blog/services/blog.service.ts

export async function getBlogPost(slug: string): Promise<Result<BlogPost>> {
  try {
    // Validate input
    if (!slug || slug.trim() === '') {
      return {
        success: false,
        error: 'Blog post slug is required'
      }
    }
    
    // Load and parse
    const post = await loadMDXPost(slug)
    
    if (!post) {
      return {
        success: false,
        error: 'Blog post not found'
      }
    }
    
    // Validate structure
    const validated = BlogPostSchema.safeParse(post)
    
    if (!validated.success) {
      return {
        success: false,
        error: 'Invalid blog post data'
      }
    }
    
    return {
      success: true,
      data: validated.data
    }
    
  } catch (error) {
    console.error('Error loading blog post:', error)
    return {
      success: false,
      error: 'Failed to load blog post'
    }
  }
}
```

---

## Error Handling by Layer

### 1. Infrastructure Layer (`/lib`)

**Responsibility:** Handle technical failures

```typescript
// lib/mdx/mdx-loader.ts

export async function loadMDXFile(
  slug: string
): Promise<Result<{ data: unknown; content: string }>> {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
    
    // Check file exists
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        error: `File not found: ${slug}`
      }
    }
    
    const source = await fs.promises.readFile(filePath, 'utf-8')
    const { data, content } = matter(source)
    
    return {
      success: true,
      data: { data, content }
    }
    
  } catch (error) {
    // Log technical error
    console.error('MDX loading error:', error)
    
    return {
      success: false,
      error: 'Failed to load MDX file'
    }
  }
}
```

**Rules:**
- ✅ Return Result types
- ✅ Log technical details
- ✅ Return generic error messages
- ❌ Never expose file paths or technical details

---

### 2. Application Layer (`/features`)

**Responsibility:** Handle business logic errors

```typescript
// features/blog/services/blog.service.ts

export async function getBlogPosts(
  options?: {
    limit?: number
    tag?: string
  }
): Promise<Result<BlogPost[]>> {
  try {
    // Load all posts
    const result = await loadAllMDXPosts()
    
    if (!result.success) {
      return {
        success: false,
        error: 'Unable to load blog posts'
      }
    }
    
    let posts = result.data
    
    // Filter by tag if provided
    if (options?.tag) {
      posts = posts.filter(post => post.tags?.includes(options.tag))
    }
    
    // Apply limit if provided
    if (options?.limit) {
      posts = posts.slice(0, options.limit)
    }
    
    // Sort by date
    posts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    
    return {
      success: true,
      data: posts
    }
    
  } catch (error) {
    console.error('Error getting blog posts:', error)
    return {
      success: false,
      error: 'Failed to retrieve blog posts'
    }
  }
}
```

**Rules:**
- ✅ Validate business logic
- ✅ Handle upstream errors
- ✅ Return meaningful error messages
- ✅ Log errors for debugging

---

### 3. Presentation Layer (`/app`, `/components`)

**Responsibility:** Display errors to users

#### Server Components

```typescript
// app/blog/[slug]/page.tsx

export default async function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const result = await getBlogPost(params.slug)
  
  // Handle error
  if (!result.success) {
    return (
      <div className="container py-12">
        <ErrorMessage 
          title="Post Not Found"
          message="We couldn't find the blog post you're looking for."
          action={{
            label: "View All Posts",
            href: "/blog"
          }}
        />
      </div>
    )
  }
  
  // Render success
  return <BlogPostContent post={result.data} />
}
```

#### Client Components

```typescript
'use client'

// features/contact/components/ContactForm.tsx

export function ContactForm() {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const result = await submitContactForm(formData)
      
      if (!result.success) {
        setError(result.error)
        return
      }
      
      // Success handling
      showSuccessToast('Message sent successfully!')
      e.currentTarget.reset()
      
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Form fields */}
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
```

**Rules:**
- ✅ Show user-friendly error messages
- ✅ Provide recovery actions
- ✅ Never show stack traces
- ✅ Handle loading states

---

## Error Boundaries

### Global Error Boundary

```typescript
// app/error.tsx

'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Global error:', error)
  }, [error])
  
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6">
              We're sorry, but something unexpected happened.
            </p>
            <button
              onClick={reset}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
```

---

### Feature Error Boundary

```typescript
// features/blog/components/BlogErrorBoundary.tsx

'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class BlogErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Blog error:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Unable to Load Blog
          </h3>
          <p className="text-sm text-muted-foreground">
            We encountered an error while loading the blog content.
          </p>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

---

## Validation Errors (Zod)

### Schema Validation

```typescript
// schemas/contact.schema.ts

import { z } from 'zod'

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  
  email: z
    .string()
    .email('Please enter a valid email address'),
  
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
})

export type ContactFormData = z.infer<typeof ContactFormSchema>
```

---

### Handling Validation Errors

```typescript
// features/contact/services/contact.service.ts

export async function submitContactForm(
  data: unknown
): Promise<Result<void>> {
  try {
    // Validate input
    const validated = ContactFormSchema.safeParse(data)
    
    if (!validated.success) {
      const errors = validated.error.flatten().fieldErrors
      const firstError = Object.values(errors)[0]?.[0]
      
      return {
        success: false,
        error: firstError || 'Invalid form data'
      }
    }
    
    // Process validated data
    await sendEmail(validated.data)
    
    return { success: true, data: undefined }
    
  } catch (error) {
    console.error('Contact form error:', error)
    return {
      success: false,
      error: 'Failed to send message'
    }
  }
}
```

---

## API Error Handling

### Server Actions

```typescript
// app/actions/contact.ts

'use server'

import { submitContactForm } from '@/features/contact'
import { revalidatePath } from 'next/cache'

export async function submitContactAction(formData: FormData) {
  try {
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    }
    
    const result = await submitContactForm(data)
    
    if (!result.success) {
      return {
        success: false,
        error: result.error
      }
    }
    
    revalidatePath('/contact')
    
    return {
      success: true,
      message: 'Message sent successfully'
    }
    
  } catch (error) {
    console.error('Server action error:', error)
    return {
      success: false,
      error: 'Something went wrong'
    }
  }
}
```

---

### API Routes (Future)

```typescript
// app/api/posts/route.ts

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag')
    
    const result = await getBlogPosts({ tag: tag || undefined })
    
    if (!result.success) {
      return Response.json(
        { error: result.error },
        { status: 500 }
      )
    }
    
    return Response.json(result.data)
    
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Error Logging

### Development Logging

```typescript
// lib/logger/logger.ts

export const logger = {
  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${message}`, error)
  },
  
  warn: (message: string, data?: unknown) => {
    console.warn(`[WARN] ${message}`, data)
  },
  
  info: (message: string, data?: unknown) => {
    console.info(`[INFO] ${message}`, data)
  },
}
```

---

### Production Logging (Future)

```typescript
// lib/logger/logger.ts

import * as Sentry from '@sentry/nextjs'

export const logger = {
  error: (message: string, error?: unknown) => {
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error, {
        extra: { message }
      })
    } else {
      console.error(`[ERROR] ${message}`, error)
    }
  },
  
  warn: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureMessage(message, {
        level: 'warning',
        extra: data
      })
    } else {
      console.warn(`[WARN] ${message}`, data)
    }
  },
}
```

---

## Error Messages Guide

### User-Facing Messages

```typescript
// config/error-messages.ts

export const ERROR_MESSAGES = {
  // Generic
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  
  // Blog
  BLOG_NOT_FOUND: 'Blog post not found.',
  BLOG_LOAD_FAILED: 'Unable to load blog posts.',
  
  // Projects
  PROJECT_NOT_FOUND: 'Project not found.',
  PROJECT_LOAD_FAILED: 'Unable to load projects.',
  
  // Contact
  CONTACT_SEND_FAILED: 'Failed to send message. Please try again.',
  CONTACT_INVALID_EMAIL: 'Please enter a valid email address.',
  
  // Validation
  REQUIRED_FIELD: 'This field is required.',
  INVALID_FORMAT: 'Invalid format.',
} as const
```

---

## Error Monitoring Strategy

### Phase 1: Console Logging
```typescript
console.error('Error:', error)
```

### Phase 2: Structured Logging
```typescript
logger.error('Failed to load post', {
  slug,
  error: error instanceof Error ? error.message : 'Unknown'
})
```

### Phase 3: Error Tracking Service
```typescript
Sentry.captureException(error, {
  tags: { feature: 'blog' },
  extra: { slug }
})
```

---

## Testing Error Handling

### Unit Tests

```typescript
// features/blog/services/blog.service.test.ts

describe('getBlogPost', () => {
  it('returns error for invalid slug', async () => {
    const result = await getBlogPost('')
    
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Blog post slug is required')
    }
  })
  
  it('returns error for non-existent post', async () => {
    const result = await getBlogPost('non-existent')
    
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Blog post not found')
    }
  })
})
```

---

## Error Handling Checklist

Before shipping any feature:

✅ All async functions have try-catch  
✅ User-facing errors are friendly  
✅ Technical errors are logged  
✅ Loading states handled  
✅ Error boundaries in place  
✅ Validation errors displayed  
✅ Recovery actions provided  
✅ No stack traces exposed  
✅ Result types used consistently  
✅ Tests cover error cases  

---

## Common Patterns

### Pattern 1: Guard Clauses

```typescript
function processData(data: unknown): Result<ProcessedData> {
  // Early validation
  if (!data) {
    return { success: false, error: 'Data is required' }
  }
  
  // Continue with confidence
  const processed = transform(data)
  return { success: true, data: processed }
}
```

### Pattern 2: Error Wrapping

```typescript
try {
  await externalAPI()
} catch (error) {
  throw new InternalError('External service failed')
}
```

### Pattern 3: Graceful Degradation

```typescript
const result = await loadRecentPosts()

return result.success 
  ? <PostsList posts={result.data} />
  : <EmptyState message="Unable to load posts" />
```

---

## Status

- **Document Type:** Engineering Standard
- **Status:** ✅ Active
- **Compliance:** Mandatory
- **Review:** Quarterly