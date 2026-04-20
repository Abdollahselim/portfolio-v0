# 19 - Security Checklist

## Document Status

**Status:** ✅ ACTIVE  
**Version:** 1.0.0  
**Last Updated:** 2026-01-26  
**Authority:** Operations Standards

---

## Purpose

This document provides a **comprehensive security checklist** that must be completed before any deployment. Security is non-negotiable.

**Why this matters:**
- User protection: Keep user data safe
- Trust: Maintain user confidence
- Compliance: Meet security standards
- Risk mitigation: Prevent breaches
- Reputation: Protect project reputation

---

## Pre-Deployment Security Checklist

### Input Validation

✅ All user inputs validated with Zod schemas  
✅ Type checking enforced (TypeScript strict mode)  
✅ Length limits on all text inputs  
✅ Format validation (email, URL, etc.)  
✅ No direct use of user input in queries  
✅ File upload validation (if applicable)  
✅ Whitelist allowed characters  

---

### XSS Prevention

✅ React auto-escaping used (default)  
✅ No dangerouslySetInnerHTML without sanitization  
✅ Content-Security-Policy headers configured  
✅ User-generated content sanitized  
✅ HTML entities encoded  
✅ No inline script execution  
✅ Input/output encoding consistent  

---

### Authentication & Authorization

✅ Server-side authentication checks  
✅ Protected routes secured  
✅ No client-only auth  
✅ Session management secure  
✅ Tokens stored in HTTP-only cookies  
✅ Token expiration implemented  
✅ Logout clears all session data  
✅ Password requirements enforced (if applicable)  
✅ Rate limiting on auth endpoints  

---

### Data Protection

✅ No sensitive data in logs  
✅ No passwords in plain text  
✅ Secrets in environment variables  
✅ No API keys in client code  
✅ PII handled according to policy  
✅ Data transmission encrypted (HTTPS)  
✅ Secure cookie flags set  
✅ Database credentials secured  

---

### API Security

✅ Rate limiting implemented  
✅ CSRF protection enabled  
✅ CORS configured correctly  
✅ Input validation on all endpoints  
✅ Authentication required where needed  
✅ Error messages don't leak information  
✅ API versioning strategy  
✅ Request size limits enforced  

---

### Dependency Security

✅ npm audit shows 0 critical vulnerabilities  
✅ Dependencies up to date  
✅ No known vulnerable packages  
✅ Minimal dependencies used  
✅ Dependencies from trusted sources  
✅ Lock file committed (package-lock.json)  
✅ Regular security updates scheduled  

---

### Error Handling

✅ Generic error messages to users  
✅ Detailed errors logged server-side only  
✅ No stack traces in production  
✅ Error tracking configured  
✅ No sensitive data in errors  
✅ Proper HTTP status codes  
✅ Graceful error degradation  

---

### Headers & Configuration

✅ Security headers configured  
✅ HTTPS enforced  
✅ HSTS enabled  
✅ X-Frame-Options set  
✅ X-Content-Type-Options set  
✅ Referrer-Policy configured  
✅ Permissions-Policy configured  

---

## Security Headers Configuration

### Required Headers

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
```

---

### Content Security Policy

```typescript
// Strict CSP for production
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

// Add to headers
{
  key: 'Content-Security-Policy',
  value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
}
```

---

## Security Testing

### Manual Testing

**XSS Testing:**
```typescript
// Test with these inputs
const maliciousInputs = [
  '<script>alert("xss")</script>',
  '<img src=x onerror=alert("xss")>',
  'javascript:alert("xss")',
  '<svg onload=alert("xss")>',
]

// Verify:
// 1. Input is escaped/sanitized
// 2. Script doesn't execute
// 3. Content rendered safely
```

---

**SQL Injection Testing:**
```typescript
// Test with these inputs
const sqlInjections = [
  "'; DROP TABLE users; --",
  "' OR '1'='1",
  "admin'--",
  "1' UNION SELECT NULL--",
]

// Verify:
// 1. Queries use parameterization
// 2. No SQL errors
// 3. No unauthorized data access
```

---

**Authentication Testing:**
```typescript
// Test scenarios:
// 1. Access protected route without auth
// 2. Use expired token
// 3. Use invalid token
// 4. Try to access other user's data
// 5. Attempt privilege escalation

// Verify all fail appropriately
```

---

### Automated Security Scanning

```bash
# Dependency audit
npm audit

# Fix non-breaking vulnerabilities
npm audit fix

# Security linting
npm run lint:security

