import { Page } from 'playwright';
import { BasicFormComponent } from '../forms/BasicFormComponent';
import { WindowPageComponent } from '../modalOverlays/WindowPageComponent';
import { DialogPageComponent } from '../modalOverlays/DialogPageComponent';
import { PopoverPageComponent } from '../modalOverlays/PopoverPageComponent';

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

  async navigateToDialogPage() {
    await this.page.goto('/pages/modal-overlays/dialog', { waitUntil: 'domcontentloaded' });

    const dialogPage = new DialogPageComponent(this.page);
    await dialogPage.assertVisibility(true);
  }

  async navigateToPopoverPage() {
    await this.page.goto('/pages/modal-overlays/popover', { waitUntil: 'domcontentloaded' });

    const popoverPage = new PopoverPageComponent(this.page);
    await popoverPage.assertVisibility(true);
  }
}
