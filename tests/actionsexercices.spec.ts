import test, { expect } from 'playwright/test';
test.describe('Form Layouts page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByText('Forms').click();
      await page.getByText('Form Layouts').click();
    });

    test('pressSequentially + keyboard + getAttribute', async ({ page }) => {
      const emailInput = page
        .locator('nb-card', { hasText: 'Basic form' })
        .getByRole('textbox', { name: 'Email' });
          
      await emailInput.pressSequentially('john@test.com', { delay: 50 });
      await emailInput.press('Tab');
      await expect(emailInput).not.toBeFocused();
  
      const typeAttribute = await emailInput.getAttribute('type');
      expect(typeAttribute).toBe('email');
      
      await expect(emailInput).toHaveValue('john@test.com');
      await expect(emailInput).not.toBeFocused();
    });

    test('Radio group exclusivity (with Nebular force gotcha)', async ({ page }) => {
      const usingGridCard = page.locator('nb-card', { hasText: 'Using the Grid' });
  
      const option1Radio = usingGridCard.getByRole('radio', { name: 'Option 1' });
      const option2Radio = usingGridCard.getByRole('radio', { name: 'Option 2' });
      const disabledRadio = usingGridCard.getByRole('radio', { name: 'Disabled Option' });
  
      await expect(option1Radio).not.toBeChecked();
      await expect(option2Radio).not.toBeChecked();
      await expect(disabledRadio).toBeChecked();
  
      await option1Radio.check({ force: true });
      await expect(option1Radio).toBeChecked();

      await option2Radio.check({ force: true });
      
      await expect(option2Radio).toBeChecked();
      await expect(option1Radio).not.toBeChecked();
  
      await expect(disabledRadio).not.toBeChecked(); 
      await expect(disabledRadio).toBeDisabled();     
    });

    test('Multi-checkbox flip with setChecked', async ({ page }) => {
      const checkboxes = [
        page.locator('nb-card', { hasText: 'Inline form' }).getByRole('checkbox', { name: 'Remember me' }),
        page.locator('nb-card', { hasText: 'Basic Form' }).getByRole('checkbox', { name: 'Check me out' }),
        page.locator('nb-card', { hasText: 'Horizontal form' }).getByRole('checkbox', { name: 'Remember me' })
      ];
    
      for (const checkbox of checkboxes) {
        await checkbox.setChecked(true, { force: true });
        await expect(checkbox).toBeChecked();
      }
    
      await checkboxes[1].setChecked(false, { force: true });
      
      await expect(checkboxes[0]).toBeChecked();
      await expect(checkboxes[1]).not.toBeChecked();
      await expect(checkboxes[2]).toBeChecked();
    
      for (const checkbox of checkboxes) {
        await checkbox.dispatchEvent('click');
      }
    
      await expect(checkboxes[0]).not.toBeChecked();
      await expect(checkboxes[1]).toBeChecked();
      await expect(checkboxes[2]).not.toBeChecked();
    });

test.describe('Window page', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('http://localhost:4200/');
    
    const menuCategory = page.getByText('Modal & Overlays', { exact: false });
    
    await menuCategory.scrollIntoViewIfNeeded();
    await menuCategory.click();
    
    await page.getByText('Window').click();
  });

  test('Interacțiune cu Open Window Form', async ({ page }) => {
    const openFormButton = page.getByRole('button', { name: 'Open Window Form' });
    const windowContainer = page.locator('nb-window');
    
    const closeWindowButton = windowContainer.locator('button nb-icon[icon="close-outline"]').locator('..');

    await openFormButton.click();

    await expect(windowContainer).toBeVisible();
    await expect(windowContainer).toContainText('Subject');

    await closeWindowButton.click();

    await expect(windowContainer).not.toBeVisible();
  });
});

  test('Interacțiune cu Open Window with template', async ({ page }) => {
    const openTemplateButton = page.getByRole('button', { name: 'Open Window with template' });
    const windowContainer = page.locator('nb-window');
    const closeWindowButton = windowContainer.locator('button nb-icon[icon="close-outline"]').locator('..');

    await openTemplateButton.click();

    await expect(windowContainer).toBeVisible();
    await expect(windowContainer).toContainText('some text to pass into template');

    await closeWindowButton.click();

    await expect(windowContainer).not.toBeVisible();
  });
}); 