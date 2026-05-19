import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export class RegisterPageComponent {
  readonly page: Page;
  readonly title: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly submitButton: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1#title');
    this.fullNameInput = page.locator('input#input-name[name="fullName"]');
    this.emailInput = page.locator('input#input-email[name="email"]');
    this.passwordInput = page.locator('input#input-password[name="password"]');
    this.confirmPasswordInput = page.locator('input#input-re-password[name="rePass"]');
    this.termsCheckbox = page
      .locator('nb-checkbox[name="terms"]')
      .locator('input[type="checkbox"]');
    this.submitButton = page.getByRole('button', { name: 'Register' });
    this.loginLink = page.getByRole('link', { name: 'Log in' });
  }

  async assertVisibility(visible = true) {
    if (visible) {
      await expect(this.title).toHaveText('Register');
      await expect(this.fullNameInput).toBeVisible();
      await expect(this.emailInput).toBeVisible();
      await expect(this.passwordInput).toBeVisible();
      await expect(this.confirmPasswordInput).toBeVisible();
      await expect(this.submitButton).toBeVisible();
    } else {
      await expect(this.title).not.toBeVisible();
    }
  }

  async fillFullName(value: string) {
    await this.fullNameInput.fill(value);
  }

  async fillEmail(value: string) {
    await this.emailInput.fill(value);
  }

  async fillPassword(value: string) {
    await this.passwordInput.fill(value);
  }

  async fillConfirmPassword(value: string) {
    await this.confirmPasswordInput.fill(value);
  }

  async acceptTerms() {
    if (await this.termsCheckbox.count()) {
      await expect(this.termsCheckbox).not.toBeChecked();
      await this.termsCheckbox.check({ force: true });
      await expect(this.termsCheckbox).toBeChecked();
    }
  }

  async assertSubmitEnabled() {
    await expect(this.submitButton).toBeEnabled();
  }
}
