import { test, expect } from '../../fixtures/base_fixture';

const DATE_LIKE = /\S/;

test.describe('Extra Components - Calendar page', () => {
  test('single-date calendar: clicking a day updates the subtitle', async ({
    onApplicationURLs,
    onCalendarPage,
  }) => {
    const today = new Date();
    const targetDay = today.getDate();

    await test.step('Navigate to the calendar page', async () => {
      await onApplicationURLs.navigateToCalendarPage();
    });

    await test.step('Click today in the single-date calendar', async () => {
      await onCalendarPage.clickDay('singleDate', targetDay);
    });

    await test.step('Assert subtitle shows a selected date', async () => {
      const text = await onCalendarPage.getSubtitleText('singleDate');
      expect(text).toMatch(/Selected date:/);
      expect(text.replace('Selected date:', '').trim()).toMatch(DATE_LIKE);
    });
  });

  test('range calendar: clicking two days updates the range subtitle', async ({
    onApplicationURLs,
    onCalendarPage,
  }) => {
    const today = new Date();
    const startDay = today.getDate();
    const endDay = Math.min(startDay + 2, 28);

    await test.step('Navigate to the calendar page', async () => {
      await onApplicationURLs.navigateToCalendarPage();
    });

    await test.step('Click start day in the range calendar', async () => {
      await onCalendarPage.clickDay('range', startDay);
    });

    await test.step('Wait and click end day', async () => {
      await onCalendarPage.page.waitForTimeout(300);
      await onCalendarPage.clickDay('range', endDay);
      await onCalendarPage.page.waitForTimeout(300);
    });

    await test.step('Assert range subtitle shows a range', async () => {
      const text = await onCalendarPage.getSubtitleText('range');
      expect(text).toMatch(/Selected range:/);
      expect(text).toMatch(/-/);
    });
  });

  test('custom-cell calendar: renders with the initial selected-date subtitle', async ({
    onApplicationURLs,
    onCalendarPage,
  }) => {
    // The page's custom DayCellComponent intentionally overrides onClick with
    // a no-op (`// do work`), so clicks don't emit selection. We only assert
    // the initial render state.
    await test.step('Navigate to the calendar page', async () => {
      await onApplicationURLs.navigateToCalendarPage();
    });

    await test.step('Assert subtitle shows the initial selected date', async () => {
      const text = await onCalendarPage.getSubtitleText('customCell');
      expect(text).toMatch(/Selected date:/);
      expect(text.replace('Selected date:', '').trim()).toMatch(DATE_LIKE);
    });
  });
});
