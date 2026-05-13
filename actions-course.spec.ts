/* =====================================================================
 *  PLAYWRIGHT ACTIONS — COMPLETE COURSE (single file, runnable)
 * =====================================================================
 *
 *  Companion to tests/locators-course.spec.ts. That file teaches WHERE.
 *  This file teaches WHAT YOU DO once you've located the element.
 *
 *  Target app    : http://localhost:4200  (started automatically by the
 *                  webServer block in playwright.config.ts → `npm start`)
 *  Target page   : Forms → Form Layouts
 *  Component     : ngx-form-layouts
 *                  src/app/pages/forms/form-layouts/form-layouts.component.html
 *
 *  HOW TO RUN
 *  ──────────
 *    All tests          npx playwright test tests/actions-course.spec.ts
 *    Headed (watch it)  npx playwright test tests/actions-course.spec.ts --headed
 *    One section        npx playwright test tests/actions-course.spec.ts -g "checkbox"
 *    Step debug         npx playwright test tests/actions-course.spec.ts --debug
 *    UI mode            npx playwright test --ui
 *
 *  =====================================================================
 *  THEORY — WHAT IS AN ACTION?
 *  =====================================================================
 *
 *  An ACTION is a verb you call on a Locator: click, fill, check, hover,
 *  press, selectOption, dragTo, etc. Every action goes through a checklist
 *  before it actually fires. That checklist is called ACTIONABILITY:
 *
 *    Attached         — element is in the DOM
 *    Visible          — has a non-zero box, is not display:none / hidden
 *    Stable           — not animating (transform/opacity has settled)
 *    Receives events  — no other element is sitting on top of it
 *    Enabled          — for form controls, not [disabled]
 *    Editable         — for fill, not [readonly]
 *
 *    .click()  waits for: attached + visible + stable + enabled + receives events
 *    .fill()   waits for: attached + visible + enabled + editable (no stability)
 *    .check()  waits for: attached + visible + stable + enabled + receives events
 *               + must be a real <input type="checkbox|radio"> (or have role)
 *
 *  If any check fails until the action timeout (default 30 s, override
 *  with actionTimeout in playwright.config.ts), Playwright throws.
 *
 *  THE FORCE OPTION — WHEN, AND WHY YOU'LL NEED IT IN THIS APP
 *  ──────────────────────────────────────────────────────────
 *  `{ force: true }` SKIPS the actionability checks. It is normally an
 *  escape hatch — but Nebular's nb-checkbox and nb-radio hide the real
 *  <input> with `class="native-input visually-hidden"` and show a custom
 *  <span> on top. The real input is therefore "not visible" by Playwright's
 *  rules, so .check() / .uncheck() throw without force. Two ways to deal:
 *
 *    1. Force-check the native input:
 *         await page.getByRole('radio', { name: 'Option 1' }).check({ force: true })
 *
 *    2. Click the visible label/text — the click propagates to the input:
 *         await page.getByText('Option 1').click()
 *
 *  We use (1) because it is explicit about what we're toggling and uses
 *  the proper check() semantics (no-op if already checked).
 *
 *  WEB-FIRST vs GENERIC ASSERTIONS — RECAP
 *  ───────────────────────────────────────
 *    Web-first  expect(loc).toBeChecked()        AUTO-RETRIES.
 *               expect(loc).toHaveValue('x')     AUTO-RETRIES.
 *    Generic    expect(await loc.isChecked()).toBe(true)  ← single shot
 *               expect(await loc.inputValue()).toBe('x')  ← single shot
 *
 *  Use generic only when you need the value itself for further logic.
 *  Otherwise prefer web-first — they're flake-resistant by design.
 *
 *  AVOID page.waitForTimeout(...)
 *  ──────────────────────────────
 *  The pwActions.spec.ts file we used as inspiration sprinkles
 *  `page.waitForTimeout(3000)` between steps. That is an anti-pattern —
 *  it slows the suite and hides race conditions. We use web-first
 *  assertions instead; they wait for the real condition, then continue.
 *
 *  =====================================================================
 *  ACTION CHEAT SHEET — by element type
 *  =====================================================================
 *
 *    INPUT / TEXTAREA      fill, clear, pressSequentially, press,
 *                          inputValue, getAttribute, focus, blur
 *    BUTTON / LINK         click, dblclick, hover, focus, press
 *    RADIO                 check (force on Nebular), isChecked
 *    CHECKBOX              check, uncheck, setChecked(boolean), isChecked
 *    SELECT                selectOption (not present on Form Layouts)
 *    KEYBOARD              page.keyboard.press / type, locator.press
 *    MOUSE                 hover, click, dblclick, dragTo
 *
 *  Click options worth knowing:
 *    button: 'right' | 'middle'      right-click / middle-click
 *    modifiers: ['Shift'|'Control'|'Alt'|'Meta'|'ControlOrMeta']
 *    position: { x, y }              click at offset inside the box
 *    clickCount: 2                   alternative to dblclick
 *    delay: ms                       hold mouse down for ms
 *    force: true                     skip actionability checks
 *    trial: true                     dry-run the actionability checks
 *    noWaitAfter: true               don't wait for navigation after click
 *
 *  =====================================================================
 */

import { test, expect, Locator } from '@playwright/test';

test.describe('Playwright Actions Course — Form Layouts', () => {
  /**
   * beforeEach navigates to Forms → Form Layouts before every test.
   * The webServer block in playwright.config.ts ensures `npm start`
   * is running on http://localhost:4200, so we don't manage it here.
   */
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
  });

  /* ===================================================================
   *  1. Text Input — fill (the workhorse)
   * ===================================================================
   *
   *  fill(value) is the right way to put text into <input> / <textarea>:
   *    • clears existing value first,
   *    • emits a single 'input' + 'change' event,
   *    • runs actionability (visible + enabled + editable),
   *    • does NOT simulate keystrokes — much faster than typing.
   *
   *  Use pressSequentially when the app reacts to each keystroke
   *  (autocomplete, type-ahead search). Otherwise prefer fill — speed.
   *
   *  type() exists but emits per-key events synchronously without
   *  actionability — basically a worse pressSequentially. Avoid.
   */
  test('1. fill — set value, read it back, verify with web-first', async ({ page }) => {
    const basicForm = page.locator('nb-card', { hasText: 'Basic form' });
    const email = basicForm.getByLabel('Email address');

    await email.fill('jane@example.com');

    // Generic — single shot, no retry on the value
    const value: string = await email.inputValue(); // waits for element only
    expect(value).toBe('jane@example.com'); // frozen string, NO retry

    // Web-first — polls inputValue() until it matches or timeout fires
    await expect(email).toHaveValue('jane@example.com'); // retries up to 5s
  });

  /* ===================================================================
   *  2. Text Input — clear, then re-fill
   * ===================================================================
   *
   *  fill('') is equivalent to clear() — both empty the input. clear()
   *  reads better when intent is "wipe and start over". After clear(),
   *  the input is empty and editable; fill again to set a new value.
   */
  test('2. clear — wipe a field and re-fill it', async ({ page }) => {
    const grid = page.locator('nb-card', { hasText: 'Using the Grid' });
    const email = grid.getByTestId('email-input');

    await email.fill('first@v1.com');
    await expect(email).toHaveValue('first@v1.com');

    await email.clear();
    await expect(email).toHaveValue('');

    await email.fill('second@v2.com');
    await expect(email).toHaveValue('second@v2.com');
  });

  /* ===================================================================
   *  3. Text Input — pressSequentially (simulate typing)
   * ===================================================================
   *
   *  pressSequentially(text, { delay }) types one key at a time, firing
   *  keydown/keypress/keyup for each character. Use it when:
   *    • the field has type-ahead / autocomplete that triggers per key,
   *    • the test must look human (visual demos),
   *    • you need to verify per-key validation.
   *
   *  delay is in milliseconds between keystrokes. 30–100 ms is enough
   *  for type-ahead. Higher values just slow the suite down.
   *
   *  pressSequentially does NOT clear the field first. Combine with
   *  clear() if you need a fresh value.
   */
  test('3. pressSequentially — type one key at a time', async ({ page }) => {
    const grid = page.locator('nb-card', { hasText: 'Using the Grid' });
    const email = grid.getByTestId('email-input');

    await email.clear();
    await email.pressSequentially('typed@slowly.com', { delay: 30 });

    await expect(email).toHaveValue('typed@slowly.com');
  });

  /* ===================================================================
   *  4. Text Input — getAttribute and reading metadata
   * ===================================================================
   *
   *  getAttribute('name') reads any DOM attribute. Common uses:
   *    • placeholder    page.locator(...).getAttribute('placeholder')
   *    • maxlength      cap on length
   *    • type           email, password, text, number
   *    • aria-*         accessibility attributes
   *
   *  Returns string | null. NULL means the attribute is not set.
   *
   *  Note: this is a single-shot read — it does NOT auto-retry. If you
   *  need to wait for the attribute to appear, use:
   *    expect(loc).toHaveAttribute('name', 'expected')   // web-first
   */
  test('4. getAttribute and toHaveAttribute — read metadata', async ({ page }) => {
    const grid = page.locator('nb-card', { hasText: 'Using the Grid' });
    const email = grid.getByTestId('email-input');

    // Single-shot read — returns string or null.
    const placeholder: string | null = await email.getAttribute('placeholder');
    expect(placeholder).toBe('Email');
    const inputType: string | null = await email.getAttribute('type');
    expect(inputType).toBe('email');

    // Web-first equivalent — auto-retries.
    await expect(email).toHaveAttribute('placeholder', 'Email');
    await expect(email).toHaveAttribute('type', 'email');

    // Useful guard for fields that don't have the attribute.
    const maxLength: string | null = await email.getAttribute('maxlength');
    expect(maxLength).toBeNull();
  });

  /* ===================================================================
   *  5. Button — click and its options
   * ===================================================================
   *
   *  .click() is the most-used action. Variants and options:
   *    .click()                        left-click, default options
   *    .click({ button: 'right' })     right-click — opens context menu
   *    .click({ clickCount: 2 })       same as .dblclick()
   *    .click({ modifiers: ['Shift'] })   Shift-click
   *    .click({ position: { x, y } })  click at offset inside the box
   *    .click({ force: true })         skip actionability — last resort
   *    .click({ trial: true })         dry-run actionability, no real click
   *
   *  Form Layouts buttons don't post anywhere (the forms are decorative),
   *  so we just verify the button is clickable and exists.
   */
  test('5. click — basic and with options', async ({ page }) => {
    const basicForm = page.locator('nb-card', { hasText: 'Basic form' });
    const submit = basicForm.getByRole('button', { name: 'Submit' });

    // Default click — auto-waits for actionability, then fires.
    await submit.click();

    // Trial mode — runs actionability checks but does NOT click. Useful
    // for assertions like "is this button currently clickable?".
    await expect(submit).toBeEnabled();
    await submit.click({ trial: true });

    // Modifier keys — Ctrl-click on a link opens in a new tab in browsers.
    // We just demo the syntax; nothing on this page handles the modifier.
    await submit.click({ modifiers: ['ControlOrMeta'] });
  });

  /* ===================================================================
   *  5b. Modifier-click + capture the new tab
   * ===================================================================
   *
   *  Cmd/Ctrl-clicking a link opens it in a new tab. To act on the new
   *  tab you must register a listener on the BrowserContext BEFORE the
   *  click, then await both with Promise.all — otherwise you race the
   *  popup event and end up hanging.
   *
   *  ControlOrMeta maps to Cmd on Mac and Ctrl on Win/Linux. Plain
   *  'Control' on Mac opens the context menu instead.
   */
  test('Modifier-click opens IoT Dashboard in a new tab', async ({ page, context }) => {
    const iotDashboard = page.getByRole('link', { name: 'IoT Dashboard' });
    await expect(iotDashboard).toBeVisible();

    const [newTab] = await Promise.all([
      context.waitForEvent('page'),
      iotDashboard.click({ modifiers: ['ControlOrMeta'] }),
    ]);

    await newTab.waitForLoadState();

    // New tab landed on the dashboard.
    await expect(newTab).toHaveURL(/\/pages\/iot-dashboard/);
    await expect(newTab.locator('ngx-temperature')).toBeVisible();

    // Original tab is still where beforeEach left it (Form Layouts).
    await expect(page).toHaveURL(/\/pages\/forms\/layouts/);
  });

  /* ===================================================================
   *  6. Hover, focus, blur
   * ===================================================================
   *
   *  hover()   moves the mouse over the element (triggers tooltips,
   *            dropdown menus, hover styles).
   *  focus()   programmatically focuses the element (no mouse / tab).
   *  blur()    removes focus.
   *
   *  Reading focus state:
   *    expect(loc).toBeFocused()    web-first
   *    document.activeElement === element  via evaluate (rarely needed)
   */
  test('6. hover, focus, blur', async ({ page }) => {
    const inline = page.locator('nb-card', { hasText: 'Inline form' });
    const nameInput = inline.getByPlaceholder('Jane Doe');

    await nameInput.hover();
    await nameInput.focus();
    await expect(nameInput).toBeFocused();

    await nameInput.blur();
    await expect(nameInput).not.toBeFocused();
  });

  /* ===================================================================
   *  7. Radio Buttons — check, isChecked, exclusive selection
   * ===================================================================
   *
   *  Radios behave as a group: checking one unchecks the others. The
   *  Using-the-Grid card has Option 1, Option 2, and a Disabled Option.
   *
   *  GOTCHA — Nebular hides the native <input>:
   *    The input has class="native-input visually-hidden", so Playwright
   *    sees it as not visible. .check() throws unless we pass force:true,
   *    or we click the wrapping label / visible text.
   *
   *  setChecked(boolean) does NOT exist for radios — only for checkboxes.
   *  Radios have no "uncheck" concept; the way to clear is to check a
   *  different radio in the group.
   */
  test('7. radio — check, exclusive selection, disabled state', async ({ page }) => {
    const grid = page.locator('nb-card', { hasText: 'Using the Grid' });

    const option1: Locator = grid.getByRole('radio', { name: 'Option 1' });
    const option2: Locator = grid.getByRole('radio', { name: 'Option 2' });
    const disabledOption: Locator = grid.getByRole('radio', { name: 'Disabled Option' });

    // Initially nothing is checked.
    await expect(option1).not.toBeChecked();
    await expect(option2).not.toBeChecked();

    // Check option 1 — force is required because the native input is
    // visually-hidden behind a custom span.
    await option1.check({ force: true });
    await expect(option1).toBeChecked();

    // Exclusive selection — checking option 2 clears option 1.
    await option2.check({ force: true });
    await expect(option2).toBeChecked();
    await expect(option1).not.toBeChecked();

    // Disabled radios cannot be checked. Web-first state assertion:
    await expect(disabledOption).toBeDisabled();
  });

  /* ===================================================================
   *  8. Checkboxes — check, uncheck, setChecked
   * ===================================================================
   *
   *  Three operations:
   *    .check()             ensure CHECKED — no-op if already checked.
   *    .uncheck()           ensure UNCHECKED — no-op if already unchecked.
   *    .setChecked(value)   declarative — pass true/false. Cleanest for
   *                         data-driven loops (see test 10).
   *
   *  Same Nebular gotcha: pass { force: true } because the native input
   *  is visually-hidden.
   */
  test('8. checkbox — check, uncheck, setChecked', async ({ page }) => {
    const basicForm = page.locator('nb-card', { hasText: 'Basic form' });
    const checkMeOut = basicForm.getByRole('checkbox', { name: 'Check me out' });

    await expect(checkMeOut).not.toBeChecked();

    await checkMeOut.check({ force: true });
    await expect(checkMeOut).toBeChecked();

    // .check() is a no-op when already checked — safe to call again.
    await checkMeOut.check({ force: true });
    await expect(checkMeOut).toBeChecked();

    await checkMeOut.uncheck({ force: true });
    await expect(checkMeOut).not.toBeChecked();

    // setChecked is the declarative form — useful in data-driven loops.
    await checkMeOut.setChecked(true, { force: true });
    await expect(checkMeOut).toBeChecked();
    await checkMeOut.setChecked(false, { force: true });
    await expect(checkMeOut).not.toBeChecked();
  });

  /* ===================================================================
   *  9. Checkboxes — strict mode and scoping
   * ===================================================================
   *
   *  "Remember me" appears TWICE on Form Layouts (Inline form + Horizontal
   *  form). A page-wide getByRole('checkbox', { name: 'Remember me' })
   *  matches 2 → strict-mode violation. Scope to the right card.
   */
  test('9. checkbox — duplicate label, scope to disambiguate', async ({ page }) => {
    // The naive locator matches more than one element.
    const allRememberMe = page.getByRole('checkbox', { name: 'Remember me' });
    expect(await allRememberMe.count()).toBe(2);

    // Scope by card. Each scoped locator now matches exactly one.
    const inline = page.locator('nb-card', { hasText: 'Inline form' });
    const horizontal = page.locator('nb-card', { hasText: 'Horizontal form' });

    const inlineRemember = inline.getByRole('checkbox', { name: 'Remember me' });
    const horizontalRemember = horizontal.getByRole('checkbox', { name: 'Remember me' });

    await inlineRemember.check({ force: true });
    await expect(inlineRemember).toBeChecked();
    await expect(horizontalRemember).not.toBeChecked();

    await horizontalRemember.check({ force: true });
    await expect(horizontalRemember).toBeChecked();
    // Scoping ensures each checkbox is independent.
  });

  /* ===================================================================
   *  10. Iterating multiple checkboxes — data-driven flips
   * ===================================================================
   *
   *  Real-world apps often have lists of checkboxes (filters, day-of-week
   *  pickers, permissions). The pattern:
   *
   *      const items = ['A', 'B', 'C'];
   *      for (const name of items) {
   *        const cb = page.getByRole('checkbox', { name });
   *        await cb.setChecked(true, { force: true });
   *        await expect(cb).toBeChecked();
   *      }
   *
   *  Form Layouts only has 3 checkboxes total, but the same pattern
   *  applies. We iterate over a known list and toggle each.
   */
  test('10. iterate checkboxes — toggle pattern across the page', async ({ page }) => {
    type CheckboxRef = { card: string; name: string };
    const refs: CheckboxRef[] = [
      { card: 'Inline form', name: 'Remember me' },
      { card: 'Basic form', name: 'Check me out' },
      { card: 'Horizontal form', name: 'Remember me' },
    ];

    const checkboxes: Locator[] = refs.map((ref) =>
      page.locator('nb-card', { hasText: ref.card }).getByRole('checkbox', { name: ref.name })
    );
    expect(checkboxes.length).toBe(3);

    // Step A — check all, assert each.
    for (const cb of checkboxes) {
      await cb.check({ force: true });
      await expect(cb).toBeChecked();
    }

    // Step B — uncheck the last one only, assert the others are still on.
    await checkboxes[checkboxes.length - 1].uncheck({ force: true });
    await expect(checkboxes[checkboxes.length - 1]).not.toBeChecked();
    await expect(checkboxes[0]).toBeChecked();
    await expect(checkboxes[1]).toBeChecked();

    // Step C — toggle: flip whatever the current state is.
    for (const cb of checkboxes) {
      const wasChecked = await cb.isChecked();
      await cb.setChecked(!wasChecked, { force: true });
      if (wasChecked) {
        await expect(cb).not.toBeChecked();
      } else {
        await expect(cb).toBeChecked();
      }
    }
  });

  /* ===================================================================
   *  11. Keyboard — locator.press and page.keyboard
   * ===================================================================
   *
   *  Two APIs for keyboard input:
   *
   *    locator.press('Tab' | 'Enter' | 'Control+a' | 'a')
   *      Fires a single key (or chord). The element is focused first.
   *
   *    page.keyboard.press / type / down / up
   *      Lower-level — does NOT touch any locator. Use when no specific
   *      element needs to be focused, or to test global shortcuts.
   *
   *  Special key syntax:
   *    'Tab', 'Enter', 'Escape', 'ArrowDown', 'F5', 'PageUp', etc.
   *    Chords with '+': 'Control+a', 'Shift+ArrowRight', 'Meta+k'.
   *
   *  Sequence:
   *    locator.press('Control+a')   →  selects all
   *    locator.press('Delete')      →  deletes selection
   */
  test('11. keyboard — focus + Ctrl+A + Delete', async ({ page }) => {
    const grid = page.locator('nb-card', { hasText: 'Using the Grid' });
    const email = grid.getByTestId('email-input');

    await email.fill('to-be-deleted@example.com');
    await expect(email).toHaveValue('to-be-deleted@example.com');

    // Select all + delete via keyboard.
    await email.press('Control+a');
    await email.press('Delete');
    await expect(email).toHaveValue('');

    // Lower-level page.keyboard — type a single Tab to move focus.
    await email.focus();
    await page.keyboard.press('Tab');
    await expect(email).not.toBeFocused();
  });

  /* ===================================================================
   *  12. Reading state — generic helpers vs web-first
   * ===================================================================
   *
   *  Generic single-shot reads return a value:
   *    isVisible(), isHidden(), isEnabled(), isDisabled(),
   *    isChecked(), isEditable(), inputValue(), textContent(), innerText()
   *
   *  Web-first equivalents auto-retry:
   *    toBeVisible(), toBeHidden(), toBeEnabled(), toBeDisabled(),
   *    toBeChecked(), toBeEditable(), toHaveValue(), toHaveText()
   *
   *  Rule of thumb:
   *    • Need an assertion → use web-first.
   *    • Need the value for a branch / log / math → use generic.
   *
   *  textContent vs innerText:
   *    textContent   returns ALL text including hidden — what's in the DOM.
   *    innerText     returns RENDERED text — respects display:none, CSS.
   *  Most of the time on visible elements they match. Use innerText when
   *  the element has hidden children whose text you want to ignore.
   */
  test('12. reading state — generic vs web-first', async ({ page }) => {
    const basicForm = page.locator('nb-card', { hasText: 'Basic form' });
    const submit = basicForm.getByRole('button', { name: 'Submit' });

    // Generic — single shot. Returns a value you can branch on.
    const enabled: boolean = await submit.isEnabled();
    const visible: boolean = await submit.isVisible();
    expect(enabled).toBe(true);
    expect(visible).toBe(true);

    // Web-first — auto-retries until pass or expect.timeout.
    await expect(submit).toBeEnabled();
    await expect(submit).toBeVisible();

    // textContent reads what's in the DOM regardless of CSS visibility.
    const cardHeader = basicForm.locator('nb-card-header');
    const text: string | null = await cardHeader.textContent();
    expect(text?.trim()).toBe('Basic form');
    await expect(cardHeader).toHaveText('Basic form'); // web-first
  });
});

