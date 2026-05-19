import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export type PopoverButton =
  | 'left'
  | 'top'
  | 'bottom'
  | 'right'
  | 'onClick'
  | 'onHover'
  | 'onHint'
  | 'tabs'
  | 'form'
  | 'card'
  | 'tabsComponent'
  | 'formComponent'
  | 'cardComponent';

export class PopoverPageComponent {
  readonly page: Page;
  readonly positionCard: Locator;
  readonly simpleCard: Locator;
  readonly templateCard: Locator;
  readonly componentCard: Locator;
  readonly debouncingCard: Locator;
  readonly buttons: Record<PopoverButton, Locator>;

  constructor(page: Page) {
    this.page = page;
    this.positionCard = page.getByTestId('popover-position-card');
    this.simpleCard = page.getByTestId('popover-simple-card');
    this.templateCard = page.getByTestId('popover-template-card');
    this.componentCard = page.getByTestId('popover-component-card');
    this.debouncingCard = page.getByTestId('popover-debouncing-card');
    this.buttons = {
      left: this.positionCard.getByTestId('popover-left-btn'),
      top: this.positionCard.getByTestId('popover-top-btn'),
      bottom: this.positionCard.getByTestId('popover-bottom-btn'),
      right: this.positionCard.getByTestId('popover-right-btn'),
      onClick: this.simpleCard.getByTestId('popover-on-click-btn'),
      onHover: this.simpleCard.getByTestId('popover-on-hover-btn'),
      onHint: this.simpleCard.getByTestId('popover-on-hint-btn'),
      tabs: this.templateCard.getByTestId('popover-tabs-btn'),
      form: this.templateCard.getByTestId('popover-form-btn'),
      card: this.templateCard.getByTestId('popover-card-btn'),
      tabsComponent: this.componentCard.getByTestId('popover-tabs-component-btn'),
      formComponent: this.componentCard.getByTestId('popover-form-component-btn'),
      cardComponent: this.componentCard.getByTestId('popover-card-component-btn'),
    };
  }

  async assertVisibility(visible = true) {
    const cards = [
      this.positionCard,
      this.simpleCard,
      this.templateCard,
      this.componentCard,
      this.debouncingCard,
    ];
    for (const card of cards) {
      if (visible) {
        await expect(card).toBeVisible();
      } else {
        await expect(card).not.toBeVisible();
      }
    }
  }

  async clickButton(button: PopoverButton) {
    await this.buttons[button].click();
  }

  async hoverButton(button: PopoverButton) {
    await this.buttons[button].hover();
  }
}
