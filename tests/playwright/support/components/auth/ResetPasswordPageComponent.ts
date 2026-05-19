import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export class ResetPasswordPageComponent {
  readonly page: Page;
  readonly title: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly backToLoginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1#title');
    this.passwordInput = page.locator('input#input-password[name="password"]');
    this.confirmPasswordInput = page.locator('input#input-re-password[name="rePass"]');
    this.submitButton = page.getByRole('button', { name: 'Change password' });
    this.backToLoginLink = page.getByRole('link', { name: 'Back to Log In' });
  }

  async assertVisibility(visible = true) {
    if (visible) {
      await expect(this.title).toHaveText('Change password');
      await expect(this.passwordInput).toBeVisible();
      await expect(this.confirmPasswordInput).toBeVisible();
      await expect(this.submitButton).toBeVisible();
    } else {
      await expect(this.title).not.toBeVisible();
    }
  }

  async fillPassword(value: string) {
    await this.passwordInput.fill(value);
  }

  async fillConfirmPassword(value: string) {
    await this.confirmPasswordInput.fill(value);
  }

  async assertSubmitEnabled() {
    await expect(this.submitButton).toBeEnabled();
  }
}
