# Example: Test Plan for Social Inbox DMs

This is an example of a complete test plan output.

---

# Test Plan: Social Inbox / Direct Messages

> Generated: 2026-01-23
> Feature Path: `imports/ui/client/features/engagement/social-inbox/`

## Summary

| Category | Count |
|----------|-------|
| Unit Tests | 8 |
| Unit Tests (Mocked) | 6 |
| E2E Visual Tests | 12 |
| E2E Functional Tests | 15 |
| Untestable (Tooling Gap) | 4 |

---

## 1. Backend: Unit Tests

### 1.1 TRPC Queries

| Query | File | Test Focus |
|-------|------|------------|
| `conversations.getForPages` | `imports/trpc/server/routes/socialInbox/conversations.ts` | Filtering by status (open/saved/done), pagination cursor, page permissions |
| `conversations.getById` | `imports/trpc/server/routes/socialInbox/conversations.ts` | Single conversation fetch, authorization |
| `conversations.getUnreadCount` | `imports/trpc/server/routes/socialInbox/conversations.ts` | Count calculation, page filtering |
| `conversations.getUnreadCountForPages` | `imports/trpc/server/routes/socialInbox/conversations.ts` | Multi-page count aggregation |
| `messages.getForConversation` | `imports/trpc/server/routes/socialInbox/messages.ts` | Message ordering, pagination, cursor handling |
| `messages.getById` | `imports/trpc/server/routes/socialInbox/messages.ts` | Single message fetch |
| `messages.getByPublicMessageId` | `imports/trpc/server/routes/socialInbox/messages.ts` | Platform ID lookup |

### 1.2 TRPC Mutations

| Mutation | File | Test Focus |
|----------|------|------------|
| `conversations.changeStatus` | `imports/trpc/server/routes/socialInbox/conversations.ts` | Status validation, transition rules, unread badge update |
| `messages.markAllAsRead` | `imports/trpc/server/routes/socialInbox/messages.ts` | Updates unread count, only marks user's messages |

### 1.3 Other Business Logic

| Function/Method | File | Test Focus |
|-----------------|------|------------|
| `handleSocialMessageActivity` | `imports/api/engagement/socialInbox/server/activity/` | Activity record creation |

---

## 2. Backend: Unit Tests (Mocked External APIs)

### 2.1 Workers/Jobs

| Worker | File | External API | Test Focus |
|--------|------|--------------|------------|
| `syncConversationsWorker` | `imports/api/engagement/socialInbox/server/workers/syncConversationsWorker.ts` | Meta Graph API | Mock conversation list response, test transformation, test error handling |
| `syncNextMessagesWorker` | `imports/api/engagement/socialInbox/server/workers/syncNextMessagesWorker.ts` | Meta Graph API | Mock batch cursor pagination, test message transformation |
| `fetchConversationFromWebhookWorker` | `imports/api/engagement/socialInbox/server/workers/fetchConversationFromWebhookWorker.ts` | Meta Graph API | Mock conversation metadata fetch |

### 2.2 Webhook Handlers

| Handler | File | External Source | Test Focus |
|---------|------|-----------------|------------|
| `MetaMessagesHandler` | `imports/api/engagement/socialInbox/server/webhooks/MetaMessagesHandler.ts` | Meta Webhooks | Mock various webhook payloads (text, image, story reply), test message parsing, test duplicate handling |

### 2.3 External API Mutations

| Mutation | File | External API | Test Focus |
|----------|------|--------------|------------|
| `messages.send` | `imports/trpc/server/routes/socialInbox/messages.ts` | Meta Graph API | Mock send response, test local DB insert after send |
| `syncSocialInboxJobs.createSyncConversationsJobs` | `imports/trpc/server/routes/socialInbox/syncSocialInboxJobs.ts` | (Creates jobs) | Job creation logic |

---

## 3. Frontend: E2E Visual Tests

### 3.1 Component States

| Component | File | Visual States to Capture |
|-----------|------|--------------------------|
| `ConversationsList` | `components/ConversationsList.tsx` | Empty (per tab: open/later/done), loading skeleton, populated |
| `ConversationItem` | `components/ConversationItem.tsx` | Selected, unselected, unread badge, hover state |
| `ConversationHeader` | `ConversationHeader.tsx` | Normal, with actions visible |
| `ConversationMessagesList` | `ConversationMessagesList.tsx` | Empty, loading, populated, load more spinner |
| `MessageComposer` | `components/MessageComposer.tsx` | Empty, with text, disabled |

### 3.2 Content Variations

| Component | File | Variations |
|-----------|------|------------|
| `MessageBubble` | `components/messages/MessageBubble.tsx` | text, media, story-reply, reply |
| `TextContent` | `components/messages/content/TextContent.tsx` | Plain text, with links, with emojis |
| `AttachmentContent` | `components/messages/content/AttachmentContent.tsx` | Image, video, multiple |
| `StoryReplyContent` | `components/messages/content/StoryReplyContent.tsx` | Image story, video story |
| `StoryMentionContent` | `components/messages/content/StoryMentionContent.tsx` | Standard mention |
| `StoryShareContent` | `components/messages/content/StoryShareContent.tsx` | Standard share |
| `ReplyToContent` | `components/messages/content/ReplyToContent.tsx` | Reply to text, reply to media |
| `MessageRow` | `components/messages/MessageRow.tsx` | Incoming, outgoing |

### 3.3 Responsive/Layout

