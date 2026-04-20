# 06 - Testing Strategy

## Document Status

**Status:** ✅ ACTIVE  
**Version:** 1.0.0  
**Last Updated:** 2026-01-26  
**Authority:** Engineering Standards

---

## Purpose

This document defines **how we test** this project. Testing is not optional—it's a fundamental requirement for production-ready software.

**Why this matters:**
- Confidence: Ship features without breaking existing functionality
- Documentation: Tests document expected behavior
- Refactoring: Change code safely
- Debugging: Tests pinpoint issues quickly
- Quality: Catch bugs before users do

---

## Testing Philosophy

### Our Approach

**Testing Pyramid:**
```
       /\
      /E2E\       Few (Critical paths only)
     /____\
    /      \
   /Integration\  Some (Feature workflows)
  /____________\
 /              \
/   Unit Tests   \  Many (Pure functions, utilities)
```

**Priorities:**
1. **Unit Tests:** Test pure functions, utilities, schemas
2. **Integration Tests:** Test features end-to-end
3. **E2E Tests:** Test critical user journeys

---

### What We Test

✅ **Do Test:**
- Pure functions and utilities
- Business logic in services
- Data validation (schemas)
- Component rendering
- User interactions
- Error handling
- Edge cases

❌ **Don't Test:**
- Third-party libraries
- Next.js framework internals
- Simple prop passing
- Trivial getters/setters
- CSS/styling (visual regression later)

---

## Testing Stack

### Core Tools

**Test Runner:** Vitest
- Why: Fast, modern, great TypeScript support
- Alternative: Jest
- Decision: Vitest is faster and has better DX

**React Testing:** React Testing Library
- Why: Tests behavior, not implementation
- Philosophy: Test how users interact

**E2E Testing:** Playwright (Phase 4+)
- Why: Fast, reliable, great developer experience
- Alternative: Cypress
- Decision: Playwright has better performance

---

## Test Structure

### File Organization

```
src/
├── features/
│   └── blog/
│       ├── services/
│       │   ├── blog.service.ts
│       │   └── blog.service.test.ts    ✅
│       ├── components/
│       │   ├── BlogCard.tsx
│       │   └── BlogCard.test.tsx       ✅
│       └── hooks/
│           ├── useBlogSearch.ts
│           └── useBlogSearch.test.ts   ✅
│
├── lib/
│   └── utils/
│       ├── date.ts
│       └── date.test.ts                ✅
│
└── schemas/
    ├── blog.schema.ts
    └── blog.schema.test.ts             ✅
```

**Rule:** Test files live next to source files with `.test.ts` or `.test.tsx` suffix.

---

## Unit Testing

### Testing Pure Functions

```typescript
// lib/utils/date.ts
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// lib/utils/date.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from './date'

describe('formatDate', () => {
  it('formats ISO date correctly', () => {
    const result = formatDate('2026-01-26')
    expect(result).toBe('January 26, 2026')
  })
  
  it('handles invalid date', () => {
    const result = formatDate('invalid')
    expect(result).toBe('Invalid Date')
  })
  
  it('formats dates from different years', () => {
    expect(formatDate('2024-12-31')).toBe('December 31, 2024')
    expect(formatDate('2026-01-01')).toBe('January 1, 2026')
  })
})
```

---

### Testing Schemas (Zod)

```typescript
// schemas/blog.schema.test.ts
import { describe, it, expect } from 'vitest'
import { BlogPostSchema } from './blog.schema'

describe('BlogPostSchema', () => {
  const validPost = {
    slug: 'test-post',
    title: 'Test Post',
    description: 'Test description',
    publishedAt: '2026-01-26',
    content: 'Content here',
    tags: ['test'],
  }
  
  it('validates valid blog post', () => {
    const result = BlogPostSchema.safeParse(validPost)
    expect(result.success).toBe(true)
  })
  
  it('rejects missing required fields', () => {
    const invalid = { ...validPost, title: undefined }
    const result = BlogPostSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })
  
  it('rejects invalid slug format', () => {
    const invalid = { ...validPost, slug: '' }
    const result = BlogPostSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })
  
  it('validates tags array', () => {
    const withTags = { ...validPost, tags: ['react', 'typescript'] }
    const result = BlogPostSchema.safeParse(withTags)
    expect(result.success).toBe(true)
  })
})
```