# OWASP dependency check (if configured)
npm run security:check
```

---

## Common Vulnerabilities & Mitigations

### 1. XSS (Cross-Site Scripting)

**Risk:** HIGH  
**Impact:** User data theft, session hijacking

**Mitigation:**
- Use React (auto-escapes by default)
- Never use dangerouslySetInnerHTML without sanitization
- Implement CSP headers
- Validate and sanitize all inputs

**Test:**
```typescript
// Should NOT execute
<div>{userInput}</div> // React escapes automatically
```

---

### 2. CSRF (Cross-Site Request Forgery)

**Risk:** MEDIUM  
**Impact:** Unauthorized actions on behalf of users

**Mitigation:**
- Use Next.js Server Actions (built-in CSRF protection)
- Implement CSRF tokens for API routes
- Use SameSite cookie attribute
- Verify Origin header

**Implementation:**
```typescript
// Server Actions automatically protected
'use server'
export async function submitForm(formData: FormData) {
  // CSRF token validated by Next.js
}
```

---

### 3. SQL Injection

**Risk:** CRITICAL  
**Impact:** Data breach, data loss

**Mitigation:**
- Use Supabase (parameterized queries by default)
- Never concatenate user input into queries
- Use ORM/query builder
- Validate input types

**Safe Pattern:**
```typescript
// ✅ SAFE - Supabase handles sanitization
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail)
```

---

### 4. Broken Authentication

**Risk:** CRITICAL  
**Impact:** Account takeover, unauthorized access

**Mitigation:**
- Server-side session validation
- HTTP-only secure cookies
- Token expiration
- Strong password requirements
- Rate limiting on login

---

### 5. Sensitive Data Exposure

**Risk:** HIGH  
**Impact:** Privacy breach, compliance violations

**Mitigation:**
- No secrets in client code
- Environment variables for sensitive data
- No sensitive data in logs
- Encrypt data in transit (HTTPS)
- Encrypt sensitive data at rest

---

### 6. XML External Entities (XXE)

**Risk:** MEDIUM  
**Impact:** File disclosure, SSRF

**Mitigation:**
- We don't process XML (N/A for this project)
- If added later, disable external entities
- Use safe parsers

---

### 7. Broken Access Control

**Risk:** HIGH  
**Impact:** Unauthorized data access

**Mitigation:**
- Server-side authorization checks
- Validate user permissions
- No client-only access control
- Principle of least privilege

---

### 8. Security Misconfiguration

**Risk:** MEDIUM  
**Impact:** Various vulnerabilities

**Mitigation:**
- Use security headers
- Keep dependencies updated
- Remove debug code
- Disable directory listing
- Proper error handling

---

### 9. Using Components with Known Vulnerabilities

**Risk:** VARIES  
**Impact:** Depends on vulnerability

**Mitigation:**
- Regular dependency updates
- npm audit before deployment
- Monitor security advisories
- Remove unused dependencies

---

### 10. Insufficient Logging & Monitoring

**Risk:** LOW  
**Impact:** Delayed breach detection

**Mitigation:**
- Log security events
- Monitor error rates
- Alert on suspicious activity
- Regular log review

---

## Security Review Process

### Before Each Deployment

**Step 1: Code Review**
- Review all changes
- Check for security issues
- Verify input validation
- Check error handling

**Step 2: Security Scan**
```bash
npm audit
npm run lint
npm run type-check
```

**Step 3: Manual Testing**
- Test authentication
- Test authorization
- Try malicious inputs
- Check error messages

**Step 4: Checklist Verification**
- Complete this checklist
- Document any exceptions
- Get security approval

---

## Incident Response

### If Security Issue Discovered

**Immediate Actions:**
1. Assess severity
2. Contain the issue
3. Rollback if necessary
4. Document the issue

**Investigation:**
1. Identify root cause
2. Determine impact
3. Check for data breach
4. Review logs

**Remediation:**
1. Fix the vulnerability
2. Test the fix
3. Deploy patch
4. Verify fix in production

**Post-Incident:**
1. Update security measures
2. Add tests to prevent recurrence
3. Update documentation
4. Notify stakeholders if needed

---

## Security Best Practices

### Code Level

**DO:**
✅ Validate all inputs  
✅ Use parameterized queries  
✅ Implement proper error handling  
✅ Use HTTPS everywhere  
✅ Hash passwords (if storing)  
✅ Sanitize user content  
✅ Use security headers  

**DON'T:**
❌ Trust user input  
❌ Expose secrets  
❌ Use eval()  
❌ Disable security features  
❌ Hardcode credentials  
❌ Log sensitive data  
❌ Use outdated dependencies  

---

### Operations Level

**DO:**
✅ Regular security updates  
✅ Monitor for vulnerabilities  
✅ Use environment variables  
✅ Enable 2FA for services  
✅ Regular backups  
✅ Access logging  
✅ Incident response plan  

**DON'T:**
❌ Share credentials  
❌ Use same password everywhere  
❌ Ignore security warnings  
❌ Deploy untested code  
❌ Skip security reviews  
❌ Expose admin interfaces  

---

## Security Tools

### Recommended Tools

**Dependency Scanning:**
- npm audit (built-in)
- Snyk
- Dependabot

**Code Analysis:**
- ESLint security plugins
- SonarQube
- CodeQL

**Runtime Protection:**
- Vercel security features
- Supabase Row Level Security
- Rate limiting

---

## Compliance

### Data Protection

**GDPR Considerations:**
- User data collection transparency
- Right to deletion
- Data portability
- Consent management

**CCPA Considerations:**
- Privacy policy
- Do Not Sell option
- Data disclosure

**Implementation:**
- Privacy policy page
- Cookie consent (if using cookies)
- Data deletion endpoints

---

## Security Contacts

### Reporting Security Issues

**Email:** security@yourdomain.com  
**PGP Key:** [If available]  
**Response Time:** 24 hours  
**Disclosure:** Responsible disclosure policy  

---

## Security Checklist Summary

### Pre-Deployment

✅ All inputs validated  
✅ No XSS vulnerabilities  
✅ CSRF protection enabled  
✅ Authentication secure  
✅ Secrets protected  
✅ Dependencies updated  
✅ Security headers configured  
✅ Error handling proper  
✅ Manual testing complete  
✅ npm audit passing  

---

## Status

- **Document Type:** Operations Standard
- **Status:** ✅ Active
- **Compliance:** Mandatory before deployment
- **Review:** Before each deployment