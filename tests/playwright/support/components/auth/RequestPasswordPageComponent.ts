import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export class RequestPasswordPageComponent {
  readonly page: Page;
  readonly title: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly backToLoginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1#title');
    this.emailInput = page.locator('input#input-email[name="email"]');
    this.submitButton = page.getByRole('button', { name: 'Request password' });
    this.backToLoginLink = page.getByRole('link', { name: 'Back to Log In' });
  }

  async assertVisibility(visible = true) {
    if (visible) {
      await expect(this.title).toHaveText('Forgot Password');
      await expect(this.emailInput).toBeVisible();
      await expect(this.submitButton).toBeVisible();
    } else {
      await expect(this.title).not.toBeVisible();
    }
  }

  async fillEmail(value: string) {
    await this.emailInput.fill(value);
  }

  async assertSubmitEnabled() {
    await expect(this.submitButton).toBeEnabled();
  }
}
