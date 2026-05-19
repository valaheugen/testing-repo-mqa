import { Locator, Page } from 'playwright';
import { BaseFormComponent } from './BaseFormComponent';
import { expect } from 'playwright/test';

export class BasicFormComponent extends BaseFormComponent {
  readonly basicEmailInput: Locator;
  readonly basicPasswordInput: Locator;
  readonly basicCheckMeOut: Locator;

  constructor(page: Page) {
    super(page, 'basic-form-card');
    this.basicEmailInput = this.card.getByTestId('email-input');
    this.basicPasswordInput = this.card.getByTestId('password-input');
    this.basicCheckMeOut = this.card
      .getByTestId('check-me-out-checkbox')
      .locator('input[type="checkbox"]');
  }

  async fillEmail(value: string) {
    await this.basicEmailInput.fill(value);
  }

  async fillPassword(value: string) {
    await this.basicPasswordInput.fill(value);
  }

  async toggleCheckMeOut() {
    await expect(this.basicCheckMeOut).not.toBeChecked();
    await this.basicCheckMeOut.check({ force: true });
    await expect(this.basicCheckMeOut).toBeChecked();
  }

  async unToggleCheckMeOut() {
    await expect(this.basicCheckMeOut).toBeChecked();
    await this.basicCheckMeOut.uncheck({ force: true });
    await expect(this.basicCheckMeOut).not.toBeChecked();
  }
}
