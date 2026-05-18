import { Page } from 'playwright';
import { BasicFormComponent } from '../support/components/forms/BasicFormComponent';
import { UsingGridComponent } from '../support/components/forms/UsingGridComponent';
import { InlineFormComponent } from '../support/components/forms/InlineFormComponent';
import { NoLabelsFormComponent } from '../support/components/forms/NoLabelsFormComponent';
import { BlockFormComponent } from '../support/components/forms/BlockFormComponent';
import { HorizontalFormComponent } from '../support/components/forms/HorizontalFormComponent';
import { expect, test as base } from 'playwright/test';
import { ApplicationURLs } from '../support/components/main/applicationURLs';
import { WindowPageComponent } from '../support/components/modalOverlays/WindowPageComponent';
import { WindowModalComponent } from '../support/components/modalOverlays/WindowModalComponent';

type MyFixtures = {
  onBasicForm: BasicFormComponent;
  onGridForm: UsingGridComponent;
  onInlineForm: InlineFormComponent;
  onNoLabelsForm: NoLabelsFormComponent;
  onBlockForm: BlockFormComponent;
  onHorizontalForm: HorizontalFormComponent;
  onApplicationURLs: ApplicationURLs;
  onWindowPage: WindowPageComponent;
  onWindowModal: WindowModalComponent;
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
  onWindowPage: [createFixture(WindowPageComponent), { scope: 'test' }],
  onWindowModal: [createFixture(WindowModalComponent), { scope: 'test' }],
});

export { expect };