| Component | File | Viewports |
|-----------|------|-----------|
| `SocialInboxView` | `SocialInboxView.tsx` | Desktop (sidebar + main), mobile (collapsed) |
| `ConversationsList` | `components/ConversationsList.tsx` | Desktop width, narrow width |

---

## 4. Frontend: E2E Functional Tests

### 4.1 User Interactions

| Interaction | Components Involved | Test Scenarios |
|-------------|---------------------|----------------|
| Select conversation | `ConversationItem`, `ConversationMessagesList` | Click item → loads messages, URL updates |
| Hover conversation | `ConversationItem` | Shows action buttons on hover |
| Click status action | `ConversationItem`, `ConversationHeader` | Triggers status change |

### 4.2 State Transitions

| Transition | From → To | Trigger Locations | Edge Cases |
|------------|-----------|-------------------|------------|
| Move to Later | Open → Saved | Sidebar button, Header button | Selected item, unselected item, last item in list |
| Move to Done | Open → Done | Sidebar button, Header button | Selected item, unselected item, last item in list |
| Move to Done | Saved → Done | Sidebar button, Header button | Selected item, unselected item, last item in list |
| Move to Open | Saved → Open | Sidebar button, Header button | Selected item, unselected item |
| Move to Open | Done → Open | Sidebar button, Header button | Navigates to Open tab |
| Move to Later | Done → Saved | Sidebar button | Stays on Done tab |

### 4.3 Navigation Flows

| Flow | URL Pattern | Test Scenarios |
|------|-------------|----------------|
| Tab switching | `/e/{ws}/inbox?tab={open\|saved\|done}` | Click tabs, URL updates, state persists on refresh |
| Conversation deep link | `/e/{ws}/inbox/{conversationId}?tab=X` | Direct URL access, conversation focused |
| Status mismatch redirect | `/e/{ws}/inbox/{id}?tab=open` (but conv is in Later) | Redirects to correct tab |
| No conversation selected | `/e/{ws}/inbox?tab=open` | Shows first conversation, or empty state |

### 4.4 Data Operations (UI-triggered, DB-only)

| Operation | Components | Test Scenarios |
|-----------|------------|----------------|
| Change conversation status | `ConversationItem`, `ConversationHeader` | Status updates in DB, UI reflects change |
| Mark messages as read | `ConversationMessagesList` | Opening conversation marks as read, badge disappears |
| Load more messages | `ConversationMessagesList` | Scroll triggers load, older messages appear |

### 4.5 Focus/Selection Behavior

| Scenario | Expected Behavior | Test |
|----------|-------------------|------|
| Move selected conversation | Focus moves to next conversation | Assert focus change |
| Move last conversation | Empty state shown | Assert empty state visible |
| Move unselected conversation | No focus change | Assert original selection maintained |
| Refresh with selection | Selection persists | Assert URL and focus match after reload |

---

## 5. Untestable: Tooling Gaps

### 5.1 External API Calls

| Operation | Reason | Alternative Testing |
|-----------|--------|---------------------|
| Send message to Meta | External API call to Meta Graph API | Unit test `messages.send` mutation with mocked Meta response |
| Sync conversations | External API call to Meta Graph API | Unit test `syncConversationsWorker` with mocked responses |
| Sync older messages | External API call to Meta Graph API | Unit test `syncNextMessagesWorker` with mocked responses |

### 5.2 External Triggers

| Trigger | Reason | Alternative Testing |
|---------|--------|---------------------|
| Receive webhook from Meta | External source, cannot trigger in E2E | Unit test `MetaMessagesHandler` with mock payloads |

### 5.3 Real-time External Sync

| Sync | Reason | Alternative Testing |
|------|--------|---------------------|
| New message arrival | Would require real Meta message | Generate message in DB, test UI reactivity separately |
| Conversation update from Meta | External source | Generate updated conversation in DB |

---

## 6. Test Data Generators Needed

| Generator | Purpose | Example Usage |
|-----------|---------|---------------|
| `generateConversation` | Create conversation with participants | `await generateConversation({ workspaceId, pageId, status: 'open', participants: [...] })` |
| `conversation.generateMessage` | Add message to conversation | `await conversation.generateMessage({ contentType: 'text', direction: 'incoming', textData: {...} })` |
| `updatePage` | Set page properties | `await updatePage(pageId, { publicPageId, apiGrantedPermissions: [...] })` |

---

## 7. Page Object Components Needed

| Component | Purpose | Exists? |
|-----------|---------|---------|
| `onSocialInboxSidebar` | Conversation list interactions | ✅ Yes |
| `onSocialInboxView` | Main view container | ✅ Yes |
| `onConversationHeader` | Header actions | ✅ Yes |
| `onConversationFooter` | Message composer | ✅ Yes |
| `onMessagesList` | Message display/scroll | ⚠️ Check |

---

## 8. Test File Structure Recommendation

```
tests/playwright/integration/
├── features/Engagement/DMs/
│   ├── navigation_spec.ts          # Tab switching, URL persistence
│   ├── statusTransitions_spec.ts   # Open↔Later↔Done flows
│   ├── allContentTypes_spec.ts     # Message type display
│   ├── loadMore_spec.ts            # Pagination behavior
│   ├── selectionBehavior_spec.ts   # Focus/selection edge cases
│   └── utils.ts                    # Shared helpers
├── visual/engagement/
│   ├── conversationSidebar_views.ts
│   ├── conversationMessages_views.ts
│   ├── messageContentTypes_views.ts
│   └── emptyStates_views.ts
```
