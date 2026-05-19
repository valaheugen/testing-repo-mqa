import { test } from '../fixtures/base_fixture';
import {
  argosComponentScreenshot,
  argosFullScreenshot,
} from '../support/utils/argosSmartScreenshot';

test.describe('Form layouts — visual', () => {
  test('full page', async ({ page, onApplicationURLs }) => {
    await onApplicationURLs.navigateToFormsLayouts();
    await argosFullScreenshot({ page, snapshotName: 'forms/layouts-full' });
  });

  test('inline form component', async ({ page, onApplicationURLs, onInlineForm }) => {
    await onApplicationURLs.navigateToFormsLayouts();
    await onInlineForm.assertVisibility(true);
    await argosComponentScreenshot({
      page,
      snapshotName: 'forms/layouts-inline-form',
      selector: onInlineForm.card,
    });
  });
});
