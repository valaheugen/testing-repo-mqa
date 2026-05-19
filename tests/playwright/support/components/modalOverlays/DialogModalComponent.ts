import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export type DialogModalType = 'showcase' | 'template' | 'namePrompt';

export class DialogModalComponent {
  readonly page: Page;
  readonly showcaseDialog: Locator;
  readonly showcaseDismissBtn: Locator;
  readonly templateDialog: Locator;
  readonly templateDialogBody: Locator;
  readonly templateCloseBtn: Locator;
  readonly namePromptDialog: Locator;
  readonly namePromptInput: Locator;
  readonly namePromptCancelBtn: Locator;
  readonly namePromptSubmitBtn: Locator;
  readonly backdrop: Locator;

  constructor(page: Page) {
    this.page = page;
    this.showcaseDialog = page.getByTestId('showcase-dialog');
    this.showcaseDismissBtn = page.getByTestId('dismiss-showcase-dialog-btn');
    this.templateDialog = page.getByTestId('template-dialog');
    this.templateDialogBody = page.getByTestId('template-dialog-body');
    this.templateCloseBtn = page.getByTestId('close-template-dialog-btn');
    this.namePromptDialog = page.getByTestId('name-prompt-dialog');
    this.namePromptInput = page.getByTestId('name-prompt-input');
    this.namePromptCancelBtn = page.getByTestId('name-prompt-cancel-btn');
    this.namePromptSubmitBtn = page.getByTestId('name-prompt-submit-btn');
    this.backdrop = page.locator('.cdk-overlay-backdrop');
  }

  private dialogLocator(type: DialogModalType): Locator {
    return {
      showcase: this.showcaseDialog,
      template: this.templateDialog,
      namePrompt: this.namePromptDialog,
    }[type];
  }

  async assertVisible(type: DialogModalType) {
    await expect(this.dialogLocator(type)).toBeVisible();
  }

  async assertHidden(type: DialogModalType) {
    await expect(this.dialogLocator(type)).not.toBeVisible();
  }

  async assertBackdropVisible() {
    await expect(this.backdrop.first()).toBeVisible();
  }

  async assertBackdropHidden() {
    await expect(this.backdrop).toHaveCount(0);
  }

  async closeViaEsc() {
    await this.page.keyboard.press('Escape');
  }

  async clickBackdrop() {
    await this.backdrop.first().click({ position: { x: 5, y: 5 } });
  }

  async closeShowcase() {
    await this.showcaseDismissBtn.click();
  }

  async closeTemplate() {
    await this.templateCloseBtn.click();
  }

  async fillName(value: string) {
    await this.namePromptInput.fill(value);
  }

  async submitName() {
    await this.namePromptSubmitBtn.click();
  }

  async cancelName() {
    await this.namePromptCancelBtn.click();
  }
}
