import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export type DialogButton =
  | 'openDialogComponent'
  | 'openDialogTemplate'
  | 'openDialogBackdrop'
  | 'openDialogNoBackdrop'
  | 'openDialogEsc'
  | 'openDialogNoEsc'
  | 'openDialogBackdropClick'
  | 'openDialogNoBackdropClick'
  | 'enterName';

export class DialogPageComponent {
  readonly page: Page;
  readonly openDialogCard: Locator;
  readonly openWithoutBackdropCard: Locator;
  readonly openWithoutEscCloseCard: Locator;
  readonly openWithoutBackdropClickCard: Locator;
  readonly returnResultCard: Locator;
  readonly buttons: Record<DialogButton, Locator>;
  readonly namesList: Locator;
  readonly nameItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.openDialogCard = page.getByTestId('open-dialog-card');
    this.openWithoutBackdropCard = page.getByTestId('open-without-backdrop-card');
    this.openWithoutEscCloseCard = page.getByTestId('open-without-esc-close-card');
    this.openWithoutBackdropClickCard = page.getByTestId('open-without-backdrop-click-card');
    this.returnResultCard = page.getByTestId('return-result-from-dialog-card');
    this.buttons = {
      openDialogComponent: this.openDialogCard.getByTestId('open-dialog-component-btn'),
      openDialogTemplate: this.openDialogCard.getByTestId('open-dialog-template-btn'),
      openDialogBackdrop: this.openWithoutBackdropCard.getByTestId('open-dialog-backdrop-btn'),
      openDialogNoBackdrop: this.openWithoutBackdropCard.getByTestId('open-dialog-no-backdrop-btn'),
      openDialogEsc: this.openWithoutEscCloseCard.getByTestId('open-dialog-esc-btn'),
      openDialogNoEsc: this.openWithoutEscCloseCard.getByTestId('open-dialog-no-esc-btn'),
      openDialogBackdropClick: this.openWithoutBackdropClickCard.getByTestId('open-dialog-backdrop-click-btn'),
      openDialogNoBackdropClick: this.openWithoutBackdropClickCard.getByTestId('open-dialog-no-backdrop-click-btn'),
      enterName: this.returnResultCard.getByTestId('enter-name-btn'),
    };
    this.namesList = page.getByTestId('names-list');
    this.nameItems = page.getByTestId('name-item');
  }

  async assertVisibility(visible = true) {
    const cards = [
      this.openDialogCard,
      this.openWithoutBackdropCard,
      this.openWithoutEscCloseCard,
      this.openWithoutBackdropClickCard,
      this.returnResultCard,
    ];
    for (const card of cards) {
      if (visible) {
        await expect(card).toBeVisible();
      } else {
        await expect(card).not.toBeVisible();
      }
    }
  }

  async clickButton(button: DialogButton) {
    await this.buttons[button].click();
  }
}