---

### Testing Services

```typescript
// features/blog/services/blog.service.test.ts
import { describe, it, expect, vi } from 'vitest'
import { getBlogPost, getBlogPosts } from './blog.service'
import * as mdxLoader from '@/lib/mdx/mdx-loader'

// Mock the MDX loader
vi.mock('@/lib/mdx/mdx-loader')

describe('blog.service', () => {
  describe('getBlogPost', () => {
    it('returns blog post for valid slug', async () => {
      // Arrange
      const mockPost = {
        slug: 'test-post',
        title: 'Test',
        description: 'Test',
        publishedAt: '2026-01-26',
        content: 'Content',
        tags: [],
      }
      
      vi.mocked(mdxLoader.loadMDXPost).mockResolvedValue({
        success: true,
        data: mockPost
      })
      
      // Act
      const result = await getBlogPost('test-post')
      
      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Test')
      }
    })
    
    it('returns error for empty slug', async () => {
      const result = await getBlogPost('')
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Blog post slug is required')
      }
    })
    
    it('handles loading errors', async () => {
      vi.mocked(mdxLoader.loadMDXPost).mockResolvedValue({
        success: false,
        error: 'File not found'
      })
      
      const result = await getBlogPost('non-existent')
      
      expect(result.success).toBe(false)
    })
  })
  
  describe('getBlogPosts', () => {
    it('returns all posts', async () => {
      const mockPosts = [
        { slug: 'post-1', title: 'Post 1', /* ... */ },
        { slug: 'post-2', title: 'Post 2', /* ... */ },
      ]
      
      vi.mocked(mdxLoader.loadAllMDXPosts).mockResolvedValue({
        success: true,
        data: mockPosts
      })
      
      const result = await getBlogPosts()
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toHaveLength(2)
      }
    })
    
    it('filters by tag', async () => {
      const mockPosts = [
        { slug: 'post-1', tags: ['react'], /* ... */ },
        { slug: 'post-2', tags: ['typescript'], /* ... */ },
      ]
      
      vi.mocked(mdxLoader.loadAllMDXPosts).mockResolvedValue({
        success: true,
        data: mockPosts
      })
      
      const result = await getBlogPosts({ tag: 'react' })
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toHaveLength(1)
        expect(result.data[0].slug).toBe('post-1')
      }
    })
  })
})
```

---

## Component Testing

### Testing Presentation Components

```typescript
// components/ui/Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click</Button>)
    
    await user.click(screen.getByText('Click'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByText('Click')).toBeDisabled()
  })
  
  it('applies variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByText('Primary')).toHaveClass('btn-primary')
    
    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByText('Secondary')).toHaveClass('btn-secondary')
  })
})
```

---

### Testing Feature Components

```typescript
// features/blog/components/BlogCard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BlogCard } from './BlogCard'

describe('BlogCard', () => {
  const mockPost = {
    slug: 'test-post',
    title: 'Test Post',
    description: 'Test description',
    publishedAt: '2026-01-26',
    tags: ['react', 'typescript'],
  }
  
  it('renders post title', () => {
    render(<BlogCard post={mockPost} />)
    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })
  
  it('renders post description', () => {
    render(<BlogCard post={mockPost} />)
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })
  
  it('renders tags', () => {
    render(<BlogCard post={mockPost} />)
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
  })
  
  it('links to post page', () => {
    render(<BlogCard post={mockPost} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/blog/test-post')
  })
  
  it('shows featured badge when featured', () => {
    render(<BlogCard post={mockPost} featured />)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })
})
```

---

### Testing Client Components with State

