import { test } from '../../fixtures/base_fixture';
import { ToastStatus } from '../../support/components/modalOverlays/ToastComponent';

test.describe('Modal Overlays - Toastr page', () => {
  test('default config shows a toast with default title and content', async ({
    onApplicationURLs,
    onToastrPage,
    onToast,
  }) => {
    await test.step('Navigate to the toastr page', async () => {
      await onApplicationURLs.navigateToToastrPage();
    });

    await test.step('Show toast with default config', async () => {
      await onToastrPage.showToast();
    });

    await test.step('Assert toast with default title and content', async () => {
      await onToast.assertVisible({ title: 'HI there!', content: "I'm cool toaster!", status: 'primary' });
    });
  });

  test('custom title and content render in the toast', async ({
    onApplicationURLs,
    onToastrPage,
    onToast,
  }) => {
    const customTitle = 'Custom Title';
    const customContent = 'Custom content body';

    await test.step('Navigate to the toastr page', async () => {
      await onApplicationURLs.navigateToToastrPage();
    });

    await test.step('Fill custom title and content', async () => {
      await onToastrPage.fillTitle(customTitle);
      await onToastrPage.fillContent(customContent);
    });

    await test.step('Show toast and assert custom values appear', async () => {
      await onToastrPage.showToast();
      await onToast.assertVisible({ title: customTitle, content: customContent });
    });
  });

  test('clicking a toast dismisses it when "Hide on click" is enabled', async ({
    onApplicationURLs,
    onToastrPage,
    onToast,
  }) => {
    await test.step('Navigate to the toastr page', async () => {
      await onApplicationURLs.navigateToToastrPage();
    });

    await test.step('Set a long duration so timing does not race the click', async () => {
      await onToastrPage.setDuration(60000);
    });

    await test.step('Show toast and assert visible', async () => {
      await onToastrPage.showToast();
      await onToast.assertVisible({});
    });

    await test.step('Click the toast and assert it is dismissed', async () => {
      await onToast.clickFirstToast();
      await onToast.waitUntilHidden();
    });
  });

  const statuses: ToastStatus[] = ['primary', 'success', 'info', 'warning', 'danger'];

  for (const status of statuses) {
    test(`toast type "${status}" renders a toast with status-${status} class`, async ({
      onApplicationURLs,
      onToastrPage,
      onToast,
    }) => {
      await test.step('Navigate to the toastr page', async () => {
        await onApplicationURLs.navigateToToastrPage();
      });

      await test.step(`Select type "${status}"`, async () => {
        await onToastrPage.selectType(status);
      });

      await test.step(`Show toast and assert status-${status} class`, async () => {
        await onToastrPage.showToast();
        await onToast.assertVisible({ status });
      });
    });
  }

  test('"Random toast" button shows a toast', async ({
    onApplicationURLs,
    onToastrPage,
    onToast,
  }) => {
    await test.step('Navigate to the toastr page', async () => {
      await onApplicationURLs.navigateToToastrPage();
    });

    await test.step('Click random toast and assert some toast appears', async () => {
      await onToastrPage.showRandomToast();
      await onToast.assertVisible({});
    });
  });
});
