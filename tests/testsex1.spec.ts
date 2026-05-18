import { test, expect } from '@playwright/test';

test.describe('Form Layouts page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:4200/');
      await page.getByText('Forms').click();
      await page.getByText('Form Layouts').click();
    });

    test('test1 getByLabel - locator', async ({ page }) => {
        const blockFormComponent = page.locator('nb-card', { hasText: 'Block form' });
        await expect(blockFormComponent).toBeVisible();
    
        const firstNameInput = blockFormComponent.getByLabel('First Name');
        await firstNameInput.fill('Ada');
    
        const lastNameInput = blockFormComponent.getByLabel('Last Name');
        await lastNameInput.fill('Lovelace');
    
        const websiteInput = blockFormComponent.getByLabel('Website');
        await websiteInput.fill('https://ada.dev');
    
        await expect(firstNameInput).toHaveValue('Ada');
        await expect(lastNameInput).toHaveValue('Lovelace');
        await expect(websiteInput).toHaveValue('https://ada.dev');
    });

test('test 2 - .filter({ has })', async ({ page }) => {
        const cardWithTextarea = page.locator('nb-card').filter({
            has: page.locator('textarea')
        });
        await expect(cardWithTextarea).toHaveCount(1);
        await expect(cardWithTextarea.locator('nb-card-header')).toHaveText('Form without labels');
    });
test('test 3 — Strict mode + counting + indexing', async ({ page }) => {
        const emailInputs = page.locator('input[type="email"]');
        await expect(emailInputs).toHaveCount(4);

    const firstEmail = emailInputs.first();
    await firstEmail.fill('first@email.com');
    const lastEmail = emailInputs.last();
    await lastEmail.fill('last@email.com');

        await expect(firstEmail).toHaveValue('first@email.com');
        await expect(lastEmail).toHaveValue('last@email.com');

    await expect(firstEmail).toBeVisible();
    await expect(lastEmail).toBeVisible();
    });
});
