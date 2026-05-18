import { test } from '../../fixtures/base_fixture';

test.describe('Modal Overlays - Tooltip page', () => {
  test('Icon card: home tooltip button shows tooltip on hover', async ({
    onApplicationURLs,
    onTooltipPage,
    onTooltipContent,
  }) => {
    await test.step('Navigate to the tooltip page', async () => {
      await onApplicationURLs.navigateToTooltipPage();
    });

    await test.step('Hover home button and assert tooltip visible', async () => {
      await onTooltipPage.hoverButton('home');
      await onTooltipContent.assertVisible();
    });
  });

  test('Icon card: empty-string tooltip button shows tooltip with empty text', async ({
    onApplicationURLs,
    onTooltipPage,
    onTooltipContent,
  }) => {
    await test.step('Navigate to the tooltip page', async () => {
      await onApplicationURLs.navigateToTooltipPage();
    });

    await test.step('Hover empty-tooltip button and assert tooltip has empty text', async () => {
      await onTooltipPage.hoverButton('empty');
      await onTooltipContent.assertEmpty();
    });
  });

  test('Placement card: Top button shows tooltip on hover', async ({
    onApplicationURLs,
    onTooltipPage,
    onTooltipContent,
  }) => {
    await test.step('Navigate to the tooltip page', async () => {
      await onApplicationURLs.navigateToTooltipPage();
    });

    await test.step('Hover Top button and assert tooltip visible', async () => {
      await onTooltipPage.hoverButton('top');
      await onTooltipContent.assertVisible();
    });
  });

  test('Placement card: Right button shows tooltip on hover', async ({
    onApplicationURLs,
    onTooltipPage,
    onTooltipContent,
  }) => {
    await test.step('Navigate to the tooltip page', async () => {
      await onApplicationURLs.navigateToTooltipPage();
    });

    await test.step('Hover Right button and assert tooltip visible', async () => {
      await onTooltipPage.hoverButton('right');
      await onTooltipContent.assertVisible();
    });
  });

  test('Placement card: Bottom button shows tooltip on hover', async ({
    onApplicationURLs,
    onTooltipPage,
    onTooltipContent,
  }) => {
    await test.step('Navigate to the tooltip page', async () => {
      await onApplicationURLs.navigateToTooltipPage();
    });

    await test.step('Hover Bottom button and assert tooltip visible', async () => {
      await onTooltipPage.hoverButton('bottom');
      await onTooltipContent.assertVisible();
    });
  });

  test('Placement card: Left button shows tooltip on hover', async ({
    onApplicationURLs,
    onTooltipPage,
    onTooltipContent,
  }) => {
    await test.step('Navigate to the tooltip page', async () => {
      await onApplicationURLs.navigateToTooltipPage();
    });

    await test.step('Hover Left button and assert tooltip visible', async () => {
      await onTooltipPage.hoverButton('left');
      await onTooltipContent.assertVisible();
    });
  });

  test('Colored card: Default button shows tooltip on hover', async ({
    onApplicationURLs,
    onTooltipPage,
    onTooltipContent,
  }) => {
    await test.step('Navigate to the tooltip page', async () => {
      await onApplicationURLs.navigateToTooltipPage();
    });

    await test.step('Hover Default button and assert tooltip visible', async () => {
      await onTooltipPage.hoverButton('default');
      await onTooltipContent.assertVisible();
    });
  });

  test('Colored card: Primary button shows tooltip on hover', async ({
    onApplicationURLs,
    onTooltipPage,
    onTooltipContent,
  }) => {
    await test.step('Navigate to the tooltip page', async () => {
      await onApplicationURLs.navigateToTooltipPage();
    });

    await test.step('Hover Primary button and assert tooltip visible', async () => {
      await onTooltipPage.hoverButton('primary');
      await onTooltipContent.assertVisible();
    });
  });

  test('Colored card: Success button shows tooltip on hover', async ({
    onApplicationURLs,
    onTooltipPage,
    onTooltipContent,
  }) => {
    await test.step('Navigate to the tooltip page', async () => {
      await onApplicationURLs.navigateToTooltipPage();
    });

    await test.step('Hover Success button and assert tooltip visible', async () => {
      await onTooltipPage.hoverButton('success');
      await onTooltipContent.assertVisible();
    });
  });

  test('Colored card: Danger button shows tooltip on hover', async ({
    onApplicationURLs,
    onTooltipPage,
    onTooltipContent,
  }) => {
    await test.step('Navigate to the tooltip page', async () => {
      await onApplicationURLs.navigateToTooltipPage();
    });

    await test.step('Hover Danger button and assert tooltip visible', async () => {
      await onTooltipPage.hoverButton('danger');
      await onTooltipContent.assertVisible();
    });
  });

  test('Colored card: Info button shows tooltip on hover', async ({
    onApplicationURLs,
    onTooltipPage,
    onTooltipContent,
  }) => {
    await test.step('Navigate to the tooltip page', async () => {
      await onApplicationURLs.navigateToTooltipPage();
    });

    await test.step('Hover Info button and assert tooltip visible', async () => {
      await onTooltipPage.hoverButton('info');
      await onTooltipContent.assertVisible();
    });
  });

  test('Colored card: Warning button shows tooltip on hover', async ({
    onApplicationURLs,
    onTooltipPage,
    onTooltipContent,
  }) => {
    await test.step('Navigate to the tooltip page', async () => {
      await onApplicationURLs.navigateToTooltipPage();
    });

    await test.step('Hover Warning button and assert tooltip visible', async () => {
      await onTooltipPage.hoverButton('warning');
      await onTooltipContent.assertVisible();
    });
  });
});
