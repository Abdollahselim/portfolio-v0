# 22 - Approval Process

## Document Status

**Status:** ✅ ACTIVE  
**Version:** 1.0.0  
**Last Updated:** 2026-01-26  
**Authority:** Governance Standards

---

## Purpose

This document defines **who can approve what** in this project. Clear approval processes prevent chaos and ensure quality.

**Why this matters:**
- Quality control: Multiple eyes catch issues
- Accountability: Clear responsibility
- Consistency: Same standards applied
- Learning: Knowledge sharing through reviews
- Safety: Prevent breaking changes

---

## Approval Hierarchy

### Level 1: Self-Approval

**Who:** Individual developer  
**What:** Minor changes, documentation updates  
**Requirements:** Passes all automated checks  

**Examples:**
- Typo fixes in documentation
- Comment updates
- README improvements
- Minor style adjustments

**Process:**
1. Make changes
2. Run local checks
3. Commit directly to feature branch
4. Create PR

---

### Level 2: Peer Review

**Who:** Another developer  
**What:** Most feature development  
**Requirements:** 1 approval + all checks pass  

**Examples:**
- New features
- Bug fixes
- Component updates
- Service changes
- Test additions

**Process:**
1. Create feature branch
2. Implement changes
3. Create PR with description
4. Request review
5. Address feedback
6. Get approval
7. Merge

---

### Level 3: Lead Approval

**Who:** Technical lead  
**What:** Major changes, architecture decisions  
**Requirements:** Lead approval + all checks pass  

**Examples:**
- Architecture changes
- New dependencies
- Breaking changes
- Security-critical code
- Performance-critical code

**Process:**
1. Write design document
2. Get design approved
3. Implement changes
4. Create PR with detailed explanation
5. Request lead review
6. Address feedback
7. Get approval
8. Merge

---

## What Requires Approval

### Code Changes

**Always Requires Approval:**
- ✅ New features
- ✅ Bug fixes
- ✅ Refactoring
- ✅ API changes
- ✅ Database schema changes
- ✅ Security changes
- ✅ Performance changes

**May Not Require Approval:**
- Documentation only (typos, clarifications)
- Comment updates
- README updates (minor)

---

### Documentation Changes

**Requires Approval:**
- ✅ CORE docs (always)
- ✅ ENGINEERING docs (if substantial)
- ✅ Architecture decisions
- ✅ Process changes

**May Not Require Approval:**
- Minor typo fixes
- Comment clarifications
- Example updates

---

### Configuration Changes

**Always Requires Approval:**
- ✅ Environment variables
- ✅ Security settings
- ✅ Build configuration
- ✅ Deployment settings
- ✅ CI/CD configuration

---

### Dependency Changes

**Always Requires Lead Approval:**
- ✅ Adding new dependency
- ✅ Major version updates
- ✅ Removing dependency

**Requires Peer Approval:**
- Minor/patch updates
- Dev dependency changes

---

## Pull Request Requirements

### PR Template

```markdown
## Description
[What does this PR do?]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #[issue number]

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tests added/updated
- [ ] Manual testing completed
- [ ] All tests passing

## Checklist
- [ ] Code follows coding standards
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console.logs
- [ ] Bundle size checked
- [ ] Security reviewed
- [ ] Performance impact assessed

## Screenshots (if applicable)
[Add screenshots]

## Additional Notes
[Any additional context]
```

---

### PR Size Guidelines

**Small PR (Preferred):**
- < 200 lines changed
- Single feature/fix
- Easy to review
- Fast approval

**Medium PR:**
- 200-500 lines changed
- Related changes
- Requires careful review

**Large PR (Avoid):**
- > 500 lines changed
- Multiple features
- Hard to review
- Should be split

**How to Keep PRs Small:**
- Break features into smaller parts
- Use feature flags if needed
- Separate refactoring from features
- Make documentation updates separately

---

## Review Process

### For Reviewers

**What to Check:**

**Code Quality:**
- ✅ Follows coding standards
- ✅ No code smells
- ✅ Proper error handling
- ✅ Clear naming
- ✅ DRY principle followed

**Architecture:**
- ✅ Fits architecture
- ✅ Layer separation maintained
- ✅ Import direction correct
- ✅ No circular dependencies

**Security:**
- ✅ Input validation present
- ✅ No exposed secrets
- ✅ Secure error messages
- ✅ No XSS vulnerabilities

**Performance:**
- ✅ Bundle impact acceptable
- ✅ No unnecessary re-renders
- ✅ Images optimized
- ✅ Lazy loading used

**Testing:**
- ✅ Tests added/updated
- ✅ Tests pass
- ✅ Coverage maintained
- ✅ Edge cases covered

**Documentation:**
- ✅ Comments for complex logic
- ✅ JSDoc for public APIs
- ✅ README updated if needed
- ✅ Changelog updated

---

### Review Timeline

**Target Response Time:**
- Small PR: 4 hours
- Medium PR: 8 hours
- Large PR: 24 hours

**Target Approval Time:**
- Simple changes: Same day
- Complex changes: 1-2 days
- Architecture changes: 2-3 days

---

### Review Comments

**How to Give Feedback:**

**Request Changes:**
```markdown
❌ This needs to change
Reason: [Explain why]
Suggestion: [How to fix]
```

