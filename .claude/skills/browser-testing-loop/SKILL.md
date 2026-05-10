---
name: browser-testing-loop
description: Iterative browser testing workflow for UI verification. Make changes, reload, snapshot, verify, repeat until pixel-perfect. Use for testing UI changes, debugging visual issues, or comparing against Figma designs.
allowed-tools: [Bash, Read, Glob, Grep, Edit, Write, StrReplace, CallMcpTool]
---

# Browser Testing Loop

## Overview

An iterative workflow for verifying UI changes in the browser: **change → reload → snapshot → verify → repeat** until the UI matches expectations or the Figma design.

## Prerequisites

### Browser Tab Management

Before starting any browser testing:

1. **Check existing tabs**:

   ```
   browser_tabs (action: "list")
   ```

2. **Navigate or reuse existing tab**:

   ```
   browser_navigate (url: "http://localhost:3000/{route}")
   ```

3. **Lock the tab** (required before interactions):

   ```
   browser_lock
   ```

4. **When completely done**, unlock:
   ```
   browser_unlock
   ```

> **Critical**: Always `browser_lock` before interactions, `browser_unlock` when finished with ALL browser operations.

## The Testing Loop

### Step 1: Make the Change

- Edit the code file
- Save changes (Vite/Meteor will hot reload, but explicit reload is safer)

### Step 2: Reload & Wait

```
browser_reload
```

Then wait for the page to stabilize:

- Use short incremental waits (1-3 seconds) with snapshots
- Check if content loaded before proceeding
- For slow operations, use `browser_wait_for` with a selector

### Step 3: Capture State

```
browser_snapshot
```

The snapshot returns:

- Page structure with element refs
- Accessibility tree
- Current state of all elements

For visual comparison, also take a screenshot:

```
browser_take_screenshot
```

### Step 4: Analyze & Verify

**Check the snapshot for**:

| Check              | How                                                 |
| ------------------ | --------------------------------------------------- |
| Element visibility | Look for target elements in snapshot                |
| Layout issues      | Check flex/grid structure in tree                   |
| Text content       | Verify text matches expected                        |
| Interactive states | Use `browser_hover`, `browser_click` to test states |
| Console errors     | `browser_console_messages`                          |
| Network issues     | `browser_network_requests`                          |

**Verification questions**:

- Does the UI match the expected design?
- Are all elements visible and properly positioned?
- Do interactive states (hover, focus, active) work?
- Are there any console errors or warnings?

### Step 5: Decision Point

```
IF issue is fixed:
  → Report success, show final screenshot
  → browser_unlock when done

IF still broken:
  → Analyze what's wrong from snapshot
  → Make another change (try different approach)
  → Return to Step 2

IF stuck after 3+ attempts:
  → Stop and ask user for guidance
  → Share what you've tried and current state
```

## Visual QA Checklist

When comparing against a design (Figma), verify each item:

### Typography

- [ ] Font family correct (`font-gilroy` or `font-gilroy-semibold`)
- [ ] Font size matches (check against typography utilities)
- [ ] Font weight correct (400, 500, 600)
- [ ] Line height matches
- [ ] Letter spacing correct
- [ ] Text color uses correct token

### Spacing

- [ ] Padding matches design (use spacing tokens)
- [ ] Margins/gaps correct between elements
- [ ] No unexpected whitespace
- [ ] Consistent spacing throughout

### Colors

- [ ] Background colors match tokens
- [ ] Text colors match tokens
- [ ] Border colors correct
- [ ] No hardcoded hex values

### Layout

- [ ] Elements properly aligned
- [ ] Flex/grid layout correct
- [ ] Responsive behavior works
- [ ] No overflow issues

### Borders & Shadows

- [ ] Border radius matches (`rounded-*` tokens)
- [ ] Border width correct
- [ ] Shadow matches (`shadow-*` tokens)

### Interactive States

- [ ] Hover state works and looks correct
- [ ] Focus state visible and accessible
- [ ] Active/pressed state works
- [ ] Disabled state styled correctly

### Icons

