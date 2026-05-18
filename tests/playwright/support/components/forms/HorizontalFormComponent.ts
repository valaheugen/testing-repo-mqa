import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';
import { BaseFormComponent } from './BaseFormComponent';

export class HorizontalFormComponent extends BaseFormComponent {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    super(page, 'horizontal-form-card');
    this.emailInput = this.card.getByTestId('email-input');
    this.passwordInput = this.card.getByTestId('password-input');
    this.rememberMeCheckbox = this.card
      .getByTestId('remember-me-checkbox')
      .locator('input[type="checkbox"]');
  }

  async fillEmail(value: string) {
    await this.emailInput.fill(value);
  }

  async fillPassword(value: string) {
    await this.passwordInput.fill(value);
  }

  async toggleRememberMe() {
    await expect(this.rememberMeCheckbox).not.toBeChecked();
    await this.rememberMeCheckbox.check({ force: true });
    await expect(this.rememberMeCheckbox).toBeChecked();
  }
}
