# 09 - Dependency Management

## Document Status

**Status:** ✅ ACTIVE  
**Version:** 1.0.0  
**Last Updated:** 2026-01-26  
**Authority:** Engineering Standards

---

## Purpose

This document defines **how we manage dependencies** in this project. Every dependency is a liability—it adds weight, complexity, and maintenance burden.

**Why this matters:**
- Bundle size: Each package increases load time
- Security: More dependencies = more attack surface
- Maintenance: Dependencies need updates
- Stability: Dependencies can break
- Cost: Build time increases with dependencies

---

## Core Philosophy

### The Default Answer is NO

```
Q: Can we add this library?
A: NO (unless proven necessary)
```

**Every dependency must justify its existence.**

---

### Evaluation Criteria

Before adding any dependency, answer:

1. **Is it necessary?** Can we build this ourselves?
2. **What's the cost?** Bundle size impact?
3. **Is it maintained?** Last update? Active maintainers?
4. **Is it secure?** Known vulnerabilities?
5. **What are alternatives?** Is there something lighter?
6. **What's the exit strategy?** Can we remove it later?

---

## Dependency Categories

### 1. Core Dependencies (Always Allowed)

These are fundamental to the project:

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0"
  }
}
```

**Why:** Framework essentials, no alternatives.

---

### 2. Pre-Approved Dependencies

These are approved for specific use cases:

#### Styling
```json
{
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32"
}
```
**Why:** Industry standard, excellent DX, small runtime impact.

---

#### Validation
```json
{
  "zod": "^3.22.4"
}
```
**Why:** Type-safe validation, ~10KB, no alternatives as good.

---

#### Content Processing
```json
{
  "gray-matter": "^4.0.3",
  "@mdx-js/loader": "^3.0.0",
  "@mdx-js/react": "^3.0.0"
}
```
**Why:** Essential for MDX content, build-time only.

---

#### Database (Phase 3+)
```json
{
  "@supabase/supabase-js": "^2.38.0"
}
```
**Why:** Official client, well-maintained, reasonable size.

---

### 3. Conditional Dependencies

These require case-by-case approval:

#### Form Handling
```json
{
  "react-hook-form": "^7.49.0"
}
```
**Why:** ~25KB, only if forms are complex. Use native for simple forms.

**Approval needed if:**
- Form is simple (< 5 fields)
- No complex validation
- No dynamic fields

---

#### Date Handling
```json
{
  "date-fns": "^3.0.0"
}
```
**Why:** Use native `Date` first. Only add if native insufficient.

**Approval needed unless:**
- Complex date manipulation required
- Timezone handling needed
- Internationalization required

---

#### Icons
```json
{
  "lucide-react": "^0.300.0"
}
```
**Why:** Tree-shakeable, ~2KB per icon.

**Requirements:**
- Must import only specific icons
- No `import * from 'lucide-react'`
- Maximum 10 icons total

---

### 4. Forbidden Dependencies

**NEVER add these without architecture review:**

❌ **Moment.js** - Use date-fns or native  
❌ **Lodash (full)** - Use native or specific imports  
❌ **jQuery** - Use native DOM  
❌ **Bootstrap/Material-UI** - We use Tailwind  
❌ **Redux** - Server components + local state  
❌ **Axios** - Use native fetch  
❌ **Styled Components** - We use Tailwind  
❌ **Emotion** - We use Tailwind  
❌ **Any library > 100KB** (gzipped) without approval  

---

## Adding New Dependencies

### Process

**Step 1: Justify**

Write justification document:

```markdown
## Dependency Request: [package-name]

### Problem
What problem does this solve?

### Current Situation
What do we do now? Why is it insufficient?

### Alternatives Considered
1. Native solution - Why not?
2. Alternative A - Why not?
3. Alternative B - Why not?

### Proposed Solution
Package: [name]
Version: [version]
Bundle Size: [X KB gzipped]
Last Updated: [date]
Weekly Downloads: [number]
GitHub Stars: [number]

### Impact Analysis
- Bundle size increase: +X KB
- Performance impact: [analysis]
- Maintenance burden: [analysis]
- Security concerns: [analysis]

### Exit Strategy
How can we remove this later if needed?

### Approval
[ ] Technical Lead
[ ] Performance Review
[ ] Security Review
```

---

**Step 2: Analysis**

Run impact analysis:

```bash
# Check bundle size impact
npm install --save [package]
npm run analyze

# Check for vulnerabilities
npm audit

# Check package health
npm view [package] time
npm view [package] maintainers
```

---

**Step 3: Approval**

Required approvals:
- Technical Lead review
- Bundle size within budget
- No critical vulnerabilities
- Active maintenance (updated within 6 months)

---

**Step 4: Document**

Add to this document:

```markdown
### [Package Name]

**Purpose:** What it does  
**Bundle Size:** X KB (gzipped)  
**Usage:** Where/how to use it  
**Alternatives:** Why chosen over alternatives  
**Added:** Date  
**Review Date:** Next review date  
```

---

## Version Management

### Semantic Versioning Rules

```json
{
  "dependencies": {
    "next": "^15.0.0",        // ✅ Caret - minor/patch updates
    "react": "19.0.0",         // ✅ Exact - major framework
    "zod": "~3.22.4"           // ✅ Tilde - patch updates only
  }
}
```

**Rules:**
- `^` (caret): For most dependencies - allows minor updates
- `~` (tilde): For critical packages - patch updates only
- Exact: For framework packages or when stability critical

---

### Update Strategy

**Schedule:**
- Security updates: Immediate
- Patch updates: Weekly
- Minor updates: Monthly
- Major updates: Quarterly (with testing)

---

### Update Process

```bash
# Check for updates
npm outdated

# Update patch versions
npm update

# Update minor versions (with review)
npm install [package]@latest

# Test after updates
npm test
npm run build
npm run lighthouse
```

---

## Security Management

### Audit Schedule

```bash
# Run on every build
npm audit

# Fix non-breaking vulnerabilities
npm audit fix

# Review breaking fixes manually
npm audit fix --force
```

---

### Vulnerability Response

**Critical (CVSS > 7.0):**
- Fix within 24 hours
- Emergency patch if needed
- Notify team immediately

**High (CVSS 4.0-7.0):**
- Fix within 1 week
- Schedule in next sprint

**Medium/Low:**
- Fix in regular updates
- Document if acceptable risk

---

## Bundle Size Management

### Size Limits per Category

```
Core framework:        < 100 KB
UI components:         < 50 KB
Forms:                < 30 KB
Validation:           < 15 KB
Utilities:            < 10 KB
Icons:                < 10 KB
```

**Total limit:** < 200 KB (gzipped) for initial bundle

---

### Measuring Impact

```bash
# Analyze bundle
npm run analyze

# Check specific package size
npx bundle-phobia [package-name]

# Check before adding
npx bundle-phobia [package-name]@[version]
```

---

### Tree Shaking

```typescript
// ❌ WRONG - Imports everything
import _ from 'lodash'

// ✅ CORRECT - Imports specific function
import debounce from 'lodash/debounce'

// ✅ BETTER - Use native
const debounce = (fn, delay) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}
```

---

## Maintenance Schedule

### Weekly Tasks

```bash
# Check for security issues
npm audit

# Check for outdated packages
npm outdated

# Update patch versions
npm update
```

---

### Monthly Tasks

```bash
# Review dependencies
npm ls --depth=0

# Update minor versions (with testing)
npm install [package]@latest

# Remove unused dependencies
npx depcheck

# Update documentation
# Update this file with any changes
```

---

### Quarterly Tasks

- Review all dependencies
- Evaluate if still needed
- Consider alternatives
- Plan major version updates
- Update dependency documentation

---

## Dependency Documentation

### Current Dependencies

#### Production Dependencies

**Next.js**
- Purpose: Framework
- Bundle Impact: Core framework
- Version: ^15.0.0
- Review: Every major version

**React**
- Purpose: UI library
- Bundle Impact: Core framework
- Version: 19.0.0
- Review: Every major version

**Zod**
- Purpose: Runtime validation
- Bundle Impact: ~10 KB
- Version: ^3.22.4
- Review: Quarterly

**Tailwind CSS**
- Purpose: Styling
- Bundle Impact: ~8 KB (purged)
- Version: ^3.4.0
- Review: Annually

---

#### Development Dependencies

**TypeScript**
- Purpose: Type safety
- Bundle Impact: Build time only
- Version: ^5.0.0

**ESLint**
- Purpose: Code quality
- Bundle Impact: Build time only
- Version: ^8.0.0

**Prettier**
- Purpose: Code formatting
- Bundle Impact: Build time only
- Version: ^3.0.0

---

## Anti-Patterns

### ❌ Adding Without Analysis

```bash
# ❌ WRONG
npm install [package]
# Just add it, we'll see if we need it

# ✅ CORRECT
# 1. Write justification
# 2. Analyze impact
# 3. Get approval
# 4. Add with documentation
```

---

### ❌ Keeping Unused Dependencies

```bash
# Check for unused
npx depcheck

# Remove unused
npm uninstall [package]
```

---

### ❌ Not Pinning Versions

```json
// ❌ WRONG - Vague versioning
{
  "dependencies": {
    "some-package": "*",
    "another-package": "latest"
  }
}

// ✅ CORRECT - Specific versions
{
  "dependencies": {
    "some-package": "^2.1.0",
    "another-package": "~1.5.3"
  }
}
```

---

### ❌ Multiple Libraries for Same Purpose

```json
// ❌ WRONG - Redundant libraries
{
  "dependencies": {
    "date-fns": "^3.0.0",
    "dayjs": "^1.11.0",
    "luxon": "^3.0.0"
  }
}

// ✅ CORRECT - Pick one
{
  "dependencies": {
    "date-fns": "^3.0.0"
  }
}
```

---

## Native Alternatives

### Before Adding Libraries

Consider native solutions:

**Array manipulation:**
```typescript
// ❌ Don't add lodash for this
import uniq from 'lodash/uniq'
const unique = uniq(array)

// ✅ Use native
const unique = [...new Set(array)]
```

**Date formatting:**
```typescript
// ❌ Don't add library for this
import format from 'date-fns/format'
const formatted = format(date, 'yyyy-MM-dd')

// ✅ Use native
const formatted = new Date(date).toLocaleDateString('en-CA')
```

**Debounce:**
```typescript
// ❌ Don't add lodash for this
import debounce from 'lodash/debounce'

// ✅ Use native
const debounce = (fn, delay) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}
```

---

## Emergency Procedures

### If Dependency Causes Issues

**Step 1: Assess Impact**
- Is it breaking production?
- Is it a security issue?
- Is it a performance issue?

**Step 2: Quick Fix**
- Rollback to previous version
- Remove if not critical
- Apply hotfix if available

**Step 3: Long-term Solution**
- Find alternative
- Build custom solution
- Update documentation

---

## Dependency Review Checklist

Before approving any dependency:

✅ Justified need (not "nice to have")  
✅ Bundle size < 50 KB or approved exception  
✅ Actively maintained (updated within 6 months)  
✅ No critical vulnerabilities  
✅ No better native alternative  
✅ No lighter alternative  
✅ Tree-shakeable (if applicable)  
✅ TypeScript support  
✅ Documentation exists  
✅ Exit strategy defined  

---

## Useful Commands

```bash
# Check package size before installing
npx bundle-phobia [package]

# Check for unused dependencies
npx depcheck

# Analyze bundle
npm run analyze

# Check vulnerabilities
npm audit

# Check outdated packages
npm outdated

# Update all patch versions
npm update

# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## Documentation Requirements

For each approved dependency, document:

```markdown
### [Package Name] v[version]

**Purpose:** Brief description  
**Bundle Size:** X KB (gzipped)  
**Added:** YYYY-MM-DD  
**Added By:** Name  
**Justification:** Why needed  
**Alternatives:** What was considered  
**Usage:** Where/how used  
**Review Date:** Next review date  

**Notes:**
- Any special considerations
- Migration notes if needed
```

---

## Status

- **Document Type:** Engineering Standard
- **Status:** ✅ Active
- **Compliance:** Mandatory
- **Review:** Monthly for dependencies, quarterly for policy