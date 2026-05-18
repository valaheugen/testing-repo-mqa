import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export type DatepickerCard = 'common' | 'range' | 'minMax';

export class DatepickerPageComponent {
  readonly page: Page;
  readonly commonCard: Locator;
  readonly rangeCard: Locator;
  readonly minMaxCard: Locator;
  readonly inputs: Record<DatepickerCard, Locator>;

  constructor(page: Page) {
    this.page = page;
    this.commonCard = page.getByTestId('common-datepicker-card');
    this.rangeCard = page.getByTestId('range-datepicker-card');
    this.minMaxCard = page.getByTestId('min-max-datepicker-card');
    this.inputs = {
      common: this.commonCard.getByTestId('common-datepicker-input'),
      range: this.rangeCard.getByTestId('range-datepicker-input'),
      minMax: this.minMaxCard.getByTestId('min-max-datepicker-input'),
    };
  }

  async assertVisibility(visible = true) {
    for (const card of [this.commonCard, this.rangeCard, this.minMaxCard]) {
      if (visible) {
        await expect(card).toBeVisible();
      } else {
        await expect(card).not.toBeVisible();
      }
    }
  }

  async openPicker(card: DatepickerCard) {
    await this.inputs[card].click();
  }

  async getInputValue(card: DatepickerCard): Promise<string> {
    return (await this.inputs[card].inputValue()) ?? '';
  }
}
