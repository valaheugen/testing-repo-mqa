import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export type TooltipButton =
  | 'home'
  | 'empty'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'default'
  | 'primary'
  | 'success'
  | 'danger'
  | 'info'
  | 'warning';

export class TooltipPageComponent {
  readonly page: Page;
  readonly iconCard: Locator;
  readonly placementCard: Locator;
  readonly coloredCard: Locator;
  readonly buttons: Record<TooltipButton, Locator>;

  constructor(page: Page) {
    this.page = page;
    this.iconCard = page.getByTestId('tooltip-icon-card');
    this.placementCard = page.getByTestId('tooltip-placement-card');
    this.coloredCard = page.getByTestId('tooltip-colored-card');
    this.buttons = {
      home: this.iconCard.getByTestId('tooltip-home-btn'),
      empty: this.iconCard.getByTestId('tooltip-empty-btn'),
      top: this.placementCard.getByTestId('tooltip-top-btn'),
      right: this.placementCard.getByTestId('tooltip-right-btn'),
      bottom: this.placementCard.getByTestId('tooltip-bottom-btn'),
      left: this.placementCard.getByTestId('tooltip-left-btn'),
      default: this.coloredCard.getByTestId('tooltip-default-btn'),
      primary: this.coloredCard.getByTestId('tooltip-primary-btn'),
      success: this.coloredCard.getByTestId('tooltip-success-btn'),
      danger: this.coloredCard.getByTestId('tooltip-danger-btn'),
      info: this.coloredCard.getByTestId('tooltip-info-btn'),
      warning: this.coloredCard.getByTestId('tooltip-warning-btn'),
    };
  }

  async assertVisibility(visible = true) {
    const cards = [this.iconCard, this.placementCard, this.coloredCard];
    for (const card of cards) {
      if (visible) {
        await expect(card).toBeVisible();
      } else {
        await expect(card).not.toBeVisible();
      }
    }
  }

  async hoverButton(button: TooltipButton) {
    await this.buttons[button].hover();
  }
}
