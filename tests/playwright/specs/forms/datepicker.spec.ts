import { test, expect } from '../../fixtures/base_fixture';

const DATE_LIKE = /\S/;

test.describe('Forms - Datepicker page', () => {
  test('common datepicker: selecting a day populates the input', async ({
    onApplicationURLs,
    onDatepickerPage,
    onDatepickerOverlay,
  }) => {
    await test.step('Navigate to the datepicker page', async () => {
      await onApplicationURLs.navigateToDatepickerPage();
    });

    await test.step('Open the common datepicker and select today', async () => {
      await onDatepickerPage.openPicker('common');
      await onDatepickerOverlay.assertVisible();
      await onDatepickerOverlay.selectToday();
    });

    await test.step('Assert the input value is populated', async () => {
      const value = await onDatepickerPage.getInputValue('common');
      expect(value).toMatch(DATE_LIKE);
    });
  });

  test('range datepicker: selecting two days populates the input with a range', async ({
    onApplicationURLs,
    onDatepickerPage,
    onDatepickerOverlay,
  }) => {
    const today = new Date();
    const startDay = today.getDate();
    const endDay = Math.min(startDay + 2, 28);

    await test.step('Navigate to the datepicker page', async () => {
      await onApplicationURLs.navigateToDatepickerPage();
    });

    await test.step('Open range picker and select start day', async () => {
      await onDatepickerPage.openPicker('range');
      await onDatepickerOverlay.assertVisible();
      await onDatepickerOverlay.selectDayInCurrentMonth(startDay);
    });

    await test.step('Wait for range picker to settle, then select end day', async () => {
      await onDatepickerPage.page.waitForTimeout(300);
      await onDatepickerOverlay.selectDayInCurrentMonth(endDay);
      await onDatepickerPage.page.waitForTimeout(300);
    });

    await test.step('Assert the input value contains a range separator', async () => {
      const value = await onDatepickerPage.getInputValue('range');
      expect(value).toMatch(/-/);
      expect(value).toMatch(DATE_LIKE);
    });
  });

  test('min-max datepicker: selecting today (in range) populates the input', async ({
    onApplicationURLs,
    onDatepickerPage,
    onDatepickerOverlay,
  }) => {
    await test.step('Navigate to the datepicker page', async () => {
      await onApplicationURLs.navigateToDatepickerPage();
    });

    await test.step('Open min-max picker and select today', async () => {
      await onDatepickerPage.openPicker('minMax');
      await onDatepickerOverlay.assertVisible();
      await onDatepickerOverlay.selectToday();
    });

    await test.step('Assert the input value is populated', async () => {
      const value = await onDatepickerPage.getInputValue('minMax');
      expect(value).toMatch(DATE_LIKE);
    });
  });
});
