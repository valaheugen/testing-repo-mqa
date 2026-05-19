import { Locator, Page } from 'playwright';
import { BaseFormComponent } from './BaseFormComponent';
import { expect } from 'playwright/test';

export type GridRadioOptions = 'option1' | 'option2' | 'disabledOption';

export class UsingGridComponent extends BaseFormComponent {
  readonly usingGridEmailInput: Locator;
  readonly usingGridPasswordInput: Locator;
  readonly getOptionRadio: (key: GridRadioOptions) => Locator;

  constructor(page: Page) {
    super(page, 'grid-form-card');
    this.usingGridEmailInput = this.card.getByTestId('email-input');
    this.usingGridPasswordInput = this.card.getByTestId('password-input');

    this.getOptionRadio = (key) =>
      this.card.getByTestId(`${key}-radio`).locator('input[type="radio"]');
  }

  async fillEmail(value: string) {
    await this.usingGridEmailInput.fill(value);
  }

  async fillPassword(value: string) {
    await this.usingGridPasswordInput.fill(value);
  }

  async selectOption(key: GridRadioOptions) {
    const radio = this.getOptionRadio(key);

    await expect(radio).not.toBeChecked();
    await radio.check({ force: true });
    await expect(radio).toBeChecked();
  }
}
