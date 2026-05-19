import { test, expect } from '../../fixtures/base_fixture';

test.describe('Tables - Smart Table page', () => {
  test('renders the seeded dataset (10 visible rows by default page size)', async ({
    onApplicationURLs,
    onSmartTablePage,
  }) => {
    await test.step('Navigate to the smart table page', async () => {
      await onApplicationURLs.navigateToSmartTablePage();
    });

    await test.step('Assert 10 rows visible on first page', async () => {
      await onSmartTablePage.assertRowCount(10);
    });
  });

  test('filtering by First Name reduces the visible rows', async ({
    onApplicationURLs,
    onSmartTablePage,
  }) => {
    await test.step('Navigate to the smart table page', async () => {
      await onApplicationURLs.navigateToSmartTablePage();
    });

    await test.step('Filter First Name = "Mark" (seed has 2 Marks)', async () => {
      await onSmartTablePage.filterBy('firstName', 'Mark');
    });

    await test.step('Assert matching rows remain and the values contain Mark', async () => {
      await onSmartTablePage.assertRowCount(2);
      expect(await onSmartTablePage.cellText(0, 'firstName')).toContain('Mark');
      expect(await onSmartTablePage.cellText(1, 'firstName')).toContain('Mark');
    });
  });

  test('adding a row inserts a new row at the top', async ({
    onApplicationURLs,
    onSmartTablePage,
  }) => {
    const newRow = {
      id: '999',
      firstName: 'Test',
      lastName: 'User',
      username: '@testuser',
      email: 'test@example.com',
      age: '30',
    };

    await test.step('Navigate to the smart table page', async () => {
      await onApplicationURLs.navigateToSmartTablePage();
    });

    await test.step('Start adding a row, fill, and confirm', async () => {
      await onSmartTablePage.startAddRow();
      await onSmartTablePage.fillAddInputs(newRow);
      await onSmartTablePage.confirmAdd();
    });

    await test.step('Assert new row appears at the top with the expected values', async () => {
      expect(await onSmartTablePage.cellText(0, 'firstName')).toContain('Test');
      expect(await onSmartTablePage.cellText(0, 'lastName')).toContain('User');
      expect(await onSmartTablePage.cellText(0, 'email')).toContain('test@example.com');
    });
  });

  test('editing a row persists the change', async ({
    onApplicationURLs,
    onSmartTablePage,
  }) => {
    const updatedFirstName = 'Updated';

    await test.step('Navigate to the smart table page', async () => {
      await onApplicationURLs.navigateToSmartTablePage();
    });

    await test.step('Edit the first row firstName cell and save', async () => {
      await onSmartTablePage.startEditRow(0);
      await onSmartTablePage.fillEditInputs(0, { firstName: updatedFirstName });
      await onSmartTablePage.confirmEdit();
    });

    await test.step('Assert the firstName cell shows the updated value', async () => {
      expect(await onSmartTablePage.cellText(0, 'firstName')).toContain(updatedFirstName);
    });
  });

  test('deleting a row removes it after accepting the confirm dialog', async ({
    onApplicationURLs,
    onSmartTablePage,
  }) => {
    await test.step('Navigate to the smart table page', async () => {
      await onApplicationURLs.navigateToSmartTablePage();
    });

    await test.step('Capture the first row firstName', async () => {
      // captured below for use after delete
    });

    const firstRowName = await onSmartTablePage.cellText(0, 'firstName');

    await test.step('Delete the first row (accept confirm)', async () => {
      await onSmartTablePage.deleteRow(0, true);
    });

    await test.step('Assert row count decreased and the new first row differs', async () => {
      await onSmartTablePage.assertRowCount(10);
      const newFirstRowName = await onSmartTablePage.cellText(0, 'firstName');
      expect(newFirstRowName).not.toBe(firstRowName);
    });
  });

  test('rejecting the delete confirm keeps the row', async ({
    onApplicationURLs,
    onSmartTablePage,
  }) => {
    await test.step('Navigate to the smart table page', async () => {
      await onApplicationURLs.navigateToSmartTablePage();
    });

    const firstRowName = await onSmartTablePage.cellText(0, 'firstName');

    await test.step('Click delete and dismiss the confirm dialog', async () => {
      await onSmartTablePage.deleteRow(0, false);
    });

    await test.step('Assert the row count and the first row are unchanged', async () => {
      await onSmartTablePage.assertRowCount(10);
      expect(await onSmartTablePage.cellText(0, 'firstName')).toBe(firstRowName);
    });
  });
});
