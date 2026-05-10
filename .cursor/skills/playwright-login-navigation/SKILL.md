---
name: playwright-login-navigation
description: Handles login setup and initial navigation for Planable Playwright tests. Use when writing or reviewing E2E or visual tests that rely on generated DB fixtures, need "login false", log in as a different seeded user, test shared views, or should deep-link with `onPlanableUrl` instead of navigating through the UI.
---

# Playwright Login & Initial Navigation

## When to Use

Use this skill when:

- Writing or reviewing Playwright tests that seed DB data
- Deciding whether the generated main user should be logged in
- Testing alternate-user, guest, or shared-view scenarios
- Choosing the first navigation step in a test
- Replacing UI-driven setup with direct URL navigation

## Login Defaults

- Data-generating fixtures usually log in the main generated user for you. Treat that as the default path.
- If the test should run as the main seeded user, rely on the fixture login behavior. Do not add manual login code on top.
- With `generateData`, the default is `login: true`, so leaving it unspecified is the normal case.

```typescript
test('owner opens the feed', async ({ generateData, onPlanableUrl }) => {
  const { workspaceId } = generateData.ids;
  const pageId = generateData.pageIds[0]!;

  await onPlanableUrl.navigateToFeedView({ workspaceId, pageId });
});
```

## When to Opt Out

Use `test.use({ login: false })` when the main seeded user should not become the browser user.

Common cases:

- Two-user scenarios where the fixture seeds one user, but the browser should log in as another
- Shared or public view scenarios where no authenticated account is needed
- Permission scenarios where the browser must use a custom user with different access

```typescript
test.describe('approver flow', () => {
  test.use({ login: false });

  test('logs in as the custom approver', async ({ generateData, page }) => {
    const approverUserId = Random.id();

    await generateUser(...); // seed the second user
    await loginWithToken(page, approverUserId);
  });
});
```

Rules:

- Do not keep default login enabled and then log in again as another user.
- Do not manually log in when the main generated user is already the correct user.
- If the scenario is anonymous or shared access, prefer staying logged out.
- If the scenario does not need a full authenticated account, prefer the lightest fixture that can seed the required data.

## Initial Navigation

Start as deep in the user flow as possible.

Preferred pattern:

- Navigate directly to the screen under test with `onPlanableUrl`
- Then use the relevant POM component to act or assert

```typescript
await onPlanableUrl.navigateToFeedView({ workspaceId, pageId });
await onFeedView.doSomething();
```

Examples of good direct navigation:

- `await onPlanableUrl.navigateToFeedView({ workspaceId, pageId });`
- `await onPlanableUrl.navigateToCalendar({ workspaceId });`
- `await onPlanableUrl.navigateToCompanyBilling(companyId);`

Use `navigateToDashboard()` only when the dashboard itself is part of the scenario. Do not use it as a trampoline to reach another page.

## Navigation Anti-Patterns

Avoid navigating to a generic page and then clicking through the UI just to reach the real starting point.

Bad:

```typescript
await onPlanableUrl.navigateToDashboard();
await onDashboard.navigateToWorkspace(workspaceId);
```

Good:

```typescript
await onPlanableUrl.navigateToFeedView({ workspaceId, pageId });
```

Bad:

```typescript
await onPlanableUrl.navigateToFeedView({ workspaceId, pageId });
await onNavbar.switchView('calendar');
```

Good:

```typescript
await onPlanableUrl.navigateToCalendar({ workspaceId });
```

The same rule applies when the target is not a content view. Do not land in calendar or feed and then click into another major area like engagement or campaigns. Navigate straight to that area's URL helper instead.

Example:

```typescript
await onPlanableUrl.navigateToEngagement({ workspaceId });
```

## Client-Side Setup Before Navigation

If the test must do client-side setup before visiting the real target URL, first open a safe app page with `page.goto('/')`.

Use this when:

- Writing to `localStorage`
- Running `page.evaluate(...)`
- Doing other client-side setup before the real navigation

Good:

```typescript
await page.goto('/');
await page.evaluate(userId => {
  localStorage.setItem(`generate-post-banner-${userId}`, 'true');
}, userId);
await onPlanableUrl.navigateToCalendar({ workspaceId });
```

Bad:

```typescript
await page.evaluate(userId => {
  localStorage.setItem(`generate-post-banner-${userId}`, 'true');
}, userId);
await onPlanableUrl.navigateToCalendar({ workspaceId });
```

Why this matters:

- Playwright starts on `about:blank`
- `page.evaluate(...)` and similar client-side operations against that initial page are unreliable for our app setup
- A temporary `page.goto('/')` gives the browser a real app origin before the actual deep link

## Quick Review Checklist

- Does the fixture already log in the main generated user?
- Is `login: false` needed because the test should use a different user or stay logged out?
- Is the first navigation the deepest direct URL we can use?
- Are we avoiding dashboard or navbar clicks just to reach the real test starting point?
- If the test touches `localStorage` or uses `page.evaluate(...)` before the real navigation, does it first call `page.goto('/')`?
