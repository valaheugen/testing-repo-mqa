import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export type IotDashboardWidget =
  | 'statusCards'
  | 'temperature'
  | 'electricity'
  | 'rooms'
  | 'contacts'
  | 'solar'
  | 'kitten'
  | 'traffic'
  | 'weather'
  | 'securityCameras';

const TESTIDS: Record<IotDashboardWidget, string> = {
  statusCards: 'status-cards-row',
  temperature: 'temperature-widget',
  electricity: 'electricity-widget',
  rooms: 'rooms-widget',
  contacts: 'contacts-widget',
  solar: 'solar-widget',
  kitten: 'kitten-widget',
  traffic: 'traffic-widget',
  weather: 'weather-widget',
  securityCameras: 'security-cameras-widget',
};

export class IotDashboardPageComponent {
  readonly page: Page;
  readonly widgets: Record<IotDashboardWidget, Locator>;

  constructor(page: Page) {
    this.page = page;
    this.widgets = Object.fromEntries(
      Object.entries(TESTIDS).map(([key, testid]) => [key, page.getByTestId(testid)]),
    ) as Record<IotDashboardWidget, Locator>;
  }

  async assertVisibility(visible = true) {
    for (const widget of Object.values(this.widgets)) {
      if (visible) await expect(widget).toBeVisible();
      else await expect(widget).not.toBeVisible();
    }
  }
}
