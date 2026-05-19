import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export class TooltipContentComponent {
  readonly page: Page;
  readonly tooltip: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tooltip = page.locator('nb-tooltip');
  }

  async assertVisible(expectedText = 'This is a tooltip') {
    await expect(this.tooltip).toBeVisible();
    await expect(this.tooltip).toContainText(expectedText);
  }

  async assertHidden() {
    await expect(this.tooltip).toHaveCount(0);
  }

  async assertEmpty() {
    await expect(this.tooltip).toBeAttached();
    await expect(this.tooltip).toHaveText('');
  }
}
