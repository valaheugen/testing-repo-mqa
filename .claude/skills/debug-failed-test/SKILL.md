---
name: debug-failed-test
description: Debug and triage Playwright test failures using Playwright 1.59 CLI trace analysis, code inspection, and optional interactive debugging. Use when a test fails in CI or locally, when given a trace file, CI job URL, test name, or asked to debug/triage a failing test.
---

# Debug Failed Test

Triage Playwright test failures using CLI trace analysis (Playwright 1.59+). The core principle: **analyze the trace BEFORE reading code or suggesting fixes**.

## When to Use

- "Debug this failing test"
- "Why is this test flaky?"
- "Triage this CI failure"
- A Playwright test fails in CI or locally
- QA team needs structured triage for a test failure
- Given a trace file, CI job URL, test file path, test name, or Linear issue ID

## Input Detection

| Input            | Detection                                                         | Route to  |
| ---------------- | ----------------------------------------------------------------- | --------- |
| Trace file       | Path ends in `.zip` or inside `test-results/`                     | Phase 2   |
| Test file path   | Contains `tests/playwright` and ends in `_spec.ts` or `_views.ts` | Phase 1.3 |
| Test name / grep | Quoted string without path separators                             | Phase 1.3 |
| CI job URL       | URL contains `circleci.com`                                       | Phase 1.2 |
| Linear issue ID  | Matches `P-\d+`                                                   | Phase 1.4 |

Optional context the user may provide:

- `--linear P-12345` — post triage report to Linear when done
- `--interactive` — enable Phase 4 interactive CLI debugging

---

## Phase 1: Locate or Reproduce Trace

### 1.1 Config Auto-Detection

Detect the correct Playwright config from the test path (see also [e2e-tests](../e2e-tests/SKILL.md) Running Tests section):

| Test path pattern                          | Config file                   | Key differences                                                     |
| ------------------------------------------ | ----------------------------- | ------------------------------------------------------------------- |
| `tests/playwright/integration/features/**` | `playwright.config.ts`        | 7 workers CI, fullyParallel                                         |
| `tests/playwright/integration/visual/**`   | `playwright-visual.config.ts` | 7 workers CI, NOT fullyParallel, 1920x1080 viewport, Argos reporter |
| `tests/playwright/integration/smoke/**`    | `playwright-smoke.config.ts`  | 2 workers CI, Chrome + Firefox projects                             |

This matters — wrong config changes timeouts, viewport, reporters, and browser projects.

**Timeout reference** (from `playwright-base.config.ts`):

| Timeout             | CI / `CURSOR_AGENT` | Local |
| ------------------- | ------------------- | ----- |
| `actionTimeout`     | 10s                 | 3s    |
| `expect timeout`    | 10s                 | 5s    |
| `toPass timeout`    | 10s                 | 5s    |
| `navigationTimeout` | 30s                 | 5s    |
| `test timeout`      | 60s                 | 60s   |

### 1.2 From CI Job URL

1. Extract job number from the CircleCI URL
2. Download artifacts:
   ```bash
   curl -s -H "Circle-Token: $CIRCLECI_TOKEN" \
     "https://circleci.com/api/v2/project/github/Planable/planable-app/<JOB_NUM>/artifacts"
   ```
3. Look for trace `.zip` files in `tests/test-results/` artifacts
4. Download the trace file

**Important**: CI uses `trace: 'on-first-retry'` (`playwright-base.config.ts:31`). Traces only exist for tests that were retried (retries: 1 in CI). If no trace is found, inform the user and offer local reproduction (Phase 1.3).

If `CIRCLECI_TOKEN` is not set, ask the user to provide it or switch to local reproduction.

### 1.3 Local Reproduction

**Prerequisite**: The test server must be running on `localhost:4000` (`npm run start-test`). Verify before running tests.

Run the failing test locally with trace explicitly enabled:

```bash
meteor npx playwright test <file-or-grep> \
  --config <detected-config> \
  --trace on \
  --retries 0 \
  --reporter list
```

Locate the trace in the output directory (`tests/test-results/` per `playwright-base.config.ts:10`):

```bash
find tests/test-results -name "trace.zip" -newer /tmp/debug-marker 2>/dev/null
```

Create the marker before running: `touch /tmp/debug-marker`

If the test passes locally, inform the user — this is a signal for environment-dependent or flaky behavior. Suggest re-running 3-5 times to catch intermittent failures:

```bash
meteor npx playwright test <file> --config <config> --trace on --repeat-each 5
```

If the test passes consistently locally (even with `--repeat-each 5`), investigate CI-specific factors:

- **Parallelism** — CI runs 7 workers vs 1 locally; shared state or DB data leaking between parallel workers
- **Viewport** — visual tests use 1920x1080 in CI; verify the correct config is used
- **Timeouts** — CI uses longer timeouts (10s action vs 3s local); a test relying on fast failure may behave differently
- **Resources** — CI containers may hit OOM or CPU throttling; check `.circleci/CI.yml` for resource class

### 1.4 From Linear Issue ID

1. Fetch the issue:
   ```
   Linear MCP: get_issue
   - id: "<issue-id>"
   - includeRelations: true
   ```
2. Check existing comments (same pattern as [investigate-linear-triage](../investigate-linear-triage/SKILL.md)):
   ```
   Linear MCP: list_comments
   - issueId: "<issue-id>"
   ```
   If there is a comment with footer "generated by Cursor debug-failed-test skill", ask the user if they want to use it or generate a new investigation.
3. Scan description, comments, and attachments for:
   - CircleCI URLs → route to Phase 1.2
   - Test file paths → route to Phase 1.3
   - Trace file attachments → route to Phase 2
4. If none found, ask the user for a test file path or CI URL

---

## Phase 2: Trace Analysis (Playwright 1.59 CLI)

This is the core phase. Use `npx playwright trace` commands to analyze the failure programmatically. See [playwright-trace](../playwright-trace/SKILL.md) for the full command reference.

### 2.1 Open the trace

```bash
npx playwright trace open <path-to-trace.zip>
```

### 2.2 Find the failing action(s)

```bash
# List all actions as a tree with IDs and timing
npx playwright trace actions

# Jump directly to failures
npx playwright trace actions --errors-only

# Show all errors with stack traces
npx playwright trace errors
```

Note the failing action ID `<N>`.

### 2.3 Get details on the failing action

```bash
npx playwright trace action <N>
```

Extract:

- **Error message** and stack trace
- **Duration** — compare against configured timeouts (see 1.1 table)
- **Selector** used — should be `data-testId` based (project convention: `testIdAttribute: 'data-testId'`)
- **Action type** (click, fill, expect, navigation)
- **Available snapshot phases** (before, input, after) — shown in the output

### 2.4 Inspect page state at failure

```bash
# Accessibility snapshot (default — shows element tree with roles)
npx playwright trace snapshot <N>
npx playwright trace snapshot <N> --name before

# Query the DOM for specific elements using data-testId (project convention)
npx playwright trace snapshot <N> -- eval "document.querySelector('[data-testId=\"target\"]')?.textContent"
npx playwright trace snapshot <N> -- eval "document.querySelector('.error-message')?.textContent"

# Check if target element exists in DOM
npx playwright trace snapshot <N> -- eval "!!document.querySelector('[data-testId=\"<selector>\"]')"

# Save a screenshot of the page state
npx playwright trace snapshot <N> -- screenshot --filename=failure-snapshot.png
```

Analyze for:

- Is the target element present in the DOM?
- Is it visible vs hidden (`display:none`, `visibility:hidden`, off-viewport)?
- Are there overlapping elements blocking interaction?
- Is there an error banner, unexpected dialog, or loading spinner?
- Does the page content match what the test expects?

### 2.5 Check network and console

```bash
# Any failed network requests? (status >= 400)
npx playwright trace requests --failed

# Any API calls that might explain the failure?
npx playwright trace requests --grep "trpc"

# Console errors from the browser
npx playwright trace console --errors-only
```