- [ ] Correct icon displayed
- [ ] Icon size matches design
- [ ] Icon color correct (may differ from text)
- [ ] Stroke width matches

## Browser Tool Reference

### Navigation & State

| Tool                       | Purpose                   |
| -------------------------- | ------------------------- |
| `browser_navigate`         | Go to URL                 |
| `browser_reload`           | Refresh page              |
| `browser_navigate_back`    | Go back                   |
| `browser_navigate_forward` | Go forward                |
| `browser_tabs`             | List/manage tabs          |
| `browser_lock`             | Lock tab for interactions |
| `browser_unlock`           | Release tab lock          |

### Inspection

| Tool                       | Purpose                           |
| -------------------------- | --------------------------------- |
| `browser_snapshot`         | Get page structure & element refs |
| `browser_take_screenshot`  | Capture visual screenshot         |
| `browser_console_messages` | Get console logs/errors           |
| `browser_network_requests` | See network activity              |
| `browser_get_attribute`    | Get element attribute             |
| `browser_get_input_value`  | Get input value                   |
| `browser_is_visible`       | Check element visibility          |
| `browser_is_enabled`       | Check if enabled                  |
| `browser_is_checked`       | Check checkbox/radio state        |

### Interactions

| Tool                    | Purpose                   |
| ----------------------- | ------------------------- |
| `browser_click`         | Click element             |
| `browser_hover`         | Hover over element        |
| `browser_type`          | Type text (appends)       |
| `browser_fill`          | Clear and type text       |
| `browser_fill_form`     | Fill multiple form fields |
| `browser_select_option` | Select dropdown option    |
| `browser_press_key`     | Press keyboard key        |
| `browser_scroll`        | Scroll page/element       |
| `browser_drag`          | Drag element              |

### Utilities

| Tool                    | Purpose                     |
| ----------------------- | --------------------------- |
| `browser_wait_for`      | Wait for selector/condition |
| `browser_resize`        | Change viewport size        |
| `browser_handle_dialog` | Handle alert/confirm/prompt |
| `browser_highlight`     | Highlight element visually  |

## Example Flows

### Basic UI Fix

```
1. User: "The button text is cut off"
2. browser_snapshot → See button with overflow:hidden cutting text
3. Edit: Add `overflow-visible` or increase width
4. browser_reload
5. browser_snapshot → Text still cut off (padding issue)
6. Edit: Adjust padding from p-sm to p-md
7. browser_reload
8. browser_snapshot → Button text fully visible ✓
9. browser_unlock
10. Report: "Fixed - adjusted padding to p-md"
```

### Hover State Testing

```
1. User: "Hover state doesn't look right"
2. browser_snapshot → Get element ref for button
3. browser_hover (ref: "button[ref=e5]")
4. browser_snapshot → Capture hover state
5. Compare with Figma hover design
6. Edit: Adjust hover:bg-primary-80 to hover:bg-primary-100
7. browser_reload
8. browser_hover → browser_snapshot
9. Hover state matches design ✓
```

### Responsive Testing

```
1. browser_resize (width: 768, height: 1024) → Tablet
2. browser_snapshot → Check layout
3. browser_resize (width: 375, height: 812) → Mobile
4. browser_snapshot → Check mobile layout
5. Fix any breakpoint issues found
6. browser_reload → Verify fixes at each breakpoint
```

## Stopping Conditions

**Stop the loop when**:

- ✅ Issue is completely fixed and verified via snapshot
- ❓ Need user clarification (unclear requirements)
- ⚠️ 3+ attempts failed with different approaches - ask user

**Never stop just because**:

- One attempt failed (try different approach)
- Change was made (must verify with snapshot)
- Snapshot taken (must analyze if fixed)

## Integration with Feature Development

When doing pixel-perfect implementation from Figma:

1. Use this skill for the **verification loop**
2. Compare browser screenshots against Figma screenshots
3. Run through the Visual QA Checklist for each element
4. Iterate until browser matches Figma exactly

The feature-development skill (`.cursor/skills/feature-development/SKILL.md`) handles design extraction and implementation; this skill handles verification.
