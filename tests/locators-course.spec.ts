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

//ex2.
test('filter card which has textarea', async ({ page }) => {
  const targetCard = page.locator("nb-card").filter({ 
    has: page.locator('textarea') 
  });
  await expect(targetCard).toHaveCount(1);
  await expect(targetCard.locator('nb-card-header')).toHaveText("Form without labels");
});

//ex.3
test('multiple email inputs', async ({page}) =>{
  const emailInputs = page.locator("input[type=\"email\"]");
  await expect(emailInputs).toHaveCount(4);

  const firstEmailInput = emailInputs.first();
  await firstEmailInput.fill('first@email.com');
  await expect(firstEmailInput).toHaveValue('first@email.com');

  const lastEmailInput = emailInputs.last();
  await lastEmailInput.fill('last@email.com');
  await expect(lastEmailInput).toHaveValue('last@email.com');

})
});