import { test } from '../../fixtures/base_fixture';

test.describe('Form Layouts page', () => {
  test('user should be able to complete the basic form and submit it', async ({
    onApplicationURLs,
    onBasicForm,
  }) => {
    const testEmail = 'test@test.com';
    const testPassword = 'password';

    await test.step('Navigate to the form layouts page', async () => {
      await onApplicationURLs.navigateToFormsLayouts();
    });

    await test.step('Complete the basic form', async () => {
      await onBasicForm.assertVisibility(true);
      await onBasicForm.fillEmail(testEmail);
      await onBasicForm.fillPassword(testPassword);
    });

    await test.step("Check the 'Check me out' checkbox", async () => {
      await onBasicForm.toggleCheckMeOut();
    });

    await test.step('Submit the form', async () => {
      await onBasicForm.submit();
    });
  });

  test('user should be able to complete the grid form and submit it', async ({
    onApplicationURLs,
    onGridForm,
  }) => {
    const testEmail = 'test@test.com';
    const testPassword = 'password';

    await test.step('Navigate to the form layouts page', async () => {
      await onApplicationURLs.navigateToFormsLayouts();
    });

    await test.step('Complete the grid form', async () => {
      await onGridForm.assertVisibility(true);
      await onGridForm.fillEmail(testEmail);
      await onGridForm.fillPassword(testPassword);
      await onGridForm.selectOption('option1');
    });

    await test.step('Submit the form', async () => {
      await onGridForm.submit();
    });
  });

  test('user should be able to complete the inline form and submit it', async ({
    onApplicationURLs,
    onInlineForm,
  }) => {
    const testName = 'Jane Doe';
    const testEmail = 'test@test.com';

    await test.step('Navigate to the form layouts page', async () => {
      await onApplicationURLs.navigateToFormsLayouts();
    });

    await test.step('Complete the inline form', async () => {
      await onInlineForm.assertVisibility(true);
      await onInlineForm.fillName(testName);
      await onInlineForm.fillEmail(testEmail);
    });

    await test.step("Toggle the 'Remember me' checkbox", async () => {
      await onInlineForm.toggleRememberMe();
    });

    await test.step('Submit the form', async () => {
      await onInlineForm.submit();
    });
  });

  test('user should be able to complete the form without labels and submit it', async ({
    onApplicationURLs,
    onNoLabelsForm,
  }) => {
    await test.step('Navigate to the form layouts page', async () => {
      await onApplicationURLs.navigateToFormsLayouts();
    });

    await test.step('Complete the form without labels', async () => {
      await onNoLabelsForm.assertVisibility(true);
      await onNoLabelsForm.fillRecipients('jane@example.com');
      await onNoLabelsForm.fillSubject('Test subject');
      await onNoLabelsForm.fillMessage('Test message body');
    });

    await test.step('Submit the form', async () => {
      await onNoLabelsForm.submit();
    });
  });

  test('user should be able to complete the block form and submit it', async ({
    onApplicationURLs,
    onBlockForm,
  }) => {
    await test.step('Navigate to the form layouts page', async () => {
      await onApplicationURLs.navigateToFormsLayouts();
    });

    await test.step('Complete the block form', async () => {
      await onBlockForm.assertVisibility(true);
      await onBlockForm.fillFirstName('Jane');
      await onBlockForm.fillLastName('Doe');
      await onBlockForm.fillEmail('jane@example.com');
      await onBlockForm.fillWebsite('https://example.com');
    });

    await test.step('Submit the form', async () => {
      await onBlockForm.submit();
    });
  });

  test('user should be able to complete the horizontal form and submit it', async ({
    onApplicationURLs,
    onHorizontalForm,
  }) => {
    const testEmail = 'test@test.com';
    const testPassword = 'password';

    await test.step('Navigate to the form layouts page', async () => {
      await onApplicationURLs.navigateToFormsLayouts();
    });

    await test.step('Complete the horizontal form', async () => {
      await onHorizontalForm.assertVisibility(true);
      await onHorizontalForm.fillEmail(testEmail);
      await onHorizontalForm.fillPassword(testPassword);
    });

    await test.step("Toggle the 'Remember me' checkbox", async () => {
      await onHorizontalForm.toggleRememberMe();
    });

    await test.step('Submit the form', async () => {
      await onHorizontalForm.submit();
    });
  });
});
