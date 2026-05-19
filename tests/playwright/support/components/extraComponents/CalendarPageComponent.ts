import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export type CalendarSection = 'singleDate' | 'range' | 'customCell';

export class CalendarPageComponent {
  readonly page: Page;
  readonly singleDateContainer: Locator;
  readonly singleDateSubtitle: Locator;
  readonly rangeContainer: Locator;
  readonly rangeSubtitle: Locator;
  readonly customCellContainer: Locator;
  readonly customCellSubtitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.singleDateContainer = page.getByTestId('single-date-calendar-container');
    this.singleDateSubtitle = page.getByTestId('single-date-subtitle');
    this.rangeContainer = page.getByTestId('range-calendar-container');
    this.rangeSubtitle = page.getByTestId('range-subtitle');
    this.customCellContainer = page.getByTestId('custom-cell-calendar-container');
    this.customCellSubtitle = page.getByTestId('custom-cell-subtitle');
  }

  private container(section: CalendarSection): Locator {
    return {
      singleDate: this.singleDateContainer,
      range: this.rangeContainer,
      customCell: this.customCellContainer,
    }[section];
  }

  private subtitle(section: CalendarSection): Locator {
    return {
      singleDate: this.singleDateSubtitle,
      range: this.rangeSubtitle,
      customCell: this.customCellSubtitle,
    }[section];
  }

  async assertVisibility(visible = true) {
    for (const c of [this.singleDateContainer, this.rangeContainer, this.customCellContainer]) {
      if (visible) await expect(c).toBeVisible();
      else await expect(c).not.toBeVisible();
    }
  }

  inMonthDayCell(section: CalendarSection, dayNumber: number): Locator {
    return this.container(section)
      .locator('.day-cell:not(.empty):not(.bounding-month)')
      .filter({ hasText: new RegExp(`^\\s*${dayNumber}\\s*$`) })
      .first();
  }

  async clickDay(section: CalendarSection, dayNumber: number) {
    await this.inMonthDayCell(section, dayNumber).click();
  }

  async getSubtitleText(section: CalendarSection): Promise<string> {
    return (await this.subtitle(section).innerText()).trim();
  }
}
