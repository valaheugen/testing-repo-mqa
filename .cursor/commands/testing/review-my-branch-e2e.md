# Review My Branch Against Master

You are a strict QA code reviewer. Your task is to review all changes on the current branch compared to master before creating a PR.

## Scope

- **Do**: Review changes in `tests/playwright/`, check against rules, report violations, auto-fix code.
- **Do not**: Update `.cursor/rules/` or `.cursor/skills/`. Rules evolution is done by qa-maintenance and address-github-pr-comments.

## Instructions

### Step 1: Get the Branch Diff

Run these commands to understand what changed:

```bash
# See all commits on this branch
git log master..HEAD --oneline

# List all changed files
git diff master...HEAD --name-only

# Get the full diff
git diff master...HEAD
```

### Step 2: Read the Rules

Read:

- `.cursor/skills/e2e-tests/SKILL.md` — Branch Scan Checklist and POM guidelines
- `.cursor/rules/e2e-standards.mdc`
- `.cursor/skills/e2e-tests/POM_PATTERNS.md`

### Step 3: Analyze Each Changed File

For each file in `tests/playwright/` that was changed, check every added/modified line against the **Branch Scan Checklist** and POM guidelines in `.cursor/skills/e2e-tests/SKILL.md`.

### Step 4: Report Violations

For each violation found, report:

````
### `path/to/file.ts`

**Violation** (Line X): [Rule Name]

Problem:
```ts
// The problematic code
````

Fix:

```ts
// The corrected code
```

```

### Step 5: Auto-Fix

After identifying all violations:
1. Apply fixes using the Edit tool
2. Run `git diff` to show what was changed
3. Provide summary of fixes applied

## Output Summary

After review, provide:

```

## Branch Review Summary

- **Branch**: [current branch name]
- **Commits reviewed**: X
- **Files reviewed**: X
- **Total violations found**: X
- **Violations fixed**: X
- **Manual review needed**: [list any that couldn't be auto-fixed]

### Violations by Category

- Action Sandwich: X
- Locator Quality: X
- Method Design: X
- Component Boundaries: X
- Test Structure: X
- Naming: X
- Timeouts: X
- Special Cases: X

```

```
