import { test } from '../../fixtures/base_fixture';

test.describe('IoT Dashboard page', () => {
  test('renders all widgets (smoke)', async ({
    onApplicationURLs,
    onIotDashboardPage,
  }) => {
    await test.step('Navigate to the IoT dashboard', async () => {
      await onApplicationURLs.navigateToIotDashboardPage();
    });

    await test.step('Assert every dashboard widget is visible', async () => {
      await onIotDashboardPage.assertVisibility(true);
    });
  });
});
