import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';
import { BaseFormComponent } from '../forms/BaseFormComponent';
import { ToastStatus } from './ToastComponent';

export type ToastrCheckbox = 'hideOnClick' | 'preventDuplicates' | 'hasIcon';

export class ToastrPageComponent extends BaseFormComponent {
  readonly positionSelect: Locator;
  readonly typeSelect: Locator;
  readonly titleInput: Locator;
  readonly contentInput: Locator;
  readonly durationInput: Locator;
  readonly showToastBtn: Locator;
  readonly randomToastBtn: Locator;
  readonly checkboxes: Record<ToastrCheckbox, Locator>;

  constructor(page: Page) {
    super(page, 'toastr-config-card');
    this.positionSelect = this.card.getByTestId('toastr-position-select');
    this.typeSelect = this.card.getByTestId('toastr-type-select');
    this.titleInput = this.card.getByTestId('toastr-title-input');
    this.contentInput = this.card.getByTestId('toastr-content-input');
    this.durationInput = this.card.getByTestId('toastr-duration-input');
    this.showToastBtn = this.card.getByTestId('show-toast-btn');
    this.randomToastBtn = this.card.getByTestId('random-toast-btn');
    this.checkboxes = {
      hideOnClick: this.card.getByTestId('hide-on-click-checkbox').locator('input[type="checkbox"]'),
      preventDuplicates: this.card.getByTestId('prevent-duplicates-checkbox').locator('input[type="checkbox"]'),
      hasIcon: this.card.getByTestId('has-icon-checkbox').locator('input[type="checkbox"]'),
    };
  }

  async fillTitle(value: string) {
    await this.titleInput.fill(value);
  }

  async fillContent(value: string) {
    await this.contentInput.fill(value);
  }

  async setDuration(ms: number) {
    await this.durationInput.fill(String(ms));
  }

  async selectType(status: ToastStatus) {
    await this.typeSelect.click();
    await this.page.getByTestId(`type-option-${status}`).click();
  }

  async selectPosition(position: string) {
    await this.positionSelect.click();
    await this.page.getByTestId(`position-option-${position}`).click();
  }

  async setCheckbox(name: ToastrCheckbox, checked: boolean) {
    const cb = this.checkboxes[name];
    if (checked) {
      await cb.check({ force: true });
      await expect(cb).toBeChecked();
    } else {
      await cb.uncheck({ force: true });
      await expect(cb).not.toBeChecked();
    }
  }

  async showToast() {
    await this.showToastBtn.click();
  }

  async showRandomToast() {
    await this.randomToastBtn.click();
  }
}
