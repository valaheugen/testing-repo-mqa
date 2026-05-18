import { Page } from 'playwright';
import { BasicFormComponent } from '../forms/BasicFormComponent';
import { WindowPageComponent } from '../modalOverlays/WindowPageComponent';

export class ApplicationURLs {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToFormsLayouts() {
    await this.page.goto('/pages/forms/layouts', { waitUntil: 'domcontentloaded' });

    const basicForm = new BasicFormComponent(this.page);
    await basicForm.assertVisibility(true);
  }

  async navigateToWindowPage() {
    await this.page.goto('/pages/modal-overlays/window', { waitUntil: 'domcontentloaded' });

    const windowPage = new WindowPageComponent(this.page);
    await windowPage.assertVisibility(true);
  }
}