```typescript
// features/blog/components/BlogSearch.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BlogSearch } from './BlogSearch'

describe('BlogSearch', () => {
  it('renders search input', () => {
    render(<BlogSearch onSearch={vi.fn()} />)
    expect(screen.getByPlaceholderText('Search posts...')).toBeInTheDocument()
  })
  
  it('calls onSearch when typing', async () => {
    const handleSearch = vi.fn()
    const user = userEvent.setup()
    
    render(<BlogSearch onSearch={handleSearch} />)
    
    const input = screen.getByPlaceholderText('Search posts...')
    await user.type(input, 'react')
    
    expect(handleSearch).toHaveBeenCalledWith('react')
  })
  
  it('clears search when clear button clicked', async () => {
    const handleSearch = vi.fn()
    const user = userEvent.setup()
    
    render(<BlogSearch onSearch={handleSearch} />)
    
    const input = screen.getByPlaceholderText('Search posts...')
    await user.type(input, 'test')
    
    const clearButton = screen.getByRole('button', { name: /clear/i })
    await user.click(clearButton)
    
    expect(input).toHaveValue('')
    expect(handleSearch).toHaveBeenCalledWith('')
  })
})
```

---

## Hook Testing

```typescript
// features/blog/hooks/useBlogSearch.test.ts
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useBlogSearch } from './useBlogSearch'

describe('useBlogSearch', () => {
  const mockPosts = [
    { slug: 'post-1', title: 'React Hooks', /* ... */ },
    { slug: 'post-2', title: 'TypeScript Guide', /* ... */ },
    { slug: 'post-3', title: 'React Testing', /* ... */ },
  ]
  
  it('returns all posts when query is empty', () => {
    const { result } = renderHook(() => 
      useBlogSearch(mockPosts, '')
    )
    
    expect(result.current.filteredPosts).toHaveLength(3)
  })
  
  it('filters posts by title', () => {
    const { result } = renderHook(() => 
      useBlogSearch(mockPosts, 'react')
    )
    
    expect(result.current.filteredPosts).toHaveLength(2)
    expect(result.current.filteredPosts[0].slug).toBe('post-1')
    expect(result.current.filteredPosts[1].slug).toBe('post-3')
  })
  
  it('is case insensitive', () => {
    const { result } = renderHook(() => 
      useBlogSearch(mockPosts, 'REACT')
    )
    
    expect(result.current.filteredPosts).toHaveLength(2)
  })
  
  it('returns empty array when no matches', () => {
    const { result } = renderHook(() => 
      useBlogSearch(mockPosts, 'nonexistent')
    )
    
    expect(result.current.filteredPosts).toHaveLength(0)
  })
})
```

---

## Integration Testing

### Testing Feature Workflows

```typescript
// features/contact/contact.integration.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './components/ContactForm'
import * as contactService from './services/contact.service'

vi.mock('./services/contact.service')

describe('Contact Form Integration', () => {
  it('submits form successfully', async () => {
    // Mock successful submission
    vi.mocked(contactService.submitContactForm).mockResolvedValue({
      success: true,
      data: undefined
    })
    
    const user = userEvent.setup()
    render(<ContactForm />)
    
    // Fill form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'Test message here')
    
    // Submit
    await user.click(screen.getByRole('button', { name: /send/i }))
    
    // Verify success message
    expect(await screen.findByText(/message sent/i)).toBeInTheDocument()
    
    // Verify service called with correct data
    expect(contactService.submitContactForm).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message here'
    })
  })
  
  it('shows validation errors', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    
    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /send/i }))
    
    // Check for validation errors
    expect(await screen.findByText(/name.*required/i)).toBeInTheDocument()
    expect(await screen.findByText(/email.*required/i)).toBeInTheDocument()
  })
  
  it('handles submission error', async () => {
    vi.mocked(contactService.submitContactForm).mockResolvedValue({
      success: false,
      error: 'Network error'
    })
    
    const user = userEvent.setup()
    render(<ContactForm />)
    
    // Fill and submit
    await user.type(screen.getByLabelText(/name/i), 'John')
    await user.type(screen.getByLabelText(/email/i), 'john@test.com')
    await user.type(screen.getByLabelText(/message/i), 'Test')
    await user.click(screen.getByRole('button', { name: /send/i }))
    
    // Check error message
    expect(await screen.findByText(/network error/i)).toBeInTheDocument()
  })
})
```

---

## E2E Testing (Phase 4+)

### Critical User Journeys

```typescript
// e2e/blog.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Blog', () => {
  test('user can view blog posts', async ({ page }) => {
    await page.goto('/blog')
    
    // Check page loads
    await expect(page.locator('h1')).toContainText('Blog')
    
    // Check posts are visible
    const posts = page.locator('[data-testid="blog-card"]')
    await expect(posts).toHaveCount(3) // Assuming 3 posts
    
    // Click first post
    await posts.first().click()
    
    // Check post page loaded
    await expect(page.locator('article')).toBeVisible()
  })
  
  test('user can search blog posts', async ({ page }) => {
    await page.goto('/blog')
    
    // Type in search
    await page.fill('[data-testid="blog-search"]', 'react')
    
    // Check filtered results
    const posts = page.locator('[data-testid="blog-card"]')
    await expect(posts).toHaveCount(2)
    
    // Verify posts contain search term
    const titles = await posts.allTextContents()
    titles.forEach(title => {
      expect(title.toLowerCase()).toContain('react')
    })
  })
  
  test('user can filter by tag', async ({ page }) => {
    await page.goto('/blog')
    
    // Click tag
    await page.click('[data-tag="typescript"]')
    
    // URL updated
    await expect(page).toHaveURL(/tag=typescript/)
    
    // Posts filtered
    const posts = page.locator('[data-testid="blog-card"]')
    await expect(posts.first()).toContainText('typescript')
  })
})
```

---

## Test Configuration

### Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '*.config.ts',
        '**/*.test.{ts,tsx}',
        '**/types/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

---

### Test Setup

```typescript
// vitest.setup.ts
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})
```

---

## Coverage Requirements

### Minimum Coverage Targets

```
Overall Coverage:     80%
Statements:          80%
Branches:            75%
Functions:           80%
Lines:               80%
```

### Critical Path Coverage

```
Services:            90%
Schemas:            100%
Utilities:           90%
Components:          70%
```

---

## Testing Best Practices

### 1. Arrange-Act-Assert Pattern

```typescript
it('formats date correctly', () => {
  // Arrange
  const date = '2026-01-26'
  
  // Act
  const result = formatDate(date)
  
  // Assert
  expect(result).toBe('January 26, 2026')
})
```

---

### 2. Test Behavior, Not Implementation

```typescript
// ❌ WRONG - Testing implementation
it('calls useState with initial value', () => {
  const spy = vi.spyOn(React, 'useState')
  render(<Component />)
  expect(spy).toHaveBeenCalledWith(0)
})

// ✅ CORRECT - Testing behavior
it('displays initial count', () => {
  render(<Component />)
  expect(screen.getByText('Count: 0')).toBeInTheDocument()
})
```

---

### 3. One Assertion Per Test (Guideline)

```typescript
// ✅ GOOD - Focused tests
it('renders post title', () => {
  render(<BlogCard post={mockPost} />)
  expect(screen.getByText('Test Post')).toBeInTheDocument()
})

it('renders post description', () => {
  render(<BlogCard post={mockPost} />)
  expect(screen.getByText('Test description')).toBeInTheDocument()
})

// ⚠️ ACCEPTABLE - Related assertions
it('renders post metadata', () => {
  render(<BlogCard post={mockPost} />)
  expect(screen.getByText('Test Post')).toBeInTheDocument()
  expect(screen.getByText('Test description')).toBeInTheDocument()
  expect(screen.getByText('January 26, 2026')).toBeInTheDocument()
})
```

---

### 4. Use Data-Testid Sparingly

```typescript
// ❌ WRONG - Overusing data-testid
<button data-testid="submit-button">Submit</button>
screen.getByTestId('submit-button')

// ✅ CORRECT - Use semantic queries
<button type="submit">Submit</button>
screen.getByRole('button', { name: /submit/i })
```

**Use data-testid only when:**
- No semantic query available
- Dynamic content
- Complex selectors

---

## Testing Checklist

Before marking a feature as complete:

✅ Unit tests for services  
✅ Unit tests for utilities  
✅ Schema validation tests  
✅ Component rendering tests  
✅ User interaction tests  
✅ Error handling tests  
✅ Edge cases covered  
✅ Coverage targets met  
✅ All tests passing  
✅ No skipped tests in main branch  

---

## Continuous Integration

### CI Pipeline

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Check coverage
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Status

- **Document Type:** Engineering Standard
- **Status:** ✅ Active
- **Compliance:** Mandatory
- **Review:** Quarterly