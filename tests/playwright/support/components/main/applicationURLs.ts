import { Page } from 'playwright';
import { BasicFormComponent } from '../forms/BasicFormComponent';
import { WindowPageComponent } from '../modalOverlays/WindowPageComponent';
import { DialogPageComponent } from '../modalOverlays/DialogPageComponent';
import { PopoverPageComponent } from '../modalOverlays/PopoverPageComponent';
import { TooltipPageComponent } from '../modalOverlays/TooltipPageComponent';
import { ToastrPageComponent } from '../modalOverlays/ToastrPageComponent';
import { SmartTablePageComponent } from '../tables/SmartTablePageComponent';
import { TreeGridPageComponent } from '../tables/TreeGridPageComponent';
import { DatepickerPageComponent } from '../forms/DatepickerPageComponent';
import { CalendarPageComponent } from '../extraComponents/CalendarPageComponent';

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

  async navigateToTooltipPage() {
    await this.page.goto('/pages/modal-overlays/tooltip', { waitUntil: 'domcontentloaded' });

    const tooltipPage = new TooltipPageComponent(this.page);
    await tooltipPage.assertVisibility(true);
  }

  async navigateToToastrPage() {
    await this.page.goto('/pages/modal-overlays/toastr', { waitUntil: 'domcontentloaded' });

    const toastrPage = new ToastrPageComponent(this.page);
    await toastrPage.assertVisibility(true);
  }

  async navigateToSmartTablePage() {
    await this.page.goto('/pages/tables/smart-table', { waitUntil: 'domcontentloaded' });

    const smartTablePage = new SmartTablePageComponent(this.page);
    await smartTablePage.assertVisibility(true);
  }

  async navigateToTreeGridPage() {
    await this.page.goto('/pages/tables/tree-grid', { waitUntil: 'domcontentloaded' });

    const treeGridPage = new TreeGridPageComponent(this.page);
    await treeGridPage.assertVisibility(true);
  }

  async navigateToDatepickerPage() {
    await this.page.goto('/pages/forms/datepicker', { waitUntil: 'domcontentloaded' });

    const datepickerPage = new DatepickerPageComponent(this.page);
    await datepickerPage.assertVisibility(true);
  }

  async navigateToCalendarPage() {
    await this.page.goto('/pages/extra-components/calendar', { waitUntil: 'domcontentloaded' });

    const calendarPage = new CalendarPageComponent(this.page);
    await calendarPage.assertVisibility(true);
  }
}
