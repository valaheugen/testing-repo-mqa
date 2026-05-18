import { test } from '../../fixtures/base_fixture';

test.describe('Charts - ECharts page', () => {
  test('renders all 7 chart cards (smoke)', async ({
    onApplicationURLs,
    onEchartsPage,
  }) => {
    await test.step('Navigate to the echarts page', async () => {
      await onApplicationURLs.navigateToEchartsPage();
    });

    await test.step('Assert every chart card is visible', async () => {
      await onEchartsPage.assertVisibility(true);
    });
  });
});