/* =====================================================================
 *  CHEAT SHEET — at-a-glance recap
 *  ─────────────────────────────────
 *  fill(value)                  text input — fast, clears first.
 *  clear()                      empty an input.
 *  pressSequentially(t, {delay})  per-key typing, for type-ahead/autocomplete.
 *  press('Control+a')           keyboard chord on a focused element.
 *  click() / click({...})       button + options (modifiers, position, button).
 *  hover() / focus() / blur()   mouse-over and focus management.
 *  check() / uncheck()          for checkboxes/radios. setChecked(bool) for declarative.
 *  isChecked() etc              single-shot read — generic assertion.
 *  expect(loc).toBeChecked()    web-first — AUTO-RETRIES, prefer this.
 *  getAttribute('name')         read any DOM attribute, returns string|null.
 *  toHaveAttribute(...)         web-first version that retries.
 *
 *  New-tab capture
 *  ───────────────
 *  Register context.waitForEvent('page') BEFORE the click, await both
 *  via Promise.all. Use ControlOrMeta for cross-platform modifier-click.
 *
 *  Common gotchas in THIS app
 *  ──────────────────────────
 *  • Nebular checkboxes/radios hide the native <input> with
 *    `class="native-input visually-hidden"`. Use { force: true } on
 *    .check() / .uncheck() / .setChecked(), or click the visible label.
 *  • "Submit" / "Sign in" / "Email" / "Remember me" appear multiple
 *    times across the 6 cards → strict-mode violations. Always scope:
 *      page.locator('nb-card', { hasText: 'Basic form' })
 *          .getByRole('button', { name: 'Submit' })
 *  • Avoid page.waitForTimeout — use web-first assertions instead.
 *  =====================================================================
 */

