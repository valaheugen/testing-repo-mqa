import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';
import { WindowModalComponent, WindowModalType } from './WindowModalComponent';

export type WindowButton =
  | 'openWindowForm'
  | 'openWindowTemplate'
  | 'openWindowBackdrop'
  | 'openWindowNoBackdrop';

export class WindowPageComponent {
  readonly page: Page;
  readonly windowFormCard: Locator;
  readonly windowNoBackdropCard: Locator;
  readonly buttons: Record<WindowButton, Locator>;

  private readonly modal: WindowModalComponent;
  private readonly buttonToModal: Record<WindowButton, WindowModalType> = {
    openWindowForm: 'form',
    openWindowTemplate: 'template',
    openWindowBackdrop: 'template',
    openWindowNoBackdrop: 'noBackdrop',
  };

  constructor(page: Page) {
    this.page = page;
    this.windowFormCard = page.getByTestId('window-form-card');
    this.windowNoBackdropCard = page.getByTestId('window-no-backdrop-card');
    this.buttons = {
      openWindowForm: this.windowFormCard.getByTestId('open-window-form-btn'),
      openWindowTemplate: this.windowFormCard.getByTestId('open-window-template-btn'),
      openWindowBackdrop: this.windowNoBackdropCard.getByTestId('open-window-backdrop-btn'),
      openWindowNoBackdrop: this.windowNoBackdropCard.getByTestId('open-window-no-backdrop-btn'),
    };
    this.modal = new WindowModalComponent(page);
  }

  async assertVisibility(visible = true) {
    if (visible) {
      await expect(this.windowFormCard).toBeVisible();
      await expect(this.windowNoBackdropCard).toBeVisible();
    } else {
      await expect(this.windowFormCard).not.toBeVisible();
      await expect(this.windowNoBackdropCard).not.toBeVisible();
    }
  }

  async clickOnButton(button: WindowButton) {
    await this.buttons[button].click();
    await this.modal.assertVisible(this.buttonToModal[button]);
  }
}
