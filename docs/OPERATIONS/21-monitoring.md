# 21 - Monitoring & Analytics

## Document Status

**Status:** ✅ ACTIVE  
**Version:** 1.0.0  
**Last Updated:** 2026-01-26  
**Authority:** Operations Standards

---

## Purpose

This document defines **how we monitor application health, performance, and user behavior**. Monitoring is essential for maintaining quality and improving the product.

**Why this matters:**
- Early detection: Catch issues before users complain
- Performance: Identify bottlenecks
- User behavior: Understand how users interact
- Business metrics: Track goals and conversions
- Debugging: Faster issue resolution

---

## Monitoring Strategy

### What We Monitor

1. **Application Health**
   - Uptime
   - Error rates
   - Response times
   - Build status

2. **Performance**
   - Core Web Vitals
   - Page load times
   - Bundle sizes
   - API latency

3. **User Behavior**
   - Page views
   - User flows
   - Feature usage
   - Conversion rates

4. **Business Metrics**
   - Traffic sources
   - Engagement
   - Bounce rate
   - Time on site

---

## Monitoring Tools

### Phase 1: Built-in Tools (Current)

**Vercel Analytics:**
- Page views
- Unique visitors
- Top pages
- Referrers
- Devices

**Vercel Speed Insights:**
- Core Web Vitals
- Real User Monitoring
- Performance scores
- Geographic data

**Browser Console:**
- Client-side errors
- Network issues
- Performance warnings

---

### Phase 2: Enhanced Monitoring (Future)

**Google Analytics 4:**
- Detailed user analytics
- Event tracking
- Conversion tracking
- Custom dimensions

**Sentry (Error Tracking):**
- Error monitoring
- Stack traces
- User context
- Release tracking

**LogRocket (Session Replay):**
- User sessions
- Console logs
- Network activity
- Performance metrics

---

## Implementation

### Vercel Analytics Setup

**Installation:**
```bash
npm install @vercel/analytics
```

**Integration:**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

### Vercel Speed Insights Setup

**Installation:**
```bash
npm install @vercel/speed-insights
```

**Integration:**
```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

---

### Google Analytics Setup (Phase 2)

**Environment Variable:**
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Implementation:**
```typescript
// lib/analytics/google-analytics.ts
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && GA_ID) {
    window.gtag('config', GA_ID, {
      page_path: url,
    })
  }
}

export const event = ({ 
  action, 
  category, 
  label, 
  value 
}: {
  action: string
  category: string
  label: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && GA_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
```

**Usage:**
```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@/lib/analytics/google-analytics'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <GoogleAnalytics />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

### Custom Event Tracking

**Track Button Clicks:**
```typescript
'use client'

import { event } from '@/lib/analytics/google-analytics'

export function ContactButton() {
  const handleClick = () => {
    event({
      action: 'click',
      category: 'Contact',
      label: 'Contact Button Clicked',
    })
  }
  
  return (
    <button onClick={handleClick}>
      Contact Me
    </button>
  )
}
```

---

**Track Form Submissions:**
```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  
  const result = await submitForm(data)
  
  if (result.success) {
    event({
      action: 'submit',
      category: 'Contact Form',
      label: 'Form Submission Success',
    })
  } else {
    event({
      action: 'error',
      category: 'Contact Form',
      label: 'Form Submission Failed',
    })
  }
}
```

---

**Track Page Views:**
```typescript
// app/blog/[slug]/page.tsx
import { event } from '@/lib/analytics/google-analytics'

export default function BlogPost({ params }) {
  // Track blog post view
  useEffect(() => {
    event({
      action: 'view',
      category: 'Blog',
      label: params.slug,
    })
  }, [params.slug])
  
  return <Article />
}
```

---

## Error Tracking

### Client-Side Error Tracking

**Error Boundary:**
```typescript
'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: unknown) {
    // Log to error tracking service
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Send to monitoring service (Phase 2)
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error)
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

---

### Server-Side Error Logging

```typescript
// lib/logger.ts
export const logger = {
  error: (message: string, error?: unknown) => {
    const errorData = {
      message,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    }
    
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
      console.error('[ERROR]', JSON.stringify(errorData))
    } else {
      console.error('[ERROR]', message, error)
    }
  },
  
  warn: (message: string, data?: unknown) => {
    console.warn('[WARN]', message, data)
  },
  
  info: (message: string, data?: unknown) => {
    console.info('[INFO]', message, data)
  },
}
```

---

## Performance Monitoring

### Core Web Vitals Tracking

**Built-in with Vercel Speed Insights:**
- LCP (Largest Contentful Paint)
- FID (First Input Delay) / INP
- CLS (Cumulative Layout Shift)

**Custom Reporting:**
```typescript
// lib/analytics/web-vitals.ts
import { onCLS, onFID, onLCP, onINP } from 'web-vitals'

export function reportWebVitals() {
  onCLS(metric => {
    console.log('CLS:', metric.value)
    // Send to analytics
  })
  
  onFID(metric => {
    console.log('FID:', metric.value)
    // Send to analytics
  })
  
  onLCP(metric => {
    console.log('LCP:', metric.value)
    // Send to analytics
  })
  
  onINP(metric => {
    console.log('INP:', metric.value)
    // Send to analytics
  })
}
```

---

### Performance Budget Alerts

**Monitor Bundle Size:**
```javascript
// scripts/check-bundle-size.js
const fs = require('fs')
const path = require('path')

const MAX_BUNDLE_SIZE = 200 * 1024 // 200 KB

const getBundleSize = () => {
  const buildDir = path.join(__dirname, '../.next')
  // Calculate total bundle size
  // ...
  return totalSize
}

const size = getBundleSize()

if (size > MAX_BUNDLE_SIZE) {
  console.error(`❌ Bundle size ${size} exceeds budget ${MAX_BUNDLE_SIZE}`)
  process.exit(1)
} else {
  console.log(`✅ Bundle size ${size} within budget`)
}
```

---

## Dashboard Metrics

### Key Metrics to Track

**Traffic Metrics:**
- Daily active users
- Page views per day
- Unique visitors
- Sessions per user
- Average session duration

**Engagement Metrics:**
- Bounce rate
- Pages per session
- Time on site
- Return visitor rate
- Top pages

**Performance Metrics:**
- Average LCP
- Average FID/INP
- Average CLS
- Page load time
- Time to Interactive

**Conversion Metrics:**
- Contact form submissions
- Email signups (if applicable)
- Link clicks
- Download clicks

---

## Alerts & Notifications

### When to Alert

**Critical Alerts (Immediate):**
- Site down (uptime < 99%)
- Error rate > 5%
- LCP > 4s
- Build failures

**Warning Alerts (Next Day):**
- Error rate > 1%
- LCP > 3s
- Traffic drop > 50%
- Bounce rate > 70%

**Info Alerts (Weekly):**
- Performance trends
- Traffic summary
- Top errors
- User feedback

---

### Alert Channels

**Development:**
- Email
- Slack (if configured)
- Discord (if configured)

**Production:**
- Email (critical)
- SMS (critical, optional)
- Slack/Discord
- Dashboard notifications

---

## Monitoring Checklist

### Daily Monitoring

✅ Check error rates  
✅ Review Core Web Vitals  
✅ Check uptime status  
✅ Review traffic patterns  
✅ Check for anomalies  

### Weekly Monitoring

✅ Review performance trends  
✅ Analyze user behavior  
✅ Check top errors  
✅ Review conversion rates  
✅ Update stakeholders  

### Monthly Monitoring

✅ Performance report  
✅ Traffic analysis  
✅ Goal achievement  
✅ Improvement opportunities  
✅ Update documentation  

---

## Privacy & Compliance

### GDPR Compliance

**Cookie Consent:**
```typescript
// components/CookieConsent.tsx
'use client'

import { useState, useEffect } from 'react'

export function CookieConsent() {
  const [show, setShow] = useState(false)
  
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShow(true)
    }
  }, [])
  
  const accept = () => {
    localStorage.setItem('cookie-consent', 'true')
    setShow(false)
    // Enable analytics
  }
  
  if (!show) return null
  
  return (
    <div className="cookie-banner">
      <p>We use cookies to improve your experience.</p>
      <button onClick={accept}>Accept</button>
    </div>
  )
}
```

**Privacy Policy:**
- Document data collection
- Explain cookie usage
- Provide opt-out options
- List third-party services

---

## Troubleshooting

### No Data in Analytics

**Check:**
- Analytics script installed?
- Environment variables set?
- Ad blockers disabled?
- Console for errors?
- Network tab for requests?

**Fix:**
- Verify installation
- Check configuration
- Test in incognito mode
- Review documentation

---

### Incorrect Data

**Check:**
- Events firing correctly?
- Filters applied?
- Time zone settings?
- Multiple trackers?

**Fix:**
- Review event tracking code
- Check filter configuration
- Verify time zone
- Remove duplicate trackers

---

## Best Practices

### DO

✅ Monitor continuously  
✅ Set up alerts  
✅ Review regularly  
✅ Act on insights  
✅ Document findings  
✅ Respect privacy  
✅ Keep data secure  

### DON'T

❌ Track sensitive data  
❌ Ignore alerts  
❌ Track without consent  
❌ Over-track everything  
❌ Forget to review  
❌ Expose analytics data  

---

## Status

- **Document Type:** Operations Standard
- **Status:** ✅ Active
- **Compliance:** Mandatory for production
- **Review:** Monthly