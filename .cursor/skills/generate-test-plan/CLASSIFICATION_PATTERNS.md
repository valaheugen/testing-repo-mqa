# Classification Patterns Reference

Detailed patterns for classifying Planable code into test categories.

## File Path → Test Type Mapping

### Backend Paths

| Path Pattern                              | Likely Test Type | Notes                             |
| ----------------------------------------- | ---------------- | --------------------------------- |
| `imports/trpc/server/routes/**/*.ts`      | Unit             | Check for external API calls      |
| `imports/api/**/server/workers/*.ts`      | Unit + Mock      | Almost always calls external APIs |
| `imports/api/**/server/webhooks/*.ts`     | Unit + Mock      | External trigger                  |
| `imports/api/**/server/methods/*.ts`      | Unit             | Check for external API calls      |
| `imports/api/**/server/publications/*.ts` | Unit             | Meteor publications               |
| `imports/api/**/server/sync*.ts`          | Unit + Mock      | Usually syncs with external       |
| `imports/api/**/server/fetch*.ts`         | Unit + Mock      | Usually fetches from external     |

### Frontend Paths

| Path Pattern                                     | Likely Test Type        | Notes                    |
| ------------------------------------------------ | ----------------------- | ------------------------ |
| `imports/ui/client/features/**/components/*.tsx` | E2E Visual + Functional | Analyze for interactions |
| `imports/ui/client/features/**/hooks/*.ts`       | E2E Functional          | Tested via UI            |
| `imports/ui/client/components/**/*.tsx`          | E2E Visual              | Shared/design system     |
| `imports/trpc/client/**/*.ts`                    | -                       | Not tested directly      |

---

## External API Detection

### Keywords indicating external API calls

Look for these imports/patterns to identify Unit + Mock:

```typescript
// Meta/Facebook/Instagram
import { graphApi } from '...'
import { MetaAPI } from '...'
facebookApi.
instagramApi.
'graph.facebook.com'

// Google
import { google } from 'googleapis'
googleApi.
'googleapis.com'

// TikTok
import { tiktokApi } from '...'
'open.tiktokapis.com'

// LinkedIn
import { linkedinApi } from '...'
'api.linkedin.com'

// Pinterest
import { pinterestApi } from '...'
'api.pinterest.com'

// Twitter/X
import { twitterApi } from '...'
'api.twitter.com'

// Generic external
axios.get/post/put/delete with external URL
fetch() with external URL
```

### Keywords indicating DB operations

```typescript
// MongoDB operations
Collection.findOneAsync
Collection.insertAsync
Collection.updateAsync
Collection.removeAsync
Collection.aggregate

// TRPC context DB access
ctx.db.
ctx.collections.
```

### Keywords indicating Analytics (Never Test)

Analytics code should be **stubbed** in unit tests (don't assert on calls) and **ignored** in E2E tests.

```typescript
// Mixpanel
mixpanel.track
mixpanel.identify
mixpanel.people.set
import { track } from '...mixpanel...'

// Horizon
horizon.track
horizonAnalytics.

// InnerTrends
innerTrends.track
innerTrends.identify

// Segment
analytics.track
analytics.identify
analytics.page

// Intercom
intercom.trackEvent
window.Intercom

// Generic patterns
trackEvent(
logEvent(
analytics.
```

**Why we don't test analytics:**
- Side effects, not core functionality
- Events change frequently
- Third-party services (external boundary)
- Creates brittle tests
- Analytics service validates data receipt

---

## UI Component Classification

### Visual-Only Components (E2E Visual)

Components that ONLY render data, no event handlers:

```tsx
// Visual-only indicators
export function MessageBubble({ message }: Props) {
  return <div className="...">{message.text}</div>
}

// No onClick, onHover, onChange, etc.
// Props are data, not callbacks
```

### Interactive Components (E2E Visual + Functional)

Components with user interaction handlers:

```tsx
// Interactive indicators
onClick={...}
onHover={...}
onChange={...}
onSubmit={...}
onKeyDown={...}
useMutation(...)  // triggers mutation
navigate(...)     // triggers navigation
```

### Components Triggering External APIs (Visual Only, Action Untestable)

```tsx
// These trigger external calls - action not E2E testable
const sendMessage = useMutation(messages.send)  // If .send calls Meta API, or any other external API
onClick={() => sendMessage(...)}

// Test visually as much as possible without actually making the external API call, but don't test the actual API call in E2E - because it's not testable in E2E.
```

---

## TRPC Router Classification

### Query Analysis

```typescript
// Unit Test - DB only
getForPages: procedure
  .input(...)
  .query(async ({ ctx, input }) => {
    return ctx.db.conversations.find(...)  // DB only
  })

// Unit + Mock - External API
getFromPlatform: procedure
  .input(...)
  .query(async ({ ctx, input }) => {
    return metaApi.getConversations(...)  // External API
  })
```

### Mutation Analysis

```typescript
// Unit Test - DB only
changeStatus: procedure
  .input(...)
  .mutation(async ({ ctx, input }) => {
    await ctx.db.conversations.update(...)  // DB only
  })

// Unit + Mock - External API
send: procedure
  .input(...)
  .mutation(async ({ ctx, input }) => {
    await metaApi.sendMessage(...)  // External API
    await ctx.db.messages.insert(...)
  })

// Unit Test - Triggers job (job tested separately)
syncConversations: procedure
  .mutation(async ({ ctx }) => {
    await createJob('syncConversations', ...)  // Job handles external
  })
```

---

## User Flow Identification

### Status/State Transition Flows

Look for:

- Status enums: `status: 'open' | 'saved' | 'done'`
- State machines
- UI buttons that change status
- Tabs/filters that show different statuses

Example questions:

- What statuses exist?
- What transitions are allowed?
- Where can user trigger each transition?
- What happens after transition? (focus next? empty state?)

### CRUD Flows

Look for:

- Create buttons/forms
- Edit/update actions
- Delete with confirmation
- Bulk operations

Example questions:

- Where does user create?
- Where does user edit?
- Where does user delete?
- Are there bulk operations?

### Navigation Flows

Look for:

- Tab components
- URL parameters (`?tab=`, `?filter=`)
- Deep linking patterns
- Breadcrumbs
- Back/forward handling

Example questions:

- What tabs/views exist?
- Does URL reflect state?
- Does state persist on refresh?
- Are there deep links?

### Selection/Focus Flows

Look for:

- Selection state management
- Focus indicators
- Keyboard navigation
- Multi-select

Example questions:

- Can user select items?
- What happens when selected item is removed?
- Is there multi-select?
- Does selection persist?

---

## Edge Cases to Always Include

### List Operations

- Empty list state
- Single item list (delete → empty)
- Last item behavior
- First item behavior

### Pagination

- Load more trigger
- End of list behavior
- Refresh while paginated

### Persistence

- State after page refresh
- State after navigation away and back
- URL reflects state

### Error States

- Network error display
- Validation error display
- Permission error display

### Loading States

- Initial load skeleton
- Load more spinner
- Action in progress indicator

---

## Test Data Generator Patterns

### When to identify needed generators

Look for data structures that need to be created:

- Main entity (conversation, post, comment)
- Related entities (messages, media, labels)
- User/permission scenarios

### Generator naming convention

```typescript
// Entity generators
generateConversation({ workspaceId, pageId, status })
generateMessage({ conversationId, contentType, direction })
generatePost({ workspaceId, pageIds, scheduledAt })

// Update helpers
updatePage(pageId, { field: value })
updateUserWorkspacePermissions(userId, workspaceId, { permissions })
```

---

## Page Object Component Patterns

### What to check

For each UI area, check if POM exists in:
`tests/playwright/support/components/`

### Naming convention

```typescript
// Feature-specific
onSocialInboxSidebar
onSocialInboxView
onConversationHeader

// Generic
onComposer
onPostModal
onNavbar
onFilters
```

### When to flag "needs creation"

- New feature with no existing POMs
- New UI section within existing feature
- Complex interactions not covered by existing POMs
