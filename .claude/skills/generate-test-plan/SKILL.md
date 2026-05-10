---
name: generate-test-plan
description: Generate exhaustive test plans for Planable features. Analyzes TRPC queries/mutations, jobs, UI components, and user flows to categorize what needs unit tests, E2E visual tests, E2E functional tests, and what cannot be tested. Use when asked to generate a test plan, analyze testing requirements, or create testing tasks for a feature.
---

# Generate Test Plan for Feature

This skill analyzes a feature's codebase and generates an **exhaustive** test plan categorizing all testable code by test type.

## When to Use

- "Generate test plan for [feature]"
- "What tests do we need for [feature]?"
- "Analyze [feature] for testing requirements"
- "Create testing tasks for [feature]"

## Analysis Process

### Step 1: Identify Feature Boundaries

Locate all code related to the feature across these directories:

```
Backend:
├── imports/trpc/server/routes/           # TRPC routers
├── imports/api/[feature]/server/         # Server-side logic
│   ├── workers/                          # Background jobs
│   ├── webhooks/                         # Webhook handlers
│   └── methods/                          # Meteor methods
├── imports/api/[feature]/                # Shared logic

Frontend:
├── imports/ui/client/features/[feature]/ # Feature UI
│   ├── components/                       # React components
│   ├── hooks/                            # Custom hooks
│   └── stores/                           # State management
├── imports/trpc/client/                  # Client TRPC hooks
```

### Step 2: Categorize Each File

For each file found, determine:

| Code Pattern                       | Test Type               | Reason                               |
| ---------------------------------- | ----------------------- | ------------------------------------ |
| TRPC query (DB only)               | Unit                    | Tests data transformation, filtering |
| TRPC mutation (DB only)            | Unit                    | Tests business rules, validation     |
| TRPC mutation (calls external API) | Unit + Mock             | External boundary                    |
| Worker/Job (calls external API)    | Unit + Mock             | External boundary                    |
| Webhook handler                    | Unit + Mock             | External trigger                     |
| Meteor method (DB only)            | Unit                    | Business logic                       |
| Meteor method (external API)       | Unit + Mock             | External boundary                    |
| React component (display)          | E2E Visual              | Visual regression                    |
| React component (interaction)      | E2E Visual + Functional | Behavior testing                     |
| Client hook (state management)     | E2E Functional          | Test via UI                          |
| Navigation/routing logic           | E2E Functional          | User flows                           |

### Step 3: Identify User Flows

User flows are end-to-end scenarios tested functionally:

- Status transitions (state A → state B → state C)
- CRUD operations visible in UI
- Navigation patterns (tabs, modals, URLs)
- Selection/focus behavior
- Edge cases (empty states, last item, persistence)

### Step 4: Identify Untestable Items

Flag code that **cannot** be E2E tested due to tooling limitations:

- External API calls (Meta, Google, TikTok, LinkedIn, Pinterest, YouTube)
- Webhook reception (external trigger)
- Real-time sync from external sources
- Email/notification delivery
- Payment processing
- OAuth flows with real providers
- Analytics tracking (Mixpanel, Horizon, InnerTrends, Segment, etc.)

---

## Output Format

Generate the test plan in this exact Markdown structure:

```markdown
# Test Plan: [Feature Name]

> Generated: [Date]
> Feature Path: [Primary directory path]

## Summary

| Category                 | Count |
| ------------------------ | ----- |
| Unit Tests               | X     |
| Unit Tests (Mocked)      | X     |
| E2E Visual Tests         | X     |
| E2E Functional Tests     | X     |
| Untestable (Tooling Gap) | X     |

---

## 1. Backend: Unit Tests

### 1.1 TRPC Queries

| Query       | File              | Test Focus   |
| ----------- | ----------------- | ------------ |
| `queryName` | `path/to/file.ts` | What to test |

### 1.2 TRPC Mutations

| Mutation       | File              | Test Focus   |
| -------------- | ----------------- | ------------ |
| `mutationName` | `path/to/file.ts` | What to test |

### 1.3 Other Business Logic

| Function/Method | File              | Test Focus   |
| --------------- | ----------------- | ------------ |
| `functionName`  | `path/to/file.ts` | What to test |

---

## 2. Backend: Unit Tests (Mocked External APIs)

### 2.1 Workers/Jobs

| Worker       | File              | External API    | Test Focus              |
| ------------ | ----------------- | --------------- | ----------------------- |
| `workerName` | `path/to/file.ts` | Meta/Google/etc | What to test with mocks |

### 2.2 Webhook Handlers

| Handler       | File              | External Source | Test Focus              |
| ------------- | ----------------- | --------------- | ----------------------- |
| `handlerName` | `path/to/file.ts` | Meta/etc        | What to test with mocks |

### 2.3 External API Mutations

| Mutation       | File              | External API | Test Focus              |
| -------------- | ----------------- | ------------ | ----------------------- |
| `mutationName` | `path/to/file.ts` | Platform     | What to test with mocks |

---

## 3. Frontend: E2E Visual Tests

### 3.1 Component States

| Component       | File               | Visual States to Capture         |
| --------------- | ------------------ | -------------------------------- |
| `ComponentName` | `path/to/file.tsx` | empty, loading, populated, error |

### 3.2 Content Variations

| Component       | File               | Variations              |
| --------------- | ------------------ | ----------------------- |
| `ComponentName` | `path/to/file.tsx` | text, image, video, etc |

### 3.3 Responsive/Layout

| Component       | File               | Viewports               |
| --------------- | ------------------ | ----------------------- |
| `ComponentName` | `path/to/file.tsx` | desktop, mobile, tablet |

---

## 4. Frontend: E2E Functional Tests

### 4.1 User Interactions

| Interaction  | Components Involved        | Test Scenarios        |
| ------------ | -------------------------- | --------------------- |
| Click action | `Component1`, `Component2` | Scenario descriptions |

### 4.2 State Transitions

| Transition    | From → To | Trigger Locations | Edge Cases              |
| ------------- | --------- | ----------------- | ----------------------- |
| Status change | A → B     | sidebar, header   | last item, empty result |

### 4.3 Navigation Flows

| Flow          | URL Pattern      | Test Scenarios            |
| ------------- | ---------------- | ------------------------- |
| Tab switching | `/feature?tab=X` | persistence, deep linking |

### 4.4 Data Operations (UI-triggered, DB-only)

| Operation            | Components      | Test Scenarios             |
| -------------------- | --------------- | -------------------------- |
| Create/Update/Delete | `ComponentName` | success, validation errors |

---

## 5. Untestable: Tooling Gaps

### 5.1 External API Calls

| Operation            | Reason       | Alternative Testing          |
| -------------------- | ------------ | ---------------------------- |
| Send message to Meta | External API | Unit test mutation with mock |

### 5.2 External Triggers

| Trigger           | Reason          | Alternative Testing                 |
| ----------------- | --------------- | ----------------------------------- |
| Webhook from Meta | External source | Unit test handler with mock payload |

### 5.3 Real-time External Sync

| Sync               | Reason       | Alternative Testing            |
| ------------------ | ------------ | ------------------------------ |
| Fetch new messages | External API | Unit test sync logic with mock |

### 5.4 Analytics Tracking (Never Tested)

| Analytics Call | Service              | Why Not Tested                      |
| -------------- | -------------------- | ----------------------------------- |
| Track event X  | Mixpanel/Horizon/etc | Side effect, not core functionality |

> **Note:** We do not test analytics tracking. In unit tests, do not stub or assert logging (`logger`, `serverLogger`) or analytics tracking (`analytics.track`/`identify`/`group`); domain analytics services like `HorizonUsageAnalytics` are fine to stub. See [unit-tests skill](../unit-tests/SKILL.md). In E2E, analytics fire but we don't verify them.

---

## 6. Test Data Generators Needed

| Generator   | Purpose          | Example Usage                       |
| ----------- | ---------------- | ----------------------------------- |
| `generateX` | Create test data | `await generateX({ field: value })` |

---

## 7. Page Object Components Needed

| Component            | Purpose         | Exists? |
| -------------------- | --------------- | ------- |
| `onFeatureComponent` | Interact with X | Yes/No  |
```

---

## Classification Rules

### Rule 1: External API Boundary

Any code that calls these is **Unit + Mock**, never E2E:

- Meta Graph API (FB, IG)
- Google APIs (GMB, YouTube)
- TikTok API
- LinkedIn API
- Pinterest API
- Twitter/X API
- Slack API
- Any third-party service

### Rule 2: Analytics Services (Never Tested)

We do **NOT** test analytics tracking in any test type. Analytics calls should be:

- **Ignored** in unit tests (don't assert on them)
- **Ignored** in E2E tests (they fire but we don't verify)

Analytics services we use but don't test:

- **Mixpanel** - Product analytics
- **Horizon** - Internal analytics
- **InnerTrends** - Behavioral analytics
- **Segment** - Analytics routing
- **Google Analytics** - Web analytics
- **Intercom** - User messaging/tracking
- **Sentry** - Error tracking (test the error, not the tracking)

**Why we don't test analytics:**

- Analytics are side effects, not core functionality
- They change frequently (events added/removed)
- They're third-party services (external boundary)
- Testing them creates brittle tests
- The analytics service itself validates data receipt

### Rule 3: UI Display vs Interaction

| If Component...                | Then Test Type                  |
| ------------------------------ | ------------------------------- |
| Only renders data              | E2E Visual                      |
| Has click/hover/focus handlers | E2E Visual + Functional         |
| Triggers navigation            | E2E Functional                  |
| Triggers external API          | Visual only (action untestable) |

### Rule 4: TRPC Classification

```
TRPC Query
├── Reads from DB only → Unit Test
└── Calls external API → Unit + Mock

TRPC Mutation
├── Writes to DB only → Unit Test
├── Calls external API → Unit + Mock
└── Triggers background job → Unit Test (job tested separately)
```

### Rule 5: What We CAN Test E2E

- UI rendering with pre-generated data
- Client-side state changes
- Navigation and URL behavior
- Form validation (client-side)
- Optimistic UI updates
- Empty/loading/error states
- Pagination (loading from our DB)

### Rule 6: What We CANNOT Test E2E

- Sending data TO external platforms
- Receiving data FROM external platforms
- Real-time sync with external sources
- Webhook processing (external trigger)
- Email delivery
- Push notifications
- OAuth with real providers
- Analytics tracking (Mixpanel, Horizon, InnerTrends, etc.)

---

## Example Analysis

### Input: "Generate test plan for Social Inbox DMs"

### Analysis Steps:

1. **Find TRPC routers**: `imports/trpc/server/routes/socialInbox/`
2. **Find workers**: `imports/api/engagement/socialInbox/server/workers/`
3. **Find webhooks**: `imports/api/engagement/socialInbox/server/webhooks/`
4. **Find UI**: `imports/ui/client/features/engagement/social-inbox/`
5. **Categorize each file**
6. **Identify user flows from UI components**
7. **Flag external API calls as untestable in E2E**

### Example Output Categories:

**Unit Tests:**

- `conversations.getForPages` - filtering, pagination
- `conversations.changeStatus` - status validation
- `messages.markAllAsRead` - unread count logic

**Unit + Mock:**

- `syncConversationsWorker` - Mock Meta API responses
- `MetaMessagesHandler` - Mock webhook payloads
- `messages.send` - Mock Meta send API

**E2E Visual:**

- Message bubbles (text, image, video, story reply)
- Conversation list (empty, populated, unread badges)
- Header states

**E2E Functional:**

- Status transitions (Open ↔ Later ↔ Done)
- Conversation selection/focus
- Tab navigation and URL persistence
- Load more messages (from our DB)

**Untestable:**

- Actually sending messages to Meta
- Receiving real webhooks
- Syncing from Meta API

---

## Checklist Before Outputting

- [ ] Every TRPC query listed
- [ ] Every TRPC mutation listed
- [ ] Every worker/job listed
- [ ] Every webhook handler listed
- [ ] Every UI component categorized
- [ ] All user flows identified
- [ ] All state transitions mapped
- [ ] All edge cases noted (empty, last item, refresh)
- [ ] All external API calls flagged as untestable
- [ ] Required test data generators identified
- [ ] Required Page Object components identified
