import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export class DatepickerOverlayComponent {
  readonly page: Page;
  readonly calendar: Locator;
  readonly dayCells: Locator;
  readonly todayCell: Locator;

  constructor(page: Page) {
    this.page = page;
    this.calendar = page.locator('nb-card.picker').first();
    this.dayCells = page.locator('.day-cell:not(.empty):not(.bounding-month)');
    this.todayCell = page.locator('.day-cell.today').first();
  }

  async assertVisible() {
    await expect(this.dayCells.first()).toBeVisible();
  }

  inMonthDayCell(dayNumber: number): Locator {
    return this.dayCells.filter({ hasText: new RegExp(`^\\s*${dayNumber}\\s*$`) }).first();
  }

  async selectDayInCurrentMonth(dayNumber: number) {
    await this.inMonthDayCell(dayNumber).click();
  }

  async selectToday() {
    await this.todayCell.click();
  }
}