**Suggestion:**
```markdown
💡 Consider this approach
[Explain alternative]
[Why it might be better]
```

**Question:**
```markdown
❓ Why did you choose this approach?
[Context for question]
```

**Approval with Minor:**
```markdown
✅ Looks good overall!
Minor suggestion: [Optional improvement]
```

**Praise:**
```markdown
🎉 Great implementation!
[What's particularly good]
```

---

### How to Respond to Feedback

**For PR Author:**

**If you agree:**
```markdown
✅ Fixed in [commit hash]
Thanks for catching this!
```

**If you disagree:**
```markdown
I chose this approach because [reason]
Alternatives considered:
- Option A: [why not]
- Option B: [why not]
Happy to discuss further.
```

**If you need clarification:**
```markdown
Can you elaborate on [specific point]?
I want to make sure I understand correctly.
```

---

## Approval Authority

### Who Can Approve What

**Any Developer:**
- Documentation fixes
- Test updates
- Comment improvements

**Peer Developer:**
- Feature implementations
- Bug fixes
- Component updates
- Most PRs

**Technical Lead:**
- Architecture changes
- New dependencies
- Breaking changes
- Security-critical changes
- Major refactoring

---

## Special Approval Cases

### Hotfix Approval

**Situation:** Critical bug in production

**Process:**
1. Create hotfix branch
2. Fix the issue
3. Test locally
4. Create PR
5. Request immediate review
6. Lead can approve alone
7. Merge and deploy
8. Follow up with normal review

**Requirements:**
- Clear description of issue
- Minimal changes (fix only)
- Manual testing completed
- Monitoring plan in place

---

### Emergency Deployment

**Situation:** Site is down, immediate fix needed

**Process:**
1. Fix the issue
2. Test locally
3. Deploy immediately
4. Create PR retroactively
5. Get post-deployment approval
6. Document incident

**Authority:** Technical lead or designated person

---

### Breaking Changes

**Always Requires:**
- Design document
- Migration plan
- Lead approval
- Team notification
- Documentation update

**Process:**
1. Write design doc explaining need
2. Get design approved
3. Plan migration strategy
4. Implement with feature flag if possible
5. Document migration steps
6. Get approval
7. Communicate to users

---

## Approval Checklist

### Before Requesting Approval

**Developer Checklist:**
✅ All tests passing  
✅ ESLint passing  
✅ TypeScript passing  
✅ Build succeeds  
✅ Manual testing done  
✅ Documentation updated  
✅ PR description complete  
✅ Commits squashed/cleaned  
✅ Branch up to date with main  

---

### Before Approving

**Reviewer Checklist:**
✅ Code quality acceptable  
✅ Architecture maintained  
✅ Security reviewed  
✅ Performance acceptable  
✅ Tests adequate  
✅ Documentation sufficient  
✅ No obvious issues  
✅ Preview deployment tested  

---

## Merge Strategies

### When to Use Each

**Squash and Merge (Preferred):**
- Most PRs
- Keeps main history clean
- Good commit message required

**Merge Commit:**
- Complex features
- Want to preserve history
- Multiple related commits

**Rebase and Merge:**
- Linear history desired
- Simple changes
- Few commits

**Our Default:** Squash and Merge

---

## Post-Approval

### After PR is Approved

1. **Wait for CI/CD:** Ensure all checks pass
2. **Squash Commits:** Clean up commit history
3. **Update Commit Message:** Clear description
4. **Merge:** Click merge button
5. **Delete Branch:** Clean up remote branch
6. **Monitor:** Watch deployment
7. **Close Issue:** If applicable

---

## Metrics

### Track These

**Review Time:**
- Time to first review
- Time to approval
- Target: < 24 hours

**PR Size:**
- Lines changed
- Files changed
- Target: < 300 lines

**Approval Rate:**
- PRs approved on first review
- Target: > 70%

**Rework Rate:**
- PRs requiring changes
- Target: < 30%

---

## Common Issues

### PR Sits Without Review

**Solution:**
- Ping reviewer in PR
- Ask in team chat
- Request different reviewer
- Escalate if urgent

---

### Disagreement on Approach

**Solution:**
1. Discuss in PR comments
2. Schedule call if needed
3. Present both options
4. Lead makes final decision
5. Document decision

---

### Reviewer Unavailable

**Solution:**
- Request alternate reviewer
- Lead can review
- If urgent, explain and get expedited review

---

## Best Practices

### For Authors

**DO:**
✅ Keep PRs small  
✅ Write clear descriptions  
✅ Respond to feedback promptly  
✅ Test thoroughly  
✅ Update documentation  

**DON'T:**
❌ Create huge PRs  
❌ Argue defensively  
❌ Ignore feedback  
❌ Rush reviews  
❌ Merge without approval  

---

### For Reviewers

**DO:**
✅ Review promptly  
✅ Be constructive  
✅ Explain reasoning  
✅ Ask questions  
✅ Praise good work  

**DON'T:**
❌ Delay reviews  
❌ Be overly critical  
❌ Approve without reviewing  
❌ Nitpick minor issues  
❌ Forget to approve  

---

## Status

- **Document Type:** Governance Standard
- **Status:** ✅ Active
- **Compliance:** Mandatory
- **Review:** Quarterly