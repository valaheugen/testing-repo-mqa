import { Page } from 'playwright';
import { BasicFormComponent } from '../support/components/forms/BasicFormComponent';
import { UsingGridComponent } from '../support/components/forms/UsingGridComponent';
import { InlineFormComponent } from '../support/components/forms/InlineFormComponent';
import { NoLabelsFormComponent } from '../support/components/forms/NoLabelsFormComponent';
import { BlockFormComponent } from '../support/components/forms/BlockFormComponent';
import { HorizontalFormComponent } from '../support/components/forms/HorizontalFormComponent';
import { expect, test as base } from 'playwright/test';
import { ApplicationURLs } from '../support/components/main/applicationURLs';
import { HeaderComponent } from '../support/components/main/HeaderComponent';
import { WindowPageComponent } from '../support/components/modalOverlays/WindowPageComponent';
import { WindowModalComponent } from '../support/components/modalOverlays/WindowModalComponent';
import { DialogPageComponent } from '../support/components/modalOverlays/DialogPageComponent';
import { DialogModalComponent } from '../support/components/modalOverlays/DialogModalComponent';
import { PopoverPageComponent } from '../support/components/modalOverlays/PopoverPageComponent';
import { PopoverContentComponent } from '../support/components/modalOverlays/PopoverContentComponent';
import { TooltipPageComponent } from '../support/components/modalOverlays/TooltipPageComponent';
import { TooltipContentComponent } from '../support/components/modalOverlays/TooltipContentComponent';
import { ToastrPageComponent } from '../support/components/modalOverlays/ToastrPageComponent';
import { ToastComponent } from '../support/components/modalOverlays/ToastComponent';
import { SmartTablePageComponent } from '../support/components/tables/SmartTablePageComponent';
import { TreeGridPageComponent } from '../support/components/tables/TreeGridPageComponent';
import { DatepickerPageComponent } from '../support/components/forms/DatepickerPageComponent';
import { DatepickerOverlayComponent } from '../support/components/forms/DatepickerOverlayComponent';
import { CalendarPageComponent } from '../support/components/extraComponents/CalendarPageComponent';
import { EchartsPageComponent } from '../support/components/charts/EchartsPageComponent';
import { IotDashboardPageComponent } from '../support/components/dashboard/IotDashboardPageComponent';
import { LoginPageComponent } from '../support/components/auth/LoginPageComponent';
import { RegisterPageComponent } from '../support/components/auth/RegisterPageComponent';
import { RequestPasswordPageComponent } from '../support/components/auth/RequestPasswordPageComponent';
import { ResetPasswordPageComponent } from '../support/components/auth/ResetPasswordPageComponent';

type MyFixtures = {
  onBasicForm: BasicFormComponent;
  onGridForm: UsingGridComponent;
  onInlineForm: InlineFormComponent;
  onNoLabelsForm: NoLabelsFormComponent;
  onBlockForm: BlockFormComponent;
  onHorizontalForm: HorizontalFormComponent;
  onApplicationURLs: ApplicationURLs;
  onHeader: HeaderComponent;
  onWindowPage: WindowPageComponent;
  onWindowModal: WindowModalComponent;
  onDialogPage: DialogPageComponent;
  onDialogModal: DialogModalComponent;
  onPopoverPage: PopoverPageComponent;
  onPopoverContent: PopoverContentComponent;
  onTooltipPage: TooltipPageComponent;
  onTooltipContent: TooltipContentComponent;
  onToastrPage: ToastrPageComponent;
  onToast: ToastComponent;
  onSmartTablePage: SmartTablePageComponent;
  onTreeGridPage: TreeGridPageComponent;
  onDatepickerPage: DatepickerPageComponent;
  onDatepickerOverlay: DatepickerOverlayComponent;
  onCalendarPage: CalendarPageComponent;
  onEchartsPage: EchartsPageComponent;
  onIotDashboardPage: IotDashboardPageComponent;
  onLoginPage: LoginPageComponent;
  onRegisterPage: RegisterPageComponent;
  onRequestPasswordPage: RequestPasswordPageComponent;
  onResetPasswordPage: ResetPasswordPageComponent;
};

const createFixture = <T>(Component: new (page: Page) => T) => {
  return async ({ page }: { page: Page }, use: (fixture: T) => Promise<void>) => {
    await use(new Component(page));
  };
};

export const test = base.extend<MyFixtures>({
  onBasicForm: [createFixture(BasicFormComponent), { scope: 'test' }],
  onGridForm: [createFixture(UsingGridComponent), { scope: 'test' }],
  onInlineForm: [createFixture(InlineFormComponent), { scope: 'test' }],
  onNoLabelsForm: [createFixture(NoLabelsFormComponent), { scope: 'test' }],
  onBlockForm: [createFixture(BlockFormComponent), { scope: 'test' }],
  onHorizontalForm: [createFixture(HorizontalFormComponent), { scope: 'test' }],
  onApplicationURLs: [createFixture(ApplicationURLs), { scope: 'test' }],
  onHeader: [createFixture(HeaderComponent), { scope: 'test' }],
  onWindowPage: [createFixture(WindowPageComponent), { scope: 'test' }],
  onWindowModal: [createFixture(WindowModalComponent), { scope: 'test' }],
  onDialogPage: [createFixture(DialogPageComponent), { scope: 'test' }],
  onDialogModal: [createFixture(DialogModalComponent), { scope: 'test' }],
  onPopoverPage: [createFixture(PopoverPageComponent), { scope: 'test' }],
  onPopoverContent: [createFixture(PopoverContentComponent), { scope: 'test' }],
  onTooltipPage: [createFixture(TooltipPageComponent), { scope: 'test' }],
  onTooltipContent: [createFixture(TooltipContentComponent), { scope: 'test' }],
  onToastrPage: [createFixture(ToastrPageComponent), { scope: 'test' }],
  onToast: [createFixture(ToastComponent), { scope: 'test' }],
  onSmartTablePage: [createFixture(SmartTablePageComponent), { scope: 'test' }],
  onTreeGridPage: [createFixture(TreeGridPageComponent), { scope: 'test' }],
  onDatepickerPage: [createFixture(DatepickerPageComponent), { scope: 'test' }],
  onDatepickerOverlay: [createFixture(DatepickerOverlayComponent), { scope: 'test' }],
  onCalendarPage: [createFixture(CalendarPageComponent), { scope: 'test' }],
  onEchartsPage: [createFixture(EchartsPageComponent), { scope: 'test' }],
  onIotDashboardPage: [createFixture(IotDashboardPageComponent), { scope: 'test' }],
  onLoginPage: [createFixture(LoginPageComponent), { scope: 'test' }],
  onRegisterPage: [createFixture(RegisterPageComponent), { scope: 'test' }],
  onRequestPasswordPage: [createFixture(RequestPasswordPageComponent), { scope: 'test' }],
  onResetPasswordPage: [createFixture(ResetPasswordPageComponent), { scope: 'test' }],
});

export { expect };