**Known benign errors** — ignore these when triaging:

- **Frigade SDK 403s** (`sessions`, `flowStates` endpoints) — expected on localhost:4000 test server; the API key is missing/invalid in test environments.

### 2.6 Analyze preceding actions for context

The root cause is often in a preceding action. Examine 3-5 actions before the failure:

```bash
npx playwright trace action <N-3>
npx playwright trace action <N-2>
npx playwright trace action <N-1>
```

Build a timeline of what happened leading up to the failure.

### 2.7 Close the trace session

```bash
npx playwright trace close
# Clean up analysis artifacts (screenshots, logs, extracted attachments)
rm -rf .playwright-cli/console-*.log .playwright-cli/failure-*.png .playwright-cli/error-context
```

### Phase 2 Output Template

```markdown
## Trace Analysis

**Trace file**: <path>
**Total actions**: <count>
**Failing action**: #<N> — <action-type> (<selector-or-url>)
**Error**: <error-message>
**Duration**: <ms> (timeout: <configured-timeout>ms)

### Action Timeline (last 5 before failure)

| #   | Action  | Target                            | Duration | Status |
| --- | ------- | --------------------------------- | -------- | ------ |
| N-4 | click   | [data-testId="saveBtn"]               | 120ms    | pass   |
| N-3 | waitFor | [data-testId="spinner"] hidden        | 2100ms   | pass   |
| N-2 | expect  | toBeVisible([data-testId="postCard"]) | 350ms    | pass   |
| N-1 | click   | [data-testId="publishBtn"]            | 80ms     | pass   |
| N   | expect  | toContainText("Published")        | 10000ms  | FAIL   |

### Page State at Failure

- **Target element**: present/absent, visible/hidden
- **Overlapping elements**: none / list
- **Error indicators on page**: none / description
- **Page URL**: <url>
- **Failed network requests**: none / list
- **Console errors**: none / list
```

---

## Phase 3: Code Analysis

### 3.1 Read the failing test

Read the test file. Cross-reference the failing action number from the trace with `test.step` blocks in the code (project convention: every test uses `test.step` for grouping).

Identify:

- Which POM fixtures are used (e.g., `onComposer`, `onMediaLibrary`, `onFeedView`) — these are in `tests/playwright/support/components/`
- What `data-testId` selectors are targeted — project uses `getByTestId()` exclusively
- What app route is navigated to — check for `onPlanableUrl` fixture usage
- What data is seeded — check `generateData` fixture and generators in `tests/playwright/support/db/generators/`

### 3.2 Check POM method implementation

If the failing action comes from a POM method, read the POM component file in `tests/playwright/support/components/`. Check:

- Does the method have a proper action sandwich (assert before → action → assert after)?
- Does it use correct locators (`getByTestId` not `locator`)?
- Is the method outdated vs the current app DOM?

### 3.3 Search app code for the failing selector

```bash
# Find where the data-testId attribute is defined in app code
rg 'data-testId="<selector>"' imports/
```

### 3.4 Check recent changes

```bash
git log --oneline -10 -- <affected-app-file>
git log --oneline -10 -- <affected-test-file>
git log --oneline -10 -- <affected-pom-component>
```

### 3.5 Classify the failure

| Classification        | Indicators                                                                                                          | Common patterns                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **Flaky**             | Intermittent; race condition; timing-dependent; passes on re-run                                                    | See "Detecting Flaky Patterns in Traces" below     |
| **App bug**           | Consistent failure; component not rendering expected content; error in app logic; API error visible in page         | TRPC error in console, wrong data rendered         |
| **Test issue**        | Wrong/stale selector; outdated data assumption; test ordering dependency; missing data seeding; POM method outdated | `data-testId` removed/renamed, generator shape changed |
| **Environment issue** | Network timeout; port unavailable; DB connection failure; CI resource exhaustion                                    | `ECONNREFUSED`, MongoDB errors, OOM                |
| **Visual regression** | Visual test only; Argos screenshot mismatch; CSS/layout change                                                      | Argos diff URL in CI output                        |

---

## Detecting Flaky Patterns in Traces

See the [e2e-tests](../e2e-tests/SKILL.md) skill (Action Sandwich, locator rules, anti-patterns sections) for the full catalog of flaky patterns and fixes. When analyzing a trace, look for these signals:

| Trace signal                                   | Likely pattern                                         | Where to look in e2e-tests skill      |
| ---------------------------------------------- | ------------------------------------------------------ | ------------------------------------- |
| Action succeeds but next assertion fails       | Missing action sandwich                                | Action Sandwich Pattern               |
| Element visible but stale UI still rendered    | Missing negative assertion                             | Negative Assertions                   |
| Duration equals exactly the configured timeout | Element never appeared; wrong selector or missing data | Locator Rules, data-testId naming         |
| Fixed `waitForTimeout()` in source             | Hardcoded delay instead of auto-waiting                | Anti-Patterns: Never Do               |
| Wrong element matched; list order shifted      | `.nth(index)` locator                                  | Avoid .nth(index)                     |
| `isVisible()` in boolean conditional           | Imperative check without retry                         | No Imperative isVisible()             |
| Action fires but test doesn't wait             | Missing `await`                                        | Anti-Patterns: Always Do              |
| Screenshot differs from expected               | Hover state leak or animation                          | `resetHoverState`, `stabilizeLocator` |

---

## Phase 4: Interactive Debug (Optional)

Only when `--interactive` is requested or Phase 2-3 analysis is inconclusive.

### 4.1 Agentic CLI debugger (Playwright 1.59+) — preferred for agents

`--debug=cli` runs the test paused and attached over `playwright-cli`, so a coding agent (including this skill) can drive the debug session programmatically — ideal for automated repair loops.

```bash
meteor npx playwright test <file> --config <config> --debug=cli
```

Use it to:

- Step through the test after the hypothesis is built in Phases 2-3
- Inspect live page state at the failure point to confirm/refute the hypothesis
- Iterate on a fix in a paused session without re-running the full suite

Follow the output for the `playwright-cli` attach instructions it prints — specific subcommands/flags beyond `--debug=cli` are not documented in the 1.59 release notes, so rely on the runtime output rather than guessing. See [playwright-trace](../playwright-trace/SKILL.md) for related agent-facing CLI commands.

### 4.2 Variants — when NOT to use `--debug=cli`

| Flag          | Driver                    | Use when                                                                      |
| ------------- | ------------------------- | ----------------------------------------------------------------------------- |
| `--debug=cli` | External CLI / AI agent   | Agent-driven repair; this skill; scripted stepping                            |
| `--debug`     | Playwright Inspector (UI) | Human developer stepping through locally with the Inspector window            |
| `--ui`        | Playwright UI Mode        | Human exploring the full test tree, time-travel, watch mode, picking locators |

---

## Phase 5: Triage Report

### Report Template

```markdown
## Test Failure Triage Report

**Test**: <full test title>
**File**: <test-file-path>
**Config**: <playwright-config>
**Date**: <date>
**Investigated by**: Cursor debug-failed-test skill

---

### Classification

**Root cause**: <Flaky | App Bug | Test Issue | Environment Issue | Visual Regression>
**Confidence**: <High | Medium | Low>

### Failure Summary

<1-2 sentence summary of what failed and why>

### Trace Analysis

<Action timeline table from Phase 2>

### Page State at Failure

<DOM analysis from Phase 2 snapshots>

### Code Analysis

**Test code**: `<path>`, line <N>
**POM component**: `tests/playwright/support/components/<Component>.ts`
**App code**: `<path>` — selector `data-testId="<value>"`
**Recent changes**: <git log summary if relevant>

### Root Cause

<Detailed explanation with evidence>

### Suggested Fix

**If Flaky:**

- [ ] Add action sandwich (assert before → action → assert after)
- [ ] Add negative assertions for elements that should disappear
- [ ] Replace `waitForTimeout()` with auto-waiting assertions
- [ ] Replace `.nth()` with `data-testId` ID-based or `filter({ hasText })` locators
- [ ] Replace `isVisible()` conditionals with `expect().toBeVisible()`
- [ ] Check for missing `await` on Playwright calls
- [ ] Add `resetHoverState(page)` before screenshots if hover state leaks
- [ ] Add `stabilizeLocator()` for animated elements

**If App Bug:**

- [ ] Fix in `<file>`: <description>
- [ ] Verify: `meteor npx playwright test <file> --config <config>`

**If Test Issue:**

- [ ] Update selector from `<old>` to `<new>` (use `getByTestId` per convention)
- [ ] Fix data seeding in generator (`tests/playwright/support/db/generators/`)
- [ ] Update POM method in `tests/playwright/support/components/`
- [ ] Add missing `data-testId` attribute to app component

**If Environment Issue:**

- [ ] Check CI resource allocation in `.circleci/CI.yml`
- [ ] Verify local server running on port 4000 (`baseURL` in config)
- [ ] Check MongoDB connection
```

### Post to Linear (if requested)

```
Linear MCP: save_comment
- issueId: "<issue-id>"
- body: "<full triage report>"
```

Footer line: `generated by Cursor debug-failed-test skill`

---

## Anti-Patterns

1. **Never skip trace analysis** — the trace is runtime truth. Don't jump to code first.
2. **Don't assume flaky without evidence** — requires concrete timing/race-condition indicators or proof of intermittent behavior across multiple runs.
3. **Don't fix without full analysis** — complete all phases before suggesting a fix.
4. **Check preceding actions** — the failing action is often a symptom; root cause is 1-3 actions earlier.
5. **Check test setup/seeding** — many failures come from insufficient data seeding, not test logic. Check generators in `tests/playwright/support/db/generators/`.
6. **Use the right config** — wrong config means wrong timeouts, viewport, and reporters.
7. **Check POM method implementation** — the bug may be in the POM component (`tests/playwright/support/components/`), not the test or the app.
8. **Blindly trusting CI output alone** — always reproduce locally when possible. CI has different timeouts, worker counts, and resource constraints.

---

## Test Infrastructure Quick Reference

| Resource               | Location                                                        |
| ---------------------- | --------------------------------------------------------------- |
| POM components         | `tests/playwright/support/components/`                          |
| Data generators        | `tests/playwright/support/db/generators/`                       |
| Base fixtures          | `tests/playwright/support/utils/fixtures/base_fixtures.ts`      |
| Static text strings    | `tests/playwright/support/texts.ts`                             |
| Test utilities         | `tests/playwright/support/utils/`                               |
| CI config              | `.circleci/CI.yml`                                              |
| Playwright base config | `playwright-base.config.ts`                                     |
| Global setup           | `tests/playwright/global.setup.ts`                              |
| Global teardown        | `tests/playwright/global.teardown.ts`                           |
| CI test results        | `tests/playwright/results` (JUnit), `playwright-report/` (HTML) |

---

## Related Skills

| Skill                                                                  | When to use                                                                                                |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [playwright-trace](../playwright-trace/SKILL.md)                       | Full CLI command reference for `npx playwright trace` (installed via `npx playwright trace install-skill`) |
| [e2e-tests](../e2e-tests/SKILL.md)                                     | Test conventions: sandwich assertions, `test.step`, POM patterns, `data-testId`, locator rules, anti-patterns  |
| [investigate-linear-triage](../investigate-linear-triage/SKILL.md)     | If failure investigation reveals an app bug that needs production triage                                   |
| [browser-testing-loop](../browser-testing-loop/SKILL.md)               | After applying a fix, verify visually with browser testing loop                                            |
| [playwright-login-navigation](../playwright-login-navigation/SKILL.md) | If failure involves auth setup or login fixtures                                                           |
| [generate-test-plan](../generate-test-plan/SKILL.md)                   | If the investigation reveals missing test coverage                                                         |
| [qa-maintenance](../qa-maintenance/SKILL.md)                           | If the failure reveals a pattern worth adding to e2e-tests rules                                           |
