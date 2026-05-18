import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export type EchartsCard =
  | 'pie'
  | 'bar'
  | 'line'
  | 'multipleXaxis'
  | 'areaStack'
  | 'barAnimation'
  | 'radar';

const TESTIDS: Record<EchartsCard, string> = {
  pie: 'pie-chart-card',
  bar: 'bar-chart-card',
  line: 'line-chart-card',
  multipleXaxis: 'multiple-xaxis-chart-card',
  areaStack: 'area-stack-chart-card',
  barAnimation: 'bar-animation-chart-card',
  radar: 'radar-chart-card',
};

export class EchartsPageComponent {
  readonly page: Page;
  readonly cards: Record<EchartsCard, Locator>;

  constructor(page: Page) {
    this.page = page;
    this.cards = Object.fromEntries(
      Object.entries(TESTIDS).map(([key, testid]) => [key, page.getByTestId(testid)]),
    ) as Record<EchartsCard, Locator>;
  }

  async assertVisibility(visible = true) {
    for (const card of Object.values(this.cards)) {
      if (visible) await expect(card).toBeVisible();
      else await expect(card).not.toBeVisible();
    }
  }
}
