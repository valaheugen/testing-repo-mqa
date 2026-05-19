import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export abstract class BaseFormComponent {
  readonly page: Page;

  readonly card: Locator;

  readonly submitButton: Locator;

  protected constructor(page: Page, cardTestId: string) {
    this.page = page;
    this.card = this.page.getByTestId(cardTestId);
    this.submitButton = this.card.getByTestId('submit-button');
  }

  async assertVisibility(visibility = true) {
    if (visibility) {
      await expect(this.card).toBeVisible();
    } else {
      await expect(this.card).not.toBeVisible();
    }
  }

  async submit() {
    await this.submitButton.click();
  }
}
