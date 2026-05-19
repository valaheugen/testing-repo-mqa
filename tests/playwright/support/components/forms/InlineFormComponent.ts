import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';
import { BaseFormComponent } from './BaseFormComponent';

export class InlineFormComponent extends BaseFormComponent {
  readonly inlineNameInput: Locator;
  readonly inlineEmailInput: Locator;
  readonly inlineRememberMeCheckbox: Locator;

  constructor(page: Page) {
    super(page, 'inline-form-card');
    this.inlineNameInput = this.card.getByTestId('name-input');
    this.inlineEmailInput = this.card.getByTestId('email-input');
    this.inlineRememberMeCheckbox = this.card
      .getByTestId('remember-me-checkbox')
      .locator('input[type="checkbox"]');
  }

  async fillName(value: string) {
    await this.inlineNameInput.fill(value);
  }

  async fillEmail(value: string) {
    await this.inlineEmailInput.fill(value);
  }

  async toggleRememberMe() {
    await expect(this.inlineRememberMeCheckbox).not.toBeChecked();
    await this.inlineRememberMeCheckbox.check({ force: true });
    await expect(this.inlineRememberMeCheckbox).toBeChecked();
  }
}
