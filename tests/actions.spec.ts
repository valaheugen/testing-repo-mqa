import test, { expect, Locator, Page } from 'playwright/test';

async function checkboxes(page: Page) {
  return [
    page
      .locator('nb-card', { hasText: 'Inline form' })
      .getByRole('checkbox', { name: 'Remember me' }),
    page
      .locator('nb-card', { hasText: 'Basic Form' })
      .getByRole('checkbox', { name: 'Check me out' }),
    page
      .locator('nb-card', { hasText: 'Horizontal form' })
      .getByRole('checkbox', { name: 'Remember me' }),
  ];
}

async function checkAllCheckboxes(page: Page) {
  const allCheckboxes = await checkboxes(page);
  for (const checkbox of allCheckboxes) {
    await checkbox.check({ force: true });
    await expect(checkbox).toBeChecked();
  }
}

test.describe('Form Layouts page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
    await expect(page.getByTestId('initialSpinner')).toBeHidden();
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
  });

  test('fill - action', async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator('nb-card', { hasText: 'Using the Grid' })
      .getByRole('textbox', { name: 'Email' });

    // await expect(usingTheGridEmailInput).toBeVisible({ timeout: 20000 });
    await usingTheGridEmailInput.fill('test@test.com');

    //web-first assertion
    await expect(usingTheGridEmailInput).toHaveValue('test2@test.com');

    //generic assertion
    // const inputValue = await usingTheGridEmailInput.inputValue();
    // expect(inputValue).toEqual('test2@test.com');
  });

  test('clear - action', async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator('nb-card', { hasText: 'Using the Grid' })
      .getByRole('textbox', { name: 'Email' });

    await usingTheGridEmailInput.fill('test@test.com');
    await expect(usingTheGridEmailInput).toHaveValue('test@test.com');

    await usingTheGridEmailInput.clear();
    await expect(usingTheGridEmailInput).toHaveValue('');

    await usingTheGridEmailInput.fill('test3@test.com');
    await expect(usingTheGridEmailInput).toHaveValue('test3@test.com');
  });

  test('pressSequentially - action', async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator('nb-card', { hasText: 'Using the Grid' })
      .getByRole('textbox', { name: 'Email' });

    await usingTheGridEmailInput.pressSequentially('test@test.com', { delay: 200 });
    await expect(usingTheGridEmailInput).toHaveValue('test@test.com');
  });

  test('click - action', async ({ page }) => {
    const basicFormComponent = page.locator('nb-card', { hasText: 'Basic Form' });
    await expect(basicFormComponent).toBeVisible();

    const submitBasicFormButton = basicFormComponent.getByRole('button', { name: 'Submit' });
    const emailInput = basicFormComponent.getByRole('textbox', { name: 'Email' });
    const passwordInput = basicFormComponent.getByRole('textbox', { name: 'Password' });

    await test.step('fill the form', async () => {
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await emailInput.fill('test@test.com');
      await passwordInput.fill('password');
    });

    await test.step('click the submit button', async () => {
      await expect(submitBasicFormButton).toBeVisible();
      await submitBasicFormButton.click();
      await submitBasicFormButton.click({ button: 'right' });
      await submitBasicFormButton.click({ modifiers: ['Shift'] });
      await submitBasicFormButton.click({ clickCount: 6 });
      await submitBasicFormButton.click({ force: true });
      await submitBasicFormButton.click({ position: { x: 100, y: 100 } });
      await submitBasicFormButton.dblclick();
    });

    await test.step('focus, blur, hover - actions', async () => {
      await expect(submitBasicFormButton).toBeVisible();
      const emailInput = basicFormComponent.getByRole('textbox', { name: 'Email' });

      await emailInput.hover();

      await expect(emailInput).toBeVisible();
      await emailInput.focus();
      await expect(emailInput).toBeFocused();

      await expect(emailInput).toBeVisible();
      await emailInput.blur();
      await expect(emailInput).not.toBeFocused();
    });
  });

  test('reading state - action', async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator('nb-card', { hasText: 'Using the Grid' })
      .getByRole('textbox', { name: 'Email' });

    // web-first assertion
    const isVisible = await usingTheGridEmailInput.isVisible();
    expect(isVisible).toBeTruthy();

    // web-first assertion
    const isEnabled = await usingTheGridEmailInput.isEnabled();
    expect(isEnabled).toBeTruthy();

    if (isVisible) {
      //generic assertion
      await expect(usingTheGridEmailInput).toBeVisible();
    }

    if (isEnabled) {
      //generic assertion
      await expect(usingTheGridEmailInput).toBeEnabled();
    }
  });

  test('radio buttons - action', async ({ page }) => {
    const option1 = page
      .locator('nb-card', { hasText: 'Using the Grid' })
      .getByRole('radio', { name: 'Option 1' });

    const option2 = page
      .locator('nb-card', { hasText: 'Using the Grid' })
      .getByRole('radio', { name: 'Option 2' });

    const disabledOption = page
      .locator('nb-card', { hasText: 'Using the Grid' })
      .getByRole('radio', { name: 'Disabled Option' });

    await test.step('check both radios are unchecked', async () => {
      await expect(option1).not.toBeChecked();
      await expect(option2).not.toBeChecked();
    });

    await test.step('check option1', async () => {
      await option1.check({ force: true });
      await expect(option1).toBeChecked();
      await expect(option2).not.toBeChecked();
      await expect(disabledOption).toBeDisabled();
    });

    await test.step('check option2', async () => {
      await option2.check({ force: true });
      await expect(option1).not.toBeChecked();
      await expect(option2).toBeChecked();
      await expect(disabledOption).toBeDisabled();
    });

    await test.step('check option2', async () => {
      await option1.setChecked(true, { force: true });

      await expect(option2).not.toBeChecked();
      await expect(disabledOption).toBeDisabled();
    });
  });

  test('checkbox buttons - action', async ({ page }) => {
    const rememberMeCheckbox = page
      .locator('nb-card', { hasText: 'Inline form' })
      .getByRole('checkbox', { name: 'Remember me' });

    const basicFormComponent = page
      .locator('nb-card', { hasText: 'Basic Form' })
      .getByRole('checkbox', { name: 'Check me out' });

    const horizontalFormComponent = page
      .locator('nb-card', { hasText: 'Horizontal form' })
      .getByRole('checkbox', { name: 'Remember me' });

    await test.step('check both radios are unchecked', async () => {
      await expect(rememberMeCheckbox).not.toBeChecked();
    });

    await test.step('check remember me checkbox', async () => {
      await rememberMeCheckbox.check({ force: true });
      await expect(rememberMeCheckbox).toBeChecked();

      await basicFormComponent.check({ force: true });
      await expect(basicFormComponent).toBeChecked();

      await horizontalFormComponent.scrollIntoViewIfNeeded();
      await horizontalFormComponent.check({ force: true });
      await expect(horizontalFormComponent).toBeChecked();
    });

    // await test.step('uncheck remember me checkbox', async () => {
    //   await rememberMeCheckbox.setChecked(false, { force: true });
    //   //   await expect(rememberMeCheckbox).not.toBeChecked();
    // });
  });

  test('for loop for checkbox buttons - action', async ({ page }) => {
    // const rememberMeCheckbox = page
    //   .locator('nb-card', { hasText: 'Inline form' })
    //   .getByRole('checkbox', { name: 'Remember me' });

    // const basicFormComponent = page
    //   .locator('nb-card', { hasText: 'Basic Form' })
    //   .getByRole('checkbox', { name: 'Check me out' });

    // const horizontalFormComponent = page
    //   .locator('nb-card', { hasText: 'Horizontal form' })
    //   .getByRole('checkbox', { name: 'Remember me' });

    // const checkboxes2: Locator[] = [
    //   rememberMeCheckbox,
    //   basicFormComponent,
    //   horizontalFormComponent,
    // ];

    // for (const checkbox of checkboxes2) {
    //   await checkbox.check({ force: true });
    //   await expect(checkbox).toBeChecked();
    // }

    await checkAllCheckboxes(page);
  });

  test('press  - action', async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator('nb-card', { hasText: 'Using the Grid' })
      .getByRole('textbox', { name: 'Email' });

    await test.step('check both radios are unchecked', async () => {
      // await submitBasicFormButton.press('Enter');
      // await submitBasicFormButton.press('Space');
      // await submitBasicFormButton.press('Tab');
      // await submitBasicFormButton.press('ArrowDown');
      // await submitBasicFormButton.press('ArrowUp');
      // await submitBasicFormButton.press('ArrowLeft');
      // await submitBasicFormButton.press('ArrowRight');
      // await submitBasicFormButton.press('PageDown');
      // await submitBasicFormButton.press('PageUp');
      await usingTheGridEmailInput.fill('test2@test.com');
      await usingTheGridEmailInput.press('ControlOrMeta+A');
    });
  });
});
