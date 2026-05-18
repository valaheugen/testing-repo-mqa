import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export type ToastStatus = 'primary' | 'success' | 'info' | 'warning' | 'danger';

export class ToastComponent {
  readonly page: Page;
  readonly toasts: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toasts = page.locator('nb-toast');
  }

  toast(index = 0): Locator {
    return this.toasts.nth(index);
  }

  async assertVisible(opts: { title?: string; content?: string; status?: ToastStatus } = {}) {
    const t = this.toast(0);
    await expect(t).toBeVisible();
    if (opts.title) await expect(t).toContainText(opts.title);
    if (opts.content) await expect(t).toContainText(opts.content);
    if (opts.status) await expect(t).toHaveClass(new RegExp(`status-${opts.status}`));
  }

  async assertCount(count: number) {
    await expect(this.toasts).toHaveCount(count);
  }

  async clickFirstToast() {
    await this.toast(0).click();
  }

  async waitUntilHidden() {
    await expect(this.toasts).toHaveCount(0, { timeout: 10000 });
  }
}
