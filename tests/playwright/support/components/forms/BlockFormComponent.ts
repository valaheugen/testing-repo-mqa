import { Locator, Page } from 'playwright';
import { BaseFormComponent } from './BaseFormComponent';

export class BlockFormComponent extends BaseFormComponent {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly websiteInput: Locator;

  constructor(page: Page) {
    super(page, 'block-form-card');
    this.firstNameInput = this.card.getByTestId('first-name-input');
    this.lastNameInput = this.card.getByTestId('last-name-input');
    this.emailInput = this.card.getByTestId('email-input');
    this.websiteInput = this.card.getByTestId('website-input');
  }

  async fillFirstName(value: string) {
    await this.firstNameInput.fill(value);
  }

  async fillLastName(value: string) {
    await this.lastNameInput.fill(value);
  }

  async fillEmail(value: string) {
    await this.emailInput.fill(value);
  }

  async fillWebsite(value: string) {
    await this.websiteInput.fill(value);
  }
}
