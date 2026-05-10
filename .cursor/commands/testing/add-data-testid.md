# Add data-testId Locators

## Overview

Analyze all files changed in the current PR and propose `data-testId` attributes for testability in Playwright e2e and visual tests. This command ensures new/changed JSX components have proper test locators following the project conventions.

## Steps

1. **Gather Changed Files**

   Use shell commands to identify all changed files in the PR:

   ```bash
   git diff --name-only master...HEAD
   ```

   Filter to only `.tsx` and `.jsx` files for analysis.

2. **Analyze Each Component**

   For each changed file, identify elements that need `data-testId` attributes:

   - **Interactive elements**: buttons, links, inputs, selects, textareas
   - **Form controls**: checkboxes, switches, radio buttons, sliders
   - **Container elements**: modals, dialogs, sidebars, panels
   - **Navigation elements**: navbar items, menu items, tabs
   - **Dynamic list items**: posts, comments, cards with unique IDs
   - **Section wrappers**: main content areas for visual testing

3. **Check Existing Locators**

   Before adding new attributes, verify the element doesn't already have:

   - A `data-testId` attribute
   - A unique `id` attribute used for testing
   - A role-based locator that's sufficient

4. **Generate Attribute Names**

   Follow the naming convention rules to generate appropriate `data-testId` values.

5. **Add data-testId Attributes**

   Add `data-testId` attributes directly to elements based on conventions and existing usage patterns in the codebase.

## Naming Convention

### Format: camelCase

All `data-testId` attributes must use camelCase:

```tsx
// Good
data-testId="postEditorButton"
data-testId="submitForm"
data-testId="navigationSidebar"

// Bad
data-testId="post-editor-button"
data-testId="submit_form"
data-testId="NavigationSidebar"
```

### Structure: `[context][element][action]`

Build names from context, element type, and action:

```tsx
// Examples
data-testId="workspaceSettingsPanel"    // context: workspaceSettings, element: Panel
data-testId="postEditorSaveButton"      // context: postEditor, element: Button, action: Save
data-testId="mediaUploadInput"          // context: media, element: Input, action: Upload
data-testId="userProfileAvatar"         // context: userProfile, element: Avatar
```

### Dynamic IDs

For elements in lists or with unique identifiers, use template literals:

```tsx
// For list items with IDs
data-testId={`post-${post._id}`}
data-testId={`workspace-${workspace._id}`}
data-testId={`comment-${comment._id}`}
```

## Examples

### Button Example

```tsx
// Before
<Button onClick={handleSave}>Save</Button>

// After
<Button onClick={handleSave} data-testId="saveButton">Save</Button>
```

### Form Input Example

```tsx
// Before
<Input placeholder="Enter email" value={email} onChange={setEmail} />

// After
<Input
  placeholder="Enter email"
  value={email}
  onChange={setEmail}
  data-testId="emailInput"
/>
```

### Modal Example

```tsx
// Before
<Modal open={isOpen} onClose={handleClose}>
  <div className="modal-content">
    {children}
  </div>
</Modal>

// After
<Modal open={isOpen} onClose={handleClose} data-testId="confirmationModal">
  <div className="modal-content" data-testId="confirmationModalContent">
    {children}
  </div>
</Modal>
```

### List Item Example

```tsx
// Before
{posts.map(post => (
  <div key={post._id} className="post-card">
    <h3>{post.title}</h3>
  </div>
))}

// After
{posts.map(post => (
  <div key={post._id} className="post-card" data-testId={`post-${post._id}`}>
    <h3>{post.title}</h3>
  </div>
))}
```

## Output Format

Make a clear summary of the made changes so it's easy to review.

## Notes

- Only analyze committed changes in the PR, not uncommitted modifications
- Skip files that are test files themselves (`.test.tsx`, `.spec.tsx`)
- Skip Storybook files (`.stories.tsx`)
- When unsure about naming, prefer more descriptive names over shorter ones
- Check existing `data-testId` patterns in the same file for consistency
