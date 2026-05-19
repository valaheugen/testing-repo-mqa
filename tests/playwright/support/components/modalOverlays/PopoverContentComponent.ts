import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export type PopoverContentType = 'text' | 'tabs' | 'form' | 'card';

export class PopoverContentComponent {
  readonly page: Page;
  readonly popover: Locator;
  readonly tabsContent: Locator;
  readonly formContent: Locator;
  readonly cardContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.popover = page.locator('nb-popover');
    this.tabsContent = page.getByTestId('popover-tabs-content');
    this.formContent = page.getByTestId('popover-form-content');
    this.cardContent = page.getByTestId('popover-card-content');
  }

  async assertVisible(type: PopoverContentType, expectedText?: string) {
    await expect(this.popover).toBeVisible();
    if (type === 'text' && expectedText) {
      await expect(this.popover).toContainText(expectedText);
    } else if (type === 'tabs') {
      await expect(this.tabsContent).toBeVisible();
    } else if (type === 'form') {
      await expect(this.formContent).toBeVisible();
    } else if (type === 'card') {
      await expect(this.cardContent).toBeVisible();
      await expect(this.cardContent).toContainText('Hello!');
    }
  }

  async assertHidden() {
    await expect(this.popover).toHaveCount(0);
  }
}
