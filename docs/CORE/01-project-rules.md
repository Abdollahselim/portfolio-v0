# 01 - Project Rules (🔒 LOCKED)

## ⚠️ CRITICAL: This Document is LOCKED

**Status:** 🔒 LOCKED  
**Modification:** FORBIDDEN without formal approval  
**Authority:** Project Constitution  
**Last Lock Date:** 2026-01-26

This document establishes the **immutable laws** of this project. These are not guidelines or suggestions—they are **absolute rules** that govern all development.

---

## Constitutional Rules

### Rule #1: Documentation Before Code
```
NO code is written before its documentation exists.
NO feature is built before its design is approved.
NO component is created before its architecture is defined.
```

**Violation Consequence:** Code rejection, mandatory rewrite

---

### Rule #2: Architecture is Sacred
```
The architecture defined in 02-architecture.md is law.
Layer violations are FORBIDDEN.
Import direction must be respected.
Circular dependencies are REJECTED.
```

**Violation Consequence:** Automatic rejection, architectural review required

---

### Rule #3: One Source of Truth
```
For every concern, there is ONE authoritative document.
Conflicting information = documentation failure.
When in doubt, the CORE docs take precedence.
```

**Precedence Order:**
1. `01-project-rules.md` (this file)
2. `02-architecture.md`
3. `00-project-overview.md`
4. ENGINEERING docs
5. All other documentation

---

### Rule #4: Quality is Non-Negotiable
```
Code quality standards are MINIMUM requirements.
Performance budgets cannot be exceeded.
Security checklists must be completed.
Test coverage requirements are mandatory.
```

**No exceptions.** Not for deadlines, not for "quick fixes", not for MVPs.

---

### Rule #5: No Premature Optimization
```
Build it right, then make it fast.
Measure before optimizing.
Clarity over cleverness.
Simple solutions win.
```

But also:

```
No premature optimization ≠ Build it badly
We build it right the first time.
```

---

### Rule #6: Dependencies are Liabilities
```
Every dependency must be justified.
Default answer to "Should we add X?" is NO.
Bundle size impact must be measured.
Alternatives must be considered first.
```

**Required for new dependencies:**
- Written justification
- Size impact analysis
- Alternative evaluation
- Maintenance cost assessment

---

### Rule #7: Explicit Over Implicit
```
Magic is forbidden.
Convention over configuration is REJECTED.
Everything must be explicit and traceable.
No hidden behavior.
```

**Why:** If you can't explain how it works, it doesn't belong here.

---

### Rule #8: Features Must Earn Their Place
```
Every feature must justify:
- Why it exists
- What problem it solves
- What it costs (performance, complexity, maintenance)
- Why alternatives were rejected
```

**No feature creep. No "nice to haves". Only justified additions.**

---

### Rule #9: Error Handling is Mandatory
```
NO code ships without error handling.
NO user sees technical error messages.
NO errors fail silently.
ALL edge cases must be considered.
```

See `05-error-handling.md` for standards.

---

### Rule #10: Security First
```
Security is not optional.
Security is not added later.
Security is built in from the start.
```

**Every feature must complete security checklist before merge.**

---

## Development Rules

### Code Review Rules
```
✅ All code must be reviewed
✅ No self-merge allowed
✅ Tests must pass
✅ Docs must be updated
✅ Performance budget respected
```

### Git Commit Rules
```
Format: <type>(<scope>): <subject>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation only
- style: Formatting changes
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

Example: feat(blog): add MDX rendering system
```

### Branch Rules
```
main: Production-ready code only
develop: Integration branch
feature/*: New features
fix/*: Bug fixes
docs/*: Documentation updates
```

---

## What Cannot Be Compromised

### Never Sacrifice:
1. **Code Quality** - for speed
2. **Architecture** - for convenience
3. **Security** - for features
4. **Documentation** - for deadlines
5. **Testing** - for shipping faster
6. **User Experience** - for developer convenience

### Always Prioritize:
1. **Correctness** over speed
2. **Clarity** over cleverness
3. **Simplicity** over features
4. **Maintainability** over quick wins
5. **Long-term** over short-term

---

## The "Why" Behind These Rules

These rules exist because:

1. **Technical Debt is Expensive**
   - Fixing bad architecture later costs 10x more
   - Bad code compounds exponentially
   - Shortcuts become permanent problems

2. **Quality Attracts Opportunity**
   - This project represents your capabilities
   - Professional work attracts professional opportunities
   - Cutting corners shows in the final product

3. **Systems Outlive Features**
   - Good architecture supports any feature
   - Bad architecture limits everything
   - The foundation determines the ceiling

4. **Discipline Creates Freedom**
   - Clear rules eliminate decision fatigue
   - Standards enable faster development
   - Structure supports creativity

---

## Rule Modification Process

These rules can ONLY be modified through:

1. **Formal Proposal**
   - Written justification
   - Impact analysis
   - Alternative evaluation

2. **Review Period**
   - Minimum 48 hours consideration
   - Consequences documented
   - Precedent implications analyzed

3. **Approval**
   - Technical lead approval required
   - Stakeholder consensus needed
   - Update history recorded

**Casual rule changes are FORBIDDEN.**

---

## Enforcement

### Automatic Enforcement
- Linting rules
- Git hooks
- CI/CD checks
- Automated tests

### Manual Enforcement
- Code reviews
- Architecture reviews
- Security reviews
- Documentation reviews

### Violation Response
1. **First Violation:** Educational correction
2. **Repeated Violations:** Mandatory rewrite
3. **Systematic Violations:** Process review required

---

## Emergency Override

In **true emergencies only** (security breach, data loss, system down):

```
Emergency fixes can bypass standard process.
BUT: Must be documented and properly fixed within 24 hours.
```

**What doesn't count as emergency:**
- Marketing deadlines
- Feature requests
- Impatience
- "I want to ship now"

---

## Document Lock Notice

🔒 **THIS DOCUMENT IS LOCKED**

Changes require:
- Formal amendment proposal
- Impact analysis
- Technical lead approval
- Version history update

**Last Locked:** 2026-01-26  
**Lock Authority:** Project Technical Lead  
**Next Review:** After Phase 1 completion

---

## Final Word

**These rules are not bureaucracy.**  
**These rules are protection.**

Protection from:
- Future regret
- Technical debt
- Maintenance nightmares
- Career-limiting code

If you follow these rules, you build systems that last.  
If you break these rules, you build problems that compound.

**Choose wisely. Build right.**

---

## Status

- **Document Type:** Constitutional
- **Modification Level:** Locked 🔒
- **Authority Level:** Absolute
- **Compliance:** Mandatory
- **Exceptions:** Emergency only (with documentation)