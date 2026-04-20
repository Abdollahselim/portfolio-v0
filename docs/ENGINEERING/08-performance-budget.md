# 08 - Performance Budget

## Document Status

**Status:** ✅ ACTIVE  
**Version:** 1.0.0  
**Last Updated:** 2026-01-26  
**Authority:** Engineering Standards

---

## Purpose

This document defines **performance requirements** for this project. These are not aspirational goals—they are **hard limits** that must not be exceeded.

**Why this matters:**
- User experience: Fast sites convert better
- SEO: Performance is a ranking factor
- Accessibility: Fast sites work on slow connections
- Cost: Performance = efficiency = lower costs
- Professionalism: Fast sites reflect quality

---

## Performance Philosophy

### Core Principle

> **Performance is a feature, not an optimization.**

We build performance in from the start, not add it later.

### Key Metrics

We measure what matters to users:

1. **Core Web Vitals** (Google's standards)
2. **Page Load Times** (Perceived performance)
3. **Bundle Sizes** (Network cost)
4. **Runtime Performance** (Interactions)

---

## Core Web Vitals Targets

### Largest Contentful Paint (LCP)

**What it measures:** How long until main content is visible

**Targets:**
- ✅ Good: < 2.5s
- ⚠️ Needs Improvement: 2.5s - 4s
- ❌ Poor: > 4s

**Our Target:** < 2.0s

**How we achieve it:**
- Server-side rendering
- Image optimization
- Critical CSS inline
- Lazy load below-fold content

---

### First Input Delay (FID) / Interaction to Next Paint (INP)

**What it measures:** Responsiveness to user input

**Targets:**
- ✅ Good: < 100ms (FID) / < 200ms (INP)
- ⚠️ Needs Improvement: 100-300ms / 200-500ms
- ❌ Poor: > 300ms / > 500ms

**Our Target:** < 100ms (FID) / < 200ms (INP)

**How we achieve it:**
- Minimal JavaScript
- Code splitting
- Optimize event handlers
- Avoid long tasks

---

### Cumulative Layout Shift (CLS)

**What it measures:** Visual stability (no unexpected shifts)

**Targets:**
- ✅ Good: < 0.1
- ⚠️ Needs Improvement: 0.1 - 0.25
- ❌ Poor: > 0.25

**Our Target:** < 0.1

**How we achieve it:**
- Set image dimensions
- Reserve space for dynamic content
- Avoid inserting content above existing content
- Use CSS aspect ratios

---

## Page Load Budgets

### Home Page

```
First Contentful Paint (FCP): < 1.5s
Largest Contentful Paint (LCP): < 2.0s
Time to Interactive (TTI):      < 3.0s
Total Blocking Time (TBT):      < 200ms

Initial JS Bundle:    < 100 KB (gzipped)
Initial CSS:          < 20 KB (gzipped)
Total Page Weight:    < 500 KB (initial load)
```

---

### Blog Listing Page

```
FCP:  < 1.5s
LCP:  < 2.5s
TTI:  < 3.5s
TBT:  < 250ms

Initial JS Bundle:  < 120 KB (gzipped)
Initial CSS:        < 25 KB (gzipped)
Total Page Weight:  < 600 KB
```

---

### Blog Post Page

```
FCP:  < 1.5s
LCP:  < 2.5s
TTI:  < 3.5s
TBT:  < 250ms

Initial JS Bundle:  < 100 KB (gzipped)
Initial CSS:        < 30 KB (gzipped)
Content Images:     Lazy loaded, optimized
Total Page Weight:  < 800 KB (excluding images)
```

---

### Project Page

```
FCP:  < 1.5s
LCP:  < 3.0s (may include large images)
TTI:  < 4.0s
TBT:  < 300ms

Initial JS Bundle:  < 150 KB (gzipped)
Initial CSS:        < 35 KB (gzipped)
Total Page Weight:  < 1 MB
```

---

## Bundle Size Budgets

### JavaScript Budgets

```
Core Bundle (Shared):     < 80 KB (gzipped)
Route-specific bundles:   < 40 KB (gzipped) each
Component bundles:        < 20 KB (gzipped) each
Third-party libraries:    < 50 KB (gzipped) total
```

**Total JavaScript Budget:** < 200 KB (gzipped) per page

---

### CSS Budgets

```
Global styles:          < 15 KB (gzipped)
Critical CSS (inline):  < 5 KB
Route-specific CSS:     < 10 KB (gzipped) each
Component CSS:          < 5 KB (gzipped) each
```

**Total CSS Budget:** < 50 KB (gzipped) per page

---

### Image Budgets

```
Hero images:           < 200 KB (optimized)
Thumbnails:           < 50 KB each
Icons/logos:          < 10 KB each
Total above-fold:     < 300 KB
```

**Format Priority:**
1. WebP (primary)
2. AVIF (where supported)
3. JPEG/PNG (fallback)

---

## Performance Requirements by Feature

### Blog System

**MDX Processing:**
- Build time only (no runtime processing)
- Pre-compile MDX to React components
- Generate static HTML

**Image Handling:**
- Next.js Image optimization
- Lazy load all non-critical images
- Responsive image sets
- Blur placeholder for images

**Code Blocks:**
- Syntax highlighting at build time
- No client-side highlighting libraries
- Lazy load copy button functionality

---

### Contact Form

**Bundle Budget:** < 30 KB (gzipped)

**Requirements:**
- Client-side validation (no extra library)
- Minimal dependencies
- Progressive enhancement
- Works without JavaScript (basic functionality)

**Optimization:**
- Use native form validation
- Zod for runtime validation (already in bundle)
- No heavy form libraries

---

### Guestbook

**Initial Load:** < 40 KB (gzipped)

**Requirements:**
- Optimistic UI updates
- Pagination (10 entries per page)
- Lazy load older entries
- Real-time updates optional (via polling, not WebSocket initially)

**Database Queries:**
- Use indexes for all queries
- Limit: 10 entries per fetch
- Cache results (60s revalidation)

---

## Runtime Performance Budgets

### React Component Limits

**Re-render Budget:**
- Max re-renders per interaction: 3
- Component tree depth: < 10 levels
- List items: Virtualize if > 50 items

**State Management:**
- Prefer local state
- Global state only when necessary
- Memoize expensive computations

---

### Network Budgets

**API Calls:**
- Max concurrent requests: 6
- Request timeout: 10s
- Retry limit: 3 attempts

**Asset Loading:**
- Prioritize critical assets
- Defer non-critical assets
- Lazy load below-fold content

---

## Measurement & Monitoring

### Tools

**Development:**
- Lighthouse CI (on every PR)
- Next.js built-in analytics
- Chrome DevTools

**Production:**
- Vercel Analytics
- Core Web Vitals monitoring
- Real User Monitoring (RUM)

---

### Lighthouse Score Targets

```
Performance:      > 95
Accessibility:    > 95
Best Practices:   > 95
SEO:             > 95
```

**Minimum Acceptable:**
```
Performance:      > 90
Accessibility:    100
Best Practices:   > 90
SEO:             100
```

---

### CI/CD Performance Checks

```yaml
# .github/workflows/performance.yml

- name: Run Lighthouse CI
  run: |
    npm run build
    lhci autorun
  
- name: Check budgets
  run: |
    # Fail if budgets exceeded
    npm run check-bundle-size
```

---

## Optimization Strategies

### 1. Code Splitting

```typescript
// ✅ CORRECT - Lazy load heavy components
import { lazy, Suspense } from 'react'

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

### 2. Image Optimization

```typescript
// ✅ CORRECT - Use Next.js Image
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // For LCP image
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// For non-LCP images
<Image
  src="/thumbnail.jpg"
  alt="Thumbnail"
  width={300}
  height={200}
  loading="lazy"
/>
```

---

### 3. Font Optimization

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

---

### 4. Critical CSS

```typescript
// Only inline critical CSS
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS only */
            body { margin: 0; font-family: system-ui; }
            .hero { min-height: 100vh; }
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

### 5. Caching Strategy

```typescript
// Static pages - cache aggressively
export const revalidate = 3600 // 1 hour

// Dynamic data - short cache
export const revalidate = 60 // 1 minute

// Real-time data - no cache
export const revalidate = 0
```

---

## Performance Anti-Patterns

### ❌ Loading All Data Upfront

```typescript
// ❌ WRONG
const posts = await getAllBlogPosts() // 100+ posts

// ✅ CORRECT
const posts = await getBlogPosts({ limit: 10 })
```

---

### ❌ Unoptimized Images

```typescript
// ❌ WRONG
<img src="/large-image.jpg" alt="Hero" />

// ✅ CORRECT
<Image 
  src="/large-image.jpg" 
  alt="Hero"
  width={1200}
  height={600}
  priority
/>
```

---

### ❌ Heavy Dependencies

```typescript
// ❌ WRONG - 500 KB library for one function
import _ from 'lodash'

// ✅ CORRECT - Use native or lighter alternative
const unique = [...new Set(array)]
```

---

### ❌ Client-Side Rendering for Static Content

```typescript
// ❌ WRONG
'use client'
import { useEffect, useState } from 'react'

export default function Blog() {
  const [posts, setPosts] = useState([])
  
  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(setPosts)
  }, [])
  
  return <PostList posts={posts} />
}

// ✅ CORRECT - Server component
export default async function Blog() {
  const posts = await getBlogPosts()
  return <PostList posts={posts} />
}
```

---

## Dependency Budget

### Maximum Bundle Impact per Library

```
Animation:        < 15 KB (framer-motion or lighter)
Forms:           < 20 KB (react-hook-form)
Validation:      < 10 KB (zod - already included)
Date handling:   < 5 KB (native Date or date-fns-tz)
Icons:           < 10 KB (lucide-react with tree shaking)
```

---

### Forbidden Dependencies

**Never add these without explicit approval:**

❌ Moment.js (500+ KB) - Use date-fns or native  
❌ Lodash (full) - Use native or specific imports  
❌ jQuery - Use native DOM or React  
❌ Heavy animation libraries > 50 KB  
❌ Chart libraries > 100 KB (unless critical feature)  

---

## Performance Testing Checklist

Before merging any PR:

✅ Lighthouse score > 90  
✅ Bundle size within budget  
✅ No layout shifts  
✅ Images optimized  
✅ Critical CSS inline  
✅ Non-critical resources deferred  
✅ Fonts optimized  
✅ No render-blocking resources  
✅ First paint < 1.5s  
✅ Interactive < 3.5s  

---

## Emergency Performance Fixes

### If Performance Degrades

**Step 1: Measure**
```bash
npm run lighthouse
npm run analyze-bundle
```

**Step 2: Identify Culprit**
- Check bundle analyzer
- Review recent changes
- Profile runtime performance

**Step 3: Fix**
- Remove or lazy load heavy dependencies
- Optimize images
- Reduce JavaScript
- Add caching

**Step 4: Verify**
```bash
npm run lighthouse
# Score must be > 90
```

---

## Production Monitoring

### Real User Monitoring (RUM)

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

---

### Performance Alerts

**Set up alerts for:**
- LCP > 3s
- FID > 150ms
- CLS > 0.15
- Bundle size increase > 10%

---

## Budget Tracking

### Bundle Size CI Check

```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true next build",
    "check-bundle": "node scripts/check-bundle-size.js"
  }
}
```

```javascript
// scripts/check-bundle-size.js
const fs = require('fs')

const MAX_BUNDLE_SIZE = 200 * 1024 // 200 KB

const stats = JSON.parse(
  fs.readFileSync('.next/analyze/__bundle_analysis.json')
)

const totalSize = stats.bundles.reduce((sum, b) => sum + b.size, 0)

if (totalSize > MAX_BUNDLE_SIZE) {
  console.error(`Bundle size ${totalSize} exceeds budget ${MAX_BUNDLE_SIZE}`)
  process.exit(1)
}

console.log(`✓ Bundle size ${totalSize} within budget`)
```

---

## Performance Culture

### Before Adding Any Feature

Ask:
1. What's the performance cost?
2. Is there a lighter alternative?
3. Can we defer/lazy load this?
4. Does it justify the cost?

### Code Review Focus

- Check bundle impact
- Verify image optimization
- Ensure lazy loading
- Validate caching strategy

---

## Resources & Tools

### Measurement Tools
- Lighthouse CI
- WebPageTest
- Chrome DevTools Performance
- Next.js Built-in Analytics

### Bundle Analysis
- @next/bundle-analyzer
- webpack-bundle-analyzer
- source-map-explorer

### Image Optimization
- Next.js Image component
- Squoosh (compression)
- AVIF/WebP converters

---

## Status

- **Document Type:** Engineering Standard
- **Status:** ✅ Active
- **Compliance:** Mandatory
- **Review:** Every sprint + after major features