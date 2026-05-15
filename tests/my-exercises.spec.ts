import test, { expect } from 'playwright/test';

test.describe('My Locators Exercises', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
  });

  // ---------------------------------------------------------------------------
  // Exercise 1 — Scoping + getByLabel
  // Task: On the "Block form" card, fill First Name, Last Name, and Website,
  //       then verify each field holds the value I typed.
  // ---------------------------------------------------------------------------
  test('Exercise 1 - fill the Block form and verify the values', async ({ page }) => {
    const blockFormCard = page.locator('nb-card', { hasText: 'Block form' });
    const firstNameInput = blockFormCard.getByLabel('First Name');
    const websiteInput = blockFormCard.getByLabel('Website');
    const lastNameInput = blockFormCard.getByLabel('Last Name');
    
    await firstNameInput.fill('Ada');
    await lastNameInput.fill('Lovelace');
    await websiteInput.fill('https://ada.dev');

    await expect(firstNameInput).toHaveValue('Ada');
    await expect(lastNameInput).toHaveValue('Lovelace');
    await expect(websiteInput).toHaveValue('https://ada.dev');
  });

  // ---------------------------------------------------------------------------
  // Exercise 2 — .filter({ has })
  // Task: Find the one nb-card that contains a <textarea>, confirm only 1 card
  //       matches, and confirm its header says "Form without labels".
  // ---------------------------------------------------------------------------
  test('Exercise 2 - find the card with a textarea using filter', async ({ page }) => {
    const allCards = page.locator('nb-card');
    const cardsWithTextarea = allCards.filter({
      has: page.locator('textarea'),
    });
    const cardHeader = cardsWithTextarea.locator('nb-card-header');

    await expect(cardsWithTextarea).toHaveCount(1);
    await expect(cardHeader).toHaveText('Form without labels');
  });

  // ---------------------------------------------------------------------------
  // Exercise 3 — Strict mode + counting + indexing
  // Task: Find all <input type="email"> fields on the entire page (no card
  //       scoping), count them (expect 4), fill the first and last, verify both.
  // ---------------------------------------------------------------------------
  test('Exercise 3 - count email inputs and fill first and last', async ({ page }) => {
    const allEmailInputs = page.locator('input[type="email"]');
    const firstEmailInput = allEmailInputs.first();
    const lastEmailInput = allEmailInputs.last();

    await expect(allEmailInputs).toHaveCount(4);
    await firstEmailInput.fill('first@email.com');
    await lastEmailInput.fill('last@email.com');


    await expect(firstEmailInput).toHaveValue('first@email.com');
    await expect(lastEmailInput).toHaveValue('last@email.com');
  });
});

test.describe('My Actions Exercises', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
  });

  test('Exercise 1 - pressSequentially + keyboard + getAttribute', async ({ page }) => {
    const basicFormCard = page.locator('nb-card', { hasText: 'Basic form' });
    const basicEmailInput = basicFormCard.getByLabel('Email address');

    await basicEmailInput.pressSequentially('john@test.com', { delay: 200 });
    await basicEmailInput.press('Tab');
    await expect(basicEmailInput).toHaveAttribute('type', 'email');
    await expect(basicEmailInput).toHaveValue('john@test.com');
    await expect(basicEmailInput).not.toBeFocused();
  });

  test('Exercise 2 — Radio group exclusivity (with Nebular force gotcha)', async ({page}) => {
    const gridFormCard = page.locator('nb-card', { hasText: 'Using the Grid' });

    const optionOne = gridFormCard.getByRole('radio', {name : 'Option 1'});
    const optionTwo = gridFormCard.getByRole('radio', {name : 'Option 2'});
    const optionDisabled = gridFormCard.getByRole('radio', {name : 'Disabled Option'});

    // None is checked
    await expect(optionOne).not.toBeChecked();
    await expect(optionTwo).not.toBeChecked();
    await expect(optionDisabled).toBeChecked();

    // Check first option
    await optionOne.check({force: true});
    await expect(optionOne).toBeChecked();
    await expect(optionTwo).not.toBeChecked();
    await expect(optionDisabled).not.toBeChecked();
    await expect(optionDisabled).toBeDisabled();

    // Check second option
    await optionTwo.check({force: true});
    await expect(optionOne).not.toBeChecked();
    await expect(optionTwo).toBeChecked();
    await expect(optionDisabled).not.toBeChecked();
    await expect(optionDisabled).toBeDisabled();
  });

  test('Exercise 3 — Multi-checkbox flip with setChecked', async ({ page }) => {
    const checkboxes = page.getByRole('checkbox');

    await expect(checkboxes.first()).toBeVisible();

    await test.step('Check all checkboxes and verify if they are checked', async () => {
      for (let i = 0; i < await checkboxes.count(); i++) {
        const checkbox = checkboxes.nth(i);

        await checkbox.check({ force : true });
        await expect(checkbox).toBeChecked;
      }
    });

    await test.step('Uncheck the middle checkbox', async () => {
      const middleCheckbox = checkboxes.nth(await checkboxes.count() / 2);

      await middleCheckbox.setChecked(false, { force: true });
      await expect(checkboxes.nth(0)).toBeChecked();
      await expect(checkboxes.nth(1)).not.toBeChecked();
      await expect(checkboxes.nth(2)).toBeChecked();
    });

    await test.step('Toggle checkboxes', async () => {
      const checkboxes = page.locator('nb-checkbox');

      for (let i = 0; i < await checkboxes.count(); i++) {
        const checkbox = checkboxes.nth(i).getByRole('radio');
        
        await checkboxes.nth(i).click();
      }
    });
  });
});