import test, { expect } from 'playwright/test';

test.describe('Form Layouts page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
  });

  //ex1.
  test('getByRole-locator', async ({ page }) => {
  const blockFormCard = page.locator("nb-card", { hasText: "Block form" });

  await blockFormCard.getByLabel('First Name').fill('Ada');
  await blockFormCard.getByLabel('Last Name').fill('Lovelace');
  await blockFormCard.getByLabel('Website').fill('https://ada.dev');

  await expect(blockFormCard.getByLabel('First Name')).toHaveValue('Ada');
  await expect(blockFormCard.getByLabel('Last Name')).toHaveValue('Lovelace');
  await expect(blockFormCard.getByLabel('Website')).toHaveValue('https://ada.dev');
});


  });