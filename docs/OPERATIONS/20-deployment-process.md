# 20 - Deployment Process

## Document Status

**Status:** ✅ ACTIVE  
**Version:** 1.0.0  
**Last Updated:** 2026-01-26  
**Authority:** Operations Standards

---

## Purpose

This document defines the **complete deployment process** from code commit to production. Every deployment must follow this process.

**Why this matters:**
- Consistency: Same process every time
- Reliability: Catch issues before production
- Traceability: Clear deployment history
- Rollback: Easy to undo if needed
- Quality: Maintain high standards

---

## Deployment Environments

### 1. Development (Local)

**Purpose:** Local development and testing

**Access:** Developer machines only  
**URL:** http://localhost:3000  
**Updates:** On file save (hot reload)  

---

### 2. Preview (Vercel)

**Purpose:** Test branches and PRs

**Access:** Team and reviewers  
**URL:** https://portfolio-v1-git-[branch].vercel.app  
**Updates:** On every push to branch  
**Lifespan:** Until branch is deleted  

---

### 3. Production (Vercel)

**Purpose:** Live site for users

**Access:** Public  
**URL:** https://yourdomain.com  
**Updates:** On merge to main branch  
**Availability:** 24/7  

---

## Deployment Workflow

### Standard Deployment Flow

```
Developer → Git Push → GitHub → Vercel → Production
    ↓
  Tests
    ↓
  Build
    ↓
  Deploy
    ↓
  Verify
```

---

### Detailed Steps

**Step 1: Development**
```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes
# ... code ...

# Run local checks
npm run lint
npm run type-check
npm test
npm run build
```

---

**Step 2: Commit**
```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat(blog): add search functionality"

# Push to GitHub
git push origin feature/feature-name
```

---

**Step 3: Pull Request**
1. Create PR on GitHub
2. Fill in PR template
3. Request reviews
4. Wait for CI checks

---

**Step 4: CI/CD Checks (Automatic)**
```yaml
# GitHub Actions runs:
- Linting (ESLint)
- Type checking (TypeScript)
- Tests (Vitest)
- Build check
- Security audit
```

---

**Step 5: Code Review**
- Reviewer checks code quality
- Reviewer tests preview deployment
- Reviewer approves or requests changes

---

**Step 6: Merge to Main**
```bash
# After approval
# Merge PR on GitHub (squash and merge)
```

---

**Step 7: Automatic Deployment**
- Vercel detects push to main
- Builds production bundle
- Runs checks
- Deploys to production

---

**Step 8: Post-Deployment Verification**
```bash
# Verify deployment
- Check site loads
- Run smoke tests
- Monitor errors
- Check analytics
```

---

## Pre-Deployment Checklist

### Code Quality

✅ All tests passing  
✅ ESLint: 0 errors  
✅ TypeScript: 0 errors  
✅ Build succeeds locally  
✅ No console.logs (except errors)  
✅ No debug code  
✅ No commented code  

---

### Security

✅ Security checklist complete  
✅ npm audit: 0 critical issues  
✅ No exposed secrets  
✅ Environment variables configured  
✅ Input validation present  
✅ Error messages safe  

---

### Performance

✅ Bundle size within budget  
✅ Lighthouse score > 90  
✅ Images optimized  
✅ No unnecessary dependencies  
✅ Code splitting implemented  

---

### Documentation

✅ README updated  
✅ Changelog updated  
✅ API docs current  
✅ Comments added  
✅ Migration notes (if needed)  

---

### Testing

✅ Unit tests passing  
✅ Integration tests passing  
✅ Manual testing complete  
✅ Edge cases tested  
✅ Error scenarios tested  

---

## Deployment Commands

### Manual Deployment (Emergency Only)

```bash
# Deploy to production manually
vercel --prod

# Deploy specific commit
vercel --prod --sha=abc123

# Deploy with environment
vercel --prod --env=production
```

---

### Rollback

```bash
# Rollback to previous version
vercel rollback

# Rollback to specific deployment
vercel rollback [deployment-url]
```

---

## Git Workflow

### Branch Naming

```
feature/feature-name    # New features
fix/bug-description     # Bug fixes
docs/update-readme      # Documentation
refactor/component-name # Code refactoring
chore/update-deps       # Maintenance
```

---

### Commit Messages

**Format:**
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
feat(blog): add search functionality

Add client-side search for blog posts using fuzzy matching.
Improves UX by allowing users to quickly find relevant content.

Closes #123

fix(contact): resolve form validation error

Contact form was not validating email correctly.
Fixed regex pattern to properly validate email addresses.

refactor(blog): extract post loading logic

Move post loading logic from component to service layer
for better separation of concerns and testability.
```

---

## CI/CD Configuration

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Test
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Security audit
        run: npm audit --audit-level=high
```

---

