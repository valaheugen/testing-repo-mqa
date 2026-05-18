import { test } from '../../fixtures/base_fixture';

const POPOVER_TEXT = 'Hello, how are you today?';

test.describe('Modal Overlays - Popover page', () => {
  test('Position card: Left button shows popover on hover', async ({
    onApplicationURLs,
    onPopoverPage,
    onPopoverContent,
  }) => {
    await test.step('Navigate to the popover page', async () => {
      await onApplicationURLs.navigateToPopoverPage();
    });

    await test.step('Hover Left button and assert popover visible', async () => {
      await onPopoverPage.hoverButton('left');
      await onPopoverContent.assertVisible('text', POPOVER_TEXT);
    });
  });

  test('Position card: Top button shows popover on hover', async ({
    onApplicationURLs,
    onPopoverPage,
    onPopoverContent,
  }) => {
    await test.step('Navigate to the popover page', async () => {
      await onApplicationURLs.navigateToPopoverPage();
    });

    await test.step('Hover Top button and assert popover visible', async () => {
      await onPopoverPage.hoverButton('top');
      await onPopoverContent.assertVisible('text', POPOVER_TEXT);
    });
  });

  test('Position card: Bottom button shows popover on hover', async ({
    onApplicationURLs,
    onPopoverPage,
    onPopoverContent,
  }) => {
    await test.step('Navigate to the popover page', async () => {
      await onApplicationURLs.navigateToPopoverPage();
    });

    await test.step('Hover Bottom button and assert popover visible', async () => {
      await onPopoverPage.hoverButton('bottom');
      await onPopoverContent.assertVisible('text', POPOVER_TEXT);
    });
  });

  test('Position card: Right button shows popover on hover', async ({
    onApplicationURLs,
    onPopoverPage,
    onPopoverContent,
  }) => {
    await test.step('Navigate to the popover page', async () => {
      await onApplicationURLs.navigateToPopoverPage();
    });

    await test.step('Hover Right button and assert popover visible', async () => {
      await onPopoverPage.hoverButton('right');
      await onPopoverContent.assertVisible('text', POPOVER_TEXT);
    });
  });

  test('Simple card: on-click button toggles popover via click', async ({
    onApplicationURLs,
    onPopoverPage,
    onPopoverContent,
  }) => {
    await test.step('Navigate to the popover page', async () => {
      await onApplicationURLs.navigateToPopoverPage();
    });

    await test.step('Click button and assert popover visible', async () => {
      await onPopoverPage.clickButton('onClick');
      await onPopoverContent.assertVisible('text', POPOVER_TEXT);
    });

    await test.step('Click button again and assert popover hidden', async () => {
      await onPopoverPage.clickButton('onClick');
      await onPopoverContent.assertHidden();
    });
  });

  test('Simple card: on-hover button shows popover on hover', async ({
    onApplicationURLs,
    onPopoverPage,
    onPopoverContent,
  }) => {
    await test.step('Navigate to the popover page', async () => {
      await onApplicationURLs.navigateToPopoverPage();
    });

    await test.step('Hover button and assert popover visible', async () => {
      await onPopoverPage.hoverButton('onHover');
      await onPopoverContent.assertVisible('text', POPOVER_TEXT);
    });
  });

  test('Simple card: on-hint button shows popover on hover', async ({
    onApplicationURLs,
    onPopoverPage,
    onPopoverContent,
  }) => {
    await test.step('Navigate to the popover page', async () => {
      await onApplicationURLs.navigateToPopoverPage();
    });

    await test.step('Hover button and assert popover visible', async () => {
      await onPopoverPage.hoverButton('onHint');
      await onPopoverContent.assertVisible('text', POPOVER_TEXT);
    });
  });

  test('Template card: With tabs button shows tabs popover', async ({
    onApplicationURLs,
    onPopoverPage,
    onPopoverContent,
  }) => {
    await test.step('Navigate to the popover page', async () => {
      await onApplicationURLs.navigateToPopoverPage();
    });

    await test.step('Click With tabs and assert tabs popover', async () => {
      await onPopoverPage.clickButton('tabs');
      await onPopoverContent.assertVisible('tabs');
    });
  });

  test('Template card: With form button shows form popover', async ({
    onApplicationURLs,
    onPopoverPage,
    onPopoverContent,
  }) => {
    await test.step('Navigate to the popover page', async () => {
      await onApplicationURLs.navigateToPopoverPage();
    });

    await test.step('Click With form and assert form popover', async () => {
      await onPopoverPage.clickButton('form');
      await onPopoverContent.assertVisible('form');
    });
  });

  test('Template card: With card button shows card popover', async ({
    onApplicationURLs,
    onPopoverPage,
    onPopoverContent,
  }) => {
    await test.step('Navigate to the popover page', async () => {
      await onApplicationURLs.navigateToPopoverPage();
    });

    await test.step('Click With card and assert card popover', async () => {
      await onPopoverPage.clickButton('card');
      await onPopoverContent.assertVisible('card');
    });
  });

  test('Component card: With tabs button shows tabs popover', async ({
    onApplicationURLs,
    onPopoverPage,
    onPopoverContent,
  }) => {
    await test.step('Navigate to the popover page', async () => {
      await onApplicationURLs.navigateToPopoverPage();
    });

    await test.step('Click With tabs (component) and assert tabs popover', async () => {
      await onPopoverPage.clickButton('tabsComponent');
      await onPopoverContent.assertVisible('tabs');
    });
  });

  test('Component card: With form button shows form popover', async ({
    onApplicationURLs,
    onPopoverPage,
    onPopoverContent,
  }) => {
    await test.step('Navigate to the popover page', async () => {
      await onApplicationURLs.navigateToPopoverPage();
    });

    await test.step('Click With form (component) and assert form popover', async () => {
      await onPopoverPage.clickButton('formComponent');
      await onPopoverContent.assertVisible('form');
    });
  });

  test('Component card: With card button shows card popover', async ({
    onApplicationURLs,
    onPopoverPage,
    onPopoverContent,
  }) => {
    await test.step('Navigate to the popover page', async () => {
      await onApplicationURLs.navigateToPopoverPage();
    });

    await test.step('Click With card (component) and assert card popover', async () => {
      await onPopoverPage.clickButton('cardComponent');
      await onPopoverContent.assertVisible('card');
    });
  });
});
