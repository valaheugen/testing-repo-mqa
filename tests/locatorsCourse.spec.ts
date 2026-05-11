import test, { expect } from 'playwright/test';

// Locators:
// - getByRole
// - getByLabel
// - getByPlaceholder
// - getByText
// - getByAltText
// - getByTitle
// - getByTestId
// - locator(selector)

test.describe('Form Layouts page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
  });

  test('getByRole - locator', async ({ page }) => {
    const basicFormComponent = page.locator('nb-card', { hasText: 'Basic Form' });
    await expect(basicFormComponent).toBeVisible();

    const submitBasicFormButton = basicFormComponent.getByRole('button', { name: 'Submit' });
    await expect(submitBasicFormButton).toBeVisible();

    const emailInputBasicForm = basicFormComponent.getByRole('textbox', { name: 'Email' });
    await expect(emailInputBasicForm).toBeVisible();

    const passwordInputBasicForm = basicFormComponent.getByRole('textbox', { name: 'Password' });
    await expect(passwordInputBasicForm).toBeVisible();

    const checkboxBasicForm = basicFormComponent.getByRole('checkbox', { name: 'Check me out' });
    await expect(checkboxBasicForm).toBeVisible();
  });

  test('getByLabel - locator', async ({ page }) => {
    const basicFormComponent = page.locator('nb-card', { hasText: 'Basic Form' });
    await expect(basicFormComponent).toBeVisible();

    const emailInputByLabel = basicFormComponent.getByLabel('Email address');
    await emailInputByLabel.fill('test@test.com');

    const passwordInputByLabel = basicFormComponent.getByLabel('Password');
    await passwordInputByLabel.fill('password');
  });

  test('getByPlaceholder - locator', async ({ page }) => {
    const basicFormComponent = page.locator('nb-card', { hasText: 'Basic Form' });
    await expect(basicFormComponent).toBeVisible();

    const emailByPlaceholder = basicFormComponent.getByPlaceholder('Email');
    await expect(emailByPlaceholder).toBeVisible();

    await expect(basicFormComponent.getByPlaceholder('Password')).toBeVisible();
  });

  test('getByText - locator', async ({ page }) => {
    const inlineFormComponent = page.getByText('Inline form');
    await expect(inlineFormComponent).toBeVisible();

    const usingTheGridFormComponent = page.getByText('Using the Grid');
    await expect(usingTheGridFormComponent).toBeVisible();

    const formLabelsFormComponent = page.getByText(/Fo[A-Za-z]m without labels/i);
    await expect(formLabelsFormComponent).toBeVisible();
  });

  test('locator(selector) - locator', async ({ page }) => {
    const basicFormComponent = page.locator('nb-card', { hasText: 'Basic Form' });
    await expect(basicFormComponent).toBeVisible();

    const submitBasicFormButton = basicFormComponent.getByRole('button', { name: 'Submit' });
    await expect(submitBasicFormButton).toBeVisible();

    const submitCSS1 = page.locator('button[status="danger"]');
    await expect(submitCSS1).toHaveText('Submit');

    await expect(
      page.locator('nb-card:has-text("Basic Form") button[status="danger"]')
    ).toBeVisible();
  });

  test('xpath - locator', async ({ page }) => {
    const blockSubmit = page.locator(
      '//nb-card[.//nb-card-header[normalize-space()="Basic form"]]'
    );
    await expect(blockSubmit).toBeVisible();
  });

  test('getByTestId - locator', async ({ page }) => {
    const basicFormComponent = page.locator('nb-card', { hasText: 'Basic Form' });
    await expect(basicFormComponent).toBeVisible();

    const submitBasicFormButton = basicFormComponent.getByRole('button', { name: 'Submit' });
    await expect(submitBasicFormButton).toBeVisible();

    ////////////////////////

    const submitBasicFormButtonByTestId = page.getByTestId('submitBasicFormButton');
    await expect(submitBasicFormButtonByTestId).toBeVisible();
  });

  test('filter - locator', async ({ page }) => {
    const buttonElement = page.getByRole('button', { name: 'Submit' });
    await expect(buttonElement).toHaveCount(3);

    await expect(buttonElement.first()).toBeVisible();
    await expect(buttonElement.last()).toBeVisible();
    await expect(buttonElement.nth(1)).toBeVisible();

    const basicFormComponent = page.locator('nb-card').filter({ hasText: 'Basic Form' });
    await expect(basicFormComponent).toBeVisible();
  });
});