## Vercel Configuration

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  
  "env": {
    "NEXT_PUBLIC_SITE_URL": "https://yourdomain.com"
  },
  
  "build": {
    "env": {
      "NEXT_PUBLIC_SITE_URL": "https://yourdomain.com"
    }
  },
  
  "git": {
    "deploymentEnabled": {
      "main": true
    }
  }
}
```

---

## Deployment Scenarios

### Scenario 1: Regular Feature Deployment

**Trigger:** Merge to main  
**Process:** Automatic  
**Duration:** ~3-5 minutes  

**Steps:**
1. PR merged to main
2. Vercel detects push
3. Builds production bundle
4. Runs production build
5. Deploys to production
6. Invalidates CDN cache
7. Deployment complete

**Verification:**
- Site accessible
- New feature visible
- No errors in console
- Analytics tracking

---

### Scenario 2: Hotfix Deployment

**Trigger:** Critical bug in production  
**Process:** Fast-tracked  
**Duration:** ~10-15 minutes  

**Steps:**
1. Create hotfix branch from main
2. Fix the bug
3. Test locally
4. Create PR (can skip some review)
5. Merge immediately after basic checks
6. Monitor deployment closely
7. Verify fix in production

**Post-Deployment:**
- Monitor error rates
- Check user reports
- Document the incident
- Add tests to prevent recurrence

---

### Scenario 3: Rollback

**Trigger:** Critical issue detected  
**Process:** Immediate  
**Duration:** ~1-2 minutes  

**Steps:**
1. Identify issue
2. Decide to rollback
3. Execute rollback command
4. Verify old version restored
5. Investigate issue
6. Prepare proper fix

```bash
# Rollback command
vercel rollback
```

---

## Post-Deployment

### Immediate Checks (0-5 minutes)

```markdown
- [ ] Site loads successfully
- [ ] Homepage renders correctly
- [ ] Navigation works
- [ ] New feature functional
- [ ] No JavaScript errors
- [ ] No CSS issues
- [ ] Forms work
- [ ] Links work
```

---

### Short-term Monitoring (5-60 minutes)

```markdown
- [ ] Error rate normal
- [ ] Response times good
- [ ] No spike in 404s
- [ ] Analytics tracking
- [ ] User feedback checked
- [ ] Social media mentions
```

---

### Long-term Monitoring (1-24 hours)

```markdown
- [ ] Core Web Vitals stable
- [ ] Performance metrics good
- [ ] User engagement normal
- [ ] Conversion rates stable
- [ ] SEO metrics maintained
```

---

## Deployment Notifications

### Slack Integration (Optional)

```markdown
Deployment started:
📦 Portfolio Pro - Deployment Started
Branch: main
Commit: feat(blog): add search
Author: Developer Name
URL: Building...

Deployment successful:
✅ Portfolio Pro - Deployment Successful
Environment: Production
URL: https://yourdomain.com
Duration: 3m 24s
Deployed by: Developer Name

Deployment failed:
❌ Portfolio Pro - Deployment Failed
Error: Build failed
Logs: [View Logs]
```

---

## Rollback Procedure

### When to Rollback

**Immediate rollback if:**
- Site is completely down
- Critical feature broken
- Data loss risk
- Security vulnerability exposed
- Error rate > 5%

**Consider rollback if:**
- Non-critical features broken
- Performance degradation > 20%
- User complaints spike
- Analytics show issues

---

### Rollback Steps

**Step 1: Assess**
```markdown
- What's broken?
- How many users affected?
- Can we fix forward?
- Is rollback necessary?
```

**Step 2: Execute**
```bash
# Rollback via Vercel CLI
vercel rollback

# Or via Vercel Dashboard
# Go to Deployments → Select previous → Promote to Production
```

**Step 3: Verify**
```markdown
- [ ] Previous version deployed
- [ ] Site functional
- [ ] Issue resolved
- [ ] Users can access site
```

**Step 4: Communicate**
```markdown
- Notify team
- Update status page (if applicable)
- Inform affected users (if needed)
```

**Step 5: Fix Forward**
```markdown
- Identify root cause
- Create fix
- Test thoroughly
- Deploy again
```

---

## Deployment Metrics

### Track These Metrics

**Deployment Frequency:**
- Target: 2-3 per week
- Measure: Deployments per week

**Deployment Success Rate:**
- Target: > 95%
- Measure: Successful / Total deployments

**Deployment Duration:**
- Target: < 5 minutes
- Measure: Time from push to live

**Mean Time to Recover (MTTR):**
- Target: < 10 minutes
- Measure: Time to rollback/fix

**Change Failure Rate:**
- Target: < 5%
- Measure: Deployments requiring rollback

---

## Troubleshooting

### Build Fails

**Check:**
- Error message in Vercel logs
- Local build works?
- Environment variables set?
- Dependencies installed?
- TypeScript errors?

**Fix:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

---

### Deployment Succeeds but Site Broken

**Check:**
- JavaScript console errors
- Network tab for failed requests
- Environment variables in production
- API endpoints accessible
- Database connection (if applicable)

**Fix:**
- Check Vercel logs
- Verify environment variables
- Test API endpoints
- Check error tracking

---

### Performance Degradation

**Check:**
- Lighthouse score
- Core Web Vitals
- Bundle size
- Number of requests
- Response times

**Fix:**
- Analyze bundle
- Optimize images
- Review recent changes
- Check caching

---

## Emergency Procedures

### Site Down

**Immediate Actions:**
1. Confirm issue (check from multiple locations)
2. Check Vercel status
3. Review recent deployments
4. Rollback if needed
5. Notify team

**Investigation:**
1. Check error logs
2. Review recent changes
3. Test locally
4. Identify root cause

**Resolution:**
1. Fix the issue
2. Test thoroughly
3. Deploy fix
4. Monitor closely
5. Document incident

---

## Deployment Best Practices

### DO

✅ Deploy during low-traffic hours  
✅ Test thoroughly before deploying  
✅ Monitor after deployment  
✅ Keep deployments small  
✅ Deploy frequently  
✅ Have rollback ready  
✅ Document changes  

### DON'T

❌ Deploy on Fridays (unless necessary)  
❌ Deploy multiple features at once  
❌ Deploy without testing  
❌ Deploy without backup  
❌ Skip documentation  
❌ Ignore warnings  
❌ Deploy and leave  

---

## Status

- **Document Type:** Operations Standard
- **Status:** ✅ Active
- **Compliance:** Mandatory for all deployments
- **Review:** Monthly or after incidents