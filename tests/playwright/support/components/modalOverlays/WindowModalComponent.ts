import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export type WindowModalType = 'form' | 'template' | 'noBackdrop';

export class WindowModalComponent {
  readonly page: Page;
  readonly formModal: Locator;
  readonly templateModalText: Locator;
  readonly noBackdropModalText: Locator;
  readonly subjectInput: Locator;
  readonly textInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formModal = page.getByTestId('window-form-modal');
    this.templateModalText = page.getByTestId('template-modal-text');
    this.noBackdropModalText = page.getByTestId('no-backdrop-modal-text');
    this.subjectInput = page.getByTestId('window-form-subject-input');
    this.textInput = page.getByTestId('window-form-text-input');
  }

  async assertVisible(type: WindowModalType) {
    const target = {
      form: this.formModal,
      template: this.templateModalText,
      noBackdrop: this.noBackdropModalText,
    }[type];
    await expect(target).toBeVisible();
  }
}
