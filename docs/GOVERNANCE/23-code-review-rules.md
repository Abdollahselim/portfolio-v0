# 23 - Code Review Rules

## Document Status

**Status:** ✅ ACTIVE  
**Version:** 1.0.0  
**Last Updated:** 2026-01-26  
**Authority:** Governance Standards

---

## Purpose

This document defines **how code reviews are conducted** in this project. Code reviews are critical for maintaining quality and sharing knowledge.

**Why this matters:**
- Quality: Catch bugs before production
- Learning: Share knowledge across team
- Consistency: Enforce standards
- Ownership: Collective responsibility
- Documentation: Review comments serve as documentation

---

## Code Review Philosophy

### Core Principles

1. **Code reviews are not optional**
   - All code must be reviewed
   - No exceptions (except emergencies)

2. **Reviews are about the code, not the person**
   - Critique the code, not the developer
   - Be respectful and constructive
   - Focus on improvement

3. **Everyone reviews, everyone gets reviewed**
   - Juniors review seniors
   - Seniors review juniors
   - Learn from each review

4. **Reviews should be timely**
   - Review within 24 hours
   - Don't let PRs sit
   - Block time for reviews

---

## What to Review

### Code Quality

**Structure:**
- ✅ Clear and logical organization
- ✅ Proper separation of concerns
- ✅ Single responsibility principle
- ✅ DRY (Don't Repeat Yourself)

**Readability:**
- ✅ Clear variable names
- ✅ Appropriate comments
- ✅ Consistent formatting
- ✅ Self-documenting code

**Correctness:**
- ✅ Logic is sound
- ✅ Edge cases handled
- ✅ No obvious bugs
- ✅ Matches requirements

---

### Architecture Compliance

**Layer Separation:**
- ✅ Correct layer for each file
- ✅ Import direction correct
- ✅ No circular dependencies
- ✅ Proper abstraction levels

**File Organization:**
- ✅ Files in correct folders
- ✅ Naming conventions followed
- ✅ Feature boundaries respected
- ✅ No orphaned files

---

### Security

**Input Validation:**
- ✅ All inputs validated
- ✅ Type checking present
- ✅ Sanitization applied
- ✅ No SQL injection risks

**Data Protection:**
- ✅ No exposed secrets
- ✅ Secure error messages
- ✅ No sensitive data in logs
- ✅ Proper authentication

**Common Vulnerabilities:**
- ✅ No XSS risks
- ✅ No CSRF vulnerabilities
- ✅ No insecure dependencies
- ✅ Input/output encoding

---

### Performance

**Bundle Impact:**
- ✅ Bundle size acceptable
- ✅ No unnecessary imports
- ✅ Tree shaking effective
- ✅ Code splitting used

**Runtime Performance:**
- ✅ No unnecessary re-renders
- ✅ Proper memoization
- ✅ Lazy loading applied
- ✅ Efficient algorithms

**Assets:**
- ✅ Images optimized
- ✅ Fonts optimized
- ✅ Critical CSS inlined
- ✅ Resources lazy loaded

---

### Testing

**Coverage:**
- ✅ Tests for new code
- ✅ Tests for changes
- ✅ Edge cases tested
- ✅ Coverage maintained

**Quality:**
- ✅ Tests are clear
- ✅ Tests are focused
- ✅ No flaky tests
- ✅ Good assertions

---

### Documentation

**Code Documentation:**
- ✅ JSDoc for public APIs
- ✅ Comments for complex logic
- ✅ Clear function descriptions
- ✅ Type documentation

**Project Documentation:**
- ✅ README updated if needed
- ✅ Changelog updated
- ✅ API docs updated
- ✅ Migration notes if needed

---

## Review Process

### Step 1: Preparation

**Before Starting Review:**
1. Read PR description
2. Understand the context
3. Check related issues
4. Review design docs if applicable
5. Pull branch locally if needed

---

### Step 2: First Pass

**Quick Check:**
- PR size reasonable?
- CI checks passing?
- Build succeeds?
- Tests pass?
- Description clear?

**If any fail:** Request fixes before detailed review

---

### Step 3: Detailed Review

**Code Review:**
1. Review changed files
2. Check for issues
3. Verify standards compliance
4. Test locally if needed
5. Leave comments

**Focus Areas:**
- Correctness
- Architecture
- Security
- Performance
- Testing
- Documentation

---

### Step 4: Feedback

**Leave Comments:**
- Be specific
- Explain reasoning
- Suggest solutions
- Ask questions
- Praise good work

**Comment Types:**
- ❌ Must fix (blocking)
- 💡 Suggestion (optional)
- ❓ Question (needs answer)
- 📝 Note (informational)
- 🎉 Praise (positive feedback)

---

### Step 5: Decision

**Options:**
1. **Approve** - Ready to merge
2. **Request Changes** - Must fix before merge
3. **Comment** - Feedback without blocking

---

## Comment Guidelines

### How to Write Good Comments

**Be Specific:**
```markdown
❌ Bad: "This is wrong"
✅ Good: "This function should validate email format. 
Consider using Zod schema validation here."
```

**Explain Why:**
```markdown
❌ Bad: "Use const instead of let"
✅ Good: "Use const instead of let because this value 
isn't reassigned. This prevents accidental mutations."
```

**Suggest Solutions:**
```markdown
❌ Bad: "This is inefficient"
✅ Good: "This loops through the array multiple times. 
Consider combining these operations:
```typescript
const result = array.filter(x => x > 0).map(x => x * 2)
```
```

**Ask Questions:**
```markdown
❌ Bad: "Why did you do this?"
✅ Good: "I'm curious about the approach here. Could you 
explain why you chose X over Y? I want to understand 
the trade-offs."
```

**Praise Good Work:**
```markdown
✅ Good: "Nice use of memoization here! This will 
prevent unnecessary recalculations."
```

---

## Comment Examples

### Code Quality

**Naming:**
```markdown
💡 Consider renaming `data` to `blogPosts` for clarity.
It makes the code more self-documenting.
```

**Complexity:**
```markdown
❌ This function is doing too much. Consider breaking it into:
1. `validateInput()`
2. `processData()`
3. `saveResult()`

This improves testability and readability.
```

**DRY:**
```markdown
📝 This logic is duplicated in `ComponentA.tsx` line 45.
Consider extracting to a shared utility function.
```

---

### Architecture

**Layer Violation:**
```markdown
❌ Presentation layer shouldn't import directly from 
Infrastructure layer. 

Should be:
Presentation → Application → Infrastructure

Please move this logic to a service in the Application layer.
```

**Import Direction:**
```markdown
❌ This creates a circular dependency:
features/blog → features/user → features/blog

Consider using shared types instead of importing features 
from each other.
```

---

### Security

**Input Validation:**
```markdown
❌ User input isn't validated here. This could lead to 
security issues.

Please add Zod schema validation:
```typescript
const schema = z.object({
  email: z.string().email(),
  message: z.string().min(10).max(1000)
})
```
```

**Exposed Secrets:**
```markdown
❌ CRITICAL: API key is hardcoded. This will be exposed 
in the client bundle.

Move to environment variable:
```typescript
const apiKey = process.env.API_KEY
```
```

---

### Performance

**Bundle Size:**
```markdown
⚠️ This adds lodash to the bundle (+70KB). 

Consider:
1. Use native methods
2. Import specific function: `import debounce from 'lodash/debounce'`
3. Write custom implementation
```

**Unnecessary Re-renders:**
```markdown
💡 This function is recreated on every render. 
Consider wrapping in useCallback:

```typescript
const handleClick = useCallback(() => {
  // handler
}, [dependencies])
```
```

---

### Testing

**Missing Tests:**
```markdown
❌ No tests for the error case. Please add test for:
- Invalid input
- Network failure
- Unexpected response
```

**Test Quality:**
```markdown
💡 This test is testing implementation details. 
Consider testing behavior instead:

❌ expect(useState).toHaveBeenCalled()
✅ expect(screen.getByText('Result')).toBeInTheDocument()
```

---

## Review Checklist

### For Every PR

**Before Approving:**

**Code Quality:**
✅ Follows coding standards  
✅ Clear and maintainable  
✅ No code smells  
✅ Properly commented  

**Architecture:**
✅ Fits architecture  
✅ Layer separation maintained  
✅ Proper file organization  
✅ No circular dependencies  

**Security:**
✅ Input validated  
✅ No exposed secrets  
✅ Secure error handling  
✅ No vulnerabilities  

**Performance:**
✅ Bundle impact acceptable  
✅ No performance regressions  
✅ Assets optimized  
✅ Lazy loading used  

**Testing:**
✅ Tests added/updated  
✅ Tests pass  
✅ Coverage maintained  
✅ Edge cases covered  

**Documentation:**
✅ Code documented  
✅ README updated  
✅ API docs updated  
✅ Changelog updated  

---

## Response Time

### Target Times

**Initial Review:**
- Small PR (< 100 lines): 2-4 hours
- Medium PR (100-300 lines): 4-8 hours
- Large PR (> 300 lines): 8-24 hours

**Follow-up Review:**
- After changes: 1-2 hours
- Final approval: Same day

---

### Priority

**High Priority (Review ASAP):**
- Hotfixes
- Blocking others
- Security fixes
- Production issues

**Normal Priority:**
- Features
- Bug fixes
- Improvements

**Low Priority:**
- Documentation only
- Minor tweaks
- Nice-to-haves

---

## Common Review Mistakes

### To Avoid

**❌ Approving Without Reading:**
Don't approve just to be nice. Actually review the code.

**❌ Being Too Harsh:**
Remember you're reviewing code, not the person.

**❌ Nitpicking Minor Issues:**
Focus on important issues. Don't block PR for style preferences.

**❌ Not Explaining:**
Always explain why you're suggesting a change.

**❌ Delaying Reviews:**
Don't let PRs sit for days. Review promptly.

**❌ Not Testing:**
Don't approve complex changes without testing locally.

**❌ Ignoring Tests:**
Always check that tests exist and are meaningful.

---

## Handling Disagreements

### When You Disagree with Author

**Process:**
1. **Explain Your Concern:**
   - Be specific
   - Provide examples
   - Explain impact

2. **Understand Their Reasoning:**
   - Ask why they chose this approach
   - Listen to their explanation
   - Consider their perspective

3. **Discuss Alternatives:**
   - Present your suggestion
   - Explain benefits
   - Discuss trade-offs

4. **Reach Consensus:**
   - Find middle ground
   - Agree on approach
   - Document decision

5. **Escalate if Needed:**
   - If can't agree, involve tech lead
   - Present both options
   - Accept decision

---

### When Reviewer is Wrong

**As Author:**
1. **Politely Disagree:**
   ```markdown
   I see your point, but I chose this approach because [reason].
   
   Alternatives I considered:
   - Option A: [why not suitable]
   - Option B: [why not suitable]
   
   Happy to discuss further!
   ```

2. **Provide Context:**
   - Explain your reasoning
   - Share relevant information
   - Link to documentation

3. **Be Open:**
   - Maybe they're right
   - Consider their perspective
   - Be willing to change

---

## Special Review Cases

### Reviewing Your Own Code

**When Allowed:**
- Documentation-only changes
- Typo fixes
- Emergency hotfixes (with post-review)

**When NOT Allowed:**
- Feature implementations
- Bug fixes
- Architecture changes
- Security changes

---

### Reviewing Senior Developers

**As Junior:**
- Don't be intimidated
- Ask questions
- Learn from their code
- Suggest improvements respectfully
- Focus on issues, not style

**Remember:** Everyone makes mistakes. Your review is valuable.

---

### Emergency Reviews

**For Hotfixes:**
1. Review immediately
2. Focus on the fix only
3. Check it works
4. Approve if safe
5. Follow up with full review later

---

## Review Metrics

### Track These

**Review Time:**
- Time to first comment
- Time to approval
- Total review time

**Review Quality:**
- Issues found
- Issues fixed
- Bugs prevented

**Team Health:**
- Review participation
- Feedback quality
- Learning outcomes

---

## Best Practices

### For Reviewers

**DO:**
✅ Review promptly  
✅ Be thorough but efficient  
✅ Be constructive  
✅ Explain your reasoning  
✅ Praise good work  
✅ Ask questions  
✅ Test locally when needed  

**DON'T:**
❌ Rush reviews  
❌ Approve without reading  
❌ Be unnecessarily critical  
❌ Nitpick style  
❌ Ignore security/performance  
❌ Delay feedback  

---

### For Authors

**DO:**
✅ Respond to feedback promptly  
✅ Be open to suggestions  
✅ Ask for clarification  
✅ Thank reviewers  
✅ Make requested changes  
✅ Update PR description  

**DON'T:**
❌ Argue defensively  
❌ Ignore feedback  
❌ Make unrelated changes  
❌ Force merge  
❌ Rush reviewers  

---

## Status

- **Document Type:** Governance Standard
- **Status:** ✅ Active
- **Compliance:** Mandatory
- **Review:** Quarterly