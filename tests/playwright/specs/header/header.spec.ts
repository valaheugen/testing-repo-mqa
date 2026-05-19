import { test, expect } from '../../fixtures/base_fixture';

test.describe('Page header', () => {
  test('header renders on every page (smoke on iot-dashboard)', async ({
    onApplicationURLs,
    onHeader,
  }) => {
    await test.step('Navigate to the IoT dashboard', async () => {
      await onApplicationURLs.navigateToIotDashboardPage();
    });

    await test.step('Assert header containers, logo, theme select are visible', async () => {
      await onHeader.assertVisibility(true);
    });
  });

  test('sidebar toggle changes the sidebar state', async ({
    onApplicationURLs,
    onHeader,
  }) => {
    await test.step('Navigate to the IoT dashboard', async () => {
      await onApplicationURLs.navigateToIotDashboardPage();
    });

    const initialClass = (await onHeader.sidebar.getAttribute('class')) ?? '';

    await test.step('Click the sidebar toggle', async () => {
      await onHeader.toggleSidebar();
    });

    await test.step('Assert the sidebar class changed', async () => {
      await expect(onHeader.sidebar).not.toHaveClass(initialClass);
    });
  });

  test('theme switcher applies the Dark theme', async ({
    onApplicationURLs,
    onHeader,
  }) => {
    await test.step('Navigate to the IoT dashboard', async () => {
      await onApplicationURLs.navigateToIotDashboardPage();
    });

    await test.step('Select the Dark theme', async () => {
      await onHeader.selectTheme('dark');
    });

    await test.step('Assert the dark theme is applied', async () => {
      await onHeader.assertThemeApplied('dark');
    });
  });

  test('user avatar opens the context menu with Profile and Log out', async ({
    onApplicationURLs,
    onHeader,
  }) => {
    await test.step('Navigate to the IoT dashboard', async () => {
      await onApplicationURLs.navigateToIotDashboardPage();
    });

    await test.step('Click the user avatar', async () => {
      await onHeader.openUserMenu();
    });

    await test.step('Assert Profile and Log out items are visible', async () => {
      await onHeader.assertUserMenuVisible();
    });
  });
});