/* =====================================================================
 *  EXERCISES — try these yourself
 * =====================================================================
 *
 *  HOW TO USE
 *  ──────────
 *    1. Pick an exercise.
 *    2. Remove `.skip` from the test.
 *    3. Replace the `// TODO:` body with your solution.
 *    4. Run only this exercise:
 *         npx playwright test tests/actions-course.spec.ts -g "Exercise 1"
 *    5. Compare with the SOLUTIONS section at the bottom (commented out)
 *       only AFTER you've tried it.
 *
 *  Each exercise has:
 *    • TASK         what to do, in plain English
 *    • HINTS        which APIs to reach for (no code)
 *    • ASSERT       the assertions your solution must make pass
 *  =====================================================================
 */

test.describe('Actions Course — Exercises', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
  });

  /* -------------------------------------------------------------------
   *  EXERCISE 1 — pressSequentially + keyboard + getAttribute
   * -------------------------------------------------------------------
   *  TASK
   *    On the Basic form card:
   *      a) Type "john@test.com" into the email field, ONE KEY AT A TIME
   *         (with a small delay so you can see it in --headed mode).
   *      b) Press Tab to leave the field.
   *      c) Read the email input's `type` attribute and assert it is "email".
   *      d) Verify the field still has the typed value AND is no longer focused.
   *
   *  HINTS
   *    • Scope to `'Basic form'` card; reach the input via getByLabel.
   *    • pressSequentially(text, { delay: 50 }).
   *    • locator.press('Tab') OR page.keyboard.press('Tab').
   *    • getAttribute('type') for (c); toHaveValue + not.toBeFocused for (d).
   * ------------------------------------------------------------------- */
  test.skip('Exercise 1 — type, tab away, verify attribute and focus', async ({ page }) => {
    // TODO: scope to Basic form, pressSequentially the email, Tab away, assert.
  });

  /* -------------------------------------------------------------------
   *  EXERCISE 2 — Radio group exclusivity (with Nebular force gotcha)
   * -------------------------------------------------------------------
   *  TASK
   *    In the "Using the Grid" card:
   *      a) Confirm none of the radios is initially checked.
   *      b) Check Option 1, then Option 2. After (b), Option 1 must be
   *         unchecked (radios are exclusive).
   *      c) Try checking the Disabled Option — it must remain unchecked
   *         (use `toBeDisabled` to assert; don't actually call .check()
   *         on a disabled radio, that throws).
   *
   *  HINTS
   *    • Scope to `'Using the Grid'`.
   *    • getByRole('radio', { name: '...' }).
   *    • Nebular hides the native input → pass `{ force: true }` to .check().
   *    • Web-first: toBeChecked / not.toBeChecked / toBeDisabled.
   * ------------------------------------------------------------------- */
  test.skip('Exercise 2 — radio group: exclusive selection + disabled state', async ({ page }) => {
    // TODO: assert initial state, flip Option 1 → Option 2, verify exclusivity, assert disabled.
  });

  /* -------------------------------------------------------------------
   *  EXERCISE 3 — Multi-checkbox flip with setChecked
   * -------------------------------------------------------------------
   *  TASK
   *    The page has 3 checkboxes:
   *      • Inline form     → "Remember me"
   *      • Basic form      → "Check me out"
   *      • Horizontal form → "Remember me"
   *    Build an array of locators for all three (in that order). Then:
   *      a) Check ALL of them. Assert each is checked.
   *      b) Use setChecked(false, { force: true }) on the MIDDLE one only.
   *         Assert: index 0 still checked, index 1 unchecked, index 2 still checked.
   *      c) Toggle every checkbox: if checked → uncheck, if unchecked → check.
   *         Assert the final state of each is the OPPOSITE of step (a)'s state.
   *
   *  HINTS
   *    • Each checkbox lives in its own card → scope by card hasText.
   *    • Native input is visually-hidden → always `{ force: true }`.
   *    • For the toggle, read state with isChecked(), then setChecked(!state, ...).
   *    • Web-first: toBeChecked / not.toBeChecked.
   * ------------------------------------------------------------------- */
  test.skip('Exercise 3 — iterate three checkboxes, flip middle, then toggle all', async ({ page }) => {
    // TODO: build Locator[], check all, flip middle, toggle all, assert each step.
  });
});

/* =====================================================================
 *  SOLUTIONS — peek only after attempting
 *  (uncomment to verify, or copy into the bodies above)
 * =====================================================================
 *
 *  // ---- Exercise 1 ----
 *  // const basicForm = page.locator('nb-card', { hasText: 'Basic form' });
 *  // const email = basicForm.getByLabel('Email address');
 *  // await email.pressSequentially('john@test.com', { delay: 50 });
 *  // await email.press('Tab');
 *  // await expect(email).toHaveAttribute('type', 'email');
 *  // await expect(email).toHaveValue('john@test.com');
 *  // await expect(email).not.toBeFocused();
 *
 *  // ---- Exercise 2 ----
 *  // const grid = page.locator('nb-card', { hasText: 'Using the Grid' });
 *  // const opt1 = grid.getByRole('radio', { name: 'Option 1' });
 *  // const opt2 = grid.getByRole('radio', { name: 'Option 2' });
 *  // const optDisabled = grid.getByRole('radio', { name: 'Disabled Option' });
 *  // await expect(opt1).not.toBeChecked();
 *  // await expect(opt2).not.toBeChecked();
 *  // await opt1.check({ force: true });
 *  // await expect(opt1).toBeChecked();
 *  // await opt2.check({ force: true });
 *  // await expect(opt2).toBeChecked();
 *  // await expect(opt1).not.toBeChecked();   // exclusivity
 *  // await expect(optDisabled).toBeDisabled();
 *  // await expect(optDisabled).not.toBeChecked();
 *
 *  // ---- Exercise 3 ----
 *  // const refs = [
 *  //   { card: 'Inline form',     name: 'Remember me' },
 *  //   { card: 'Basic form',      name: 'Check me out' },
 *  //   { card: 'Horizontal form', name: 'Remember me' },
 *  // ];
 *  // const checkboxes: Locator[] = refs.map((r) =>
 *  //   page.locator('nb-card', { hasText: r.card }).getByRole('checkbox', { name: r.name })
 *  // );
 *  //
 *  // // a) check all
 *  // for (const cb of checkboxes) {
 *  //   await cb.setChecked(true, { force: true });
 *  //   await expect(cb).toBeChecked();
 *  // }
 *  //
 *  // // b) flip the middle one only
 *  // await checkboxes[1].setChecked(false, { force: true });
 *  // await expect(checkboxes[0]).toBeChecked();
 *  // await expect(checkboxes[1]).not.toBeChecked();
 *  // await expect(checkboxes[2]).toBeChecked();
 *  //
 *  // // c) toggle every checkbox; final state is the inverse of step (a)
 *  // for (const cb of checkboxes) {
 *  //   const current = await cb.isChecked();
 *  //   await cb.setChecked(!current, { force: true });
 *  // }
 *  // await expect(checkboxes[0]).not.toBeChecked();   // was checked, now unchecked
 *  // await expect(checkboxes[1]).toBeChecked();       // was unchecked, now checked
 *  // await expect(checkboxes[2]).not.toBeChecked();   // was checked, now unchecked
 *  =====================================================================
 */
