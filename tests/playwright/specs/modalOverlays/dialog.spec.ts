import { test, expect } from '../../fixtures/base_fixture';

test.describe('Modal Overlays - Dialog page', () => {
  test('card 1: "Open Dialog with component" opens showcase dialog; ESC closes it', async ({
    onApplicationURLs,
    onDialogPage,
    onDialogModal,
  }) => {
    await test.step('Navigate to the dialog page', async () => {
      await onApplicationURLs.navigateToDialogPage();
    });

    await test.step('Click the component button and assert showcase dialog', async () => {
      await onDialogPage.clickButton('openDialogComponent');
      await onDialogModal.assertVisible('showcase');
    });

    await test.step('Press ESC and assert dialog closes', async () => {
      await onDialogModal.closeViaEsc();
      await onDialogModal.assertHidden('showcase');
    });
  });

  test('card 1: "Open Dialog with template" opens template dialog; close button closes it', async ({
    onApplicationURLs,
    onDialogPage,
    onDialogModal,
  }) => {
    await test.step('Navigate to the dialog page', async () => {
      await onApplicationURLs.navigateToDialogPage();
    });

    await test.step('Click the template button and assert template dialog', async () => {
      await onDialogPage.clickButton('openDialogTemplate');
      await onDialogModal.assertVisible('template');
    });

    await test.step('Press ESC and assert dialog closes', async () => {
      await onDialogModal.closeViaEsc();
      await onDialogModal.assertHidden('template');
    });
  });

  test('card 2: "Open Dialog with backdrop" opens showcase dialog with backdrop visible', async ({
    onApplicationURLs,
    onDialogPage,
    onDialogModal,
  }) => {
    await test.step('Navigate to the dialog page', async () => {
      await onApplicationURLs.navigateToDialogPage();
    });

    await test.step('Click the backdrop button and assert dialog + backdrop visible', async () => {
      await onDialogPage.clickButton('openDialogBackdrop');
      await onDialogModal.assertVisible('showcase');
      await onDialogModal.assertBackdropVisible();
    });

    await test.step('Close via dismiss button', async () => {
      await onDialogModal.closeShowcase();
      await onDialogModal.assertHidden('showcase');
    });
  });

  test('card 2: "Open Dialog without backdrop" opens template dialog with no backdrop', async ({
    onApplicationURLs,
    onDialogPage,
    onDialogModal,
  }) => {
    await test.step('Navigate to the dialog page', async () => {
      await onApplicationURLs.navigateToDialogPage();
    });

    await test.step('Click the no-backdrop button and assert dialog visible without backdrop', async () => {
      await onDialogPage.clickButton('openDialogNoBackdrop');
      await onDialogModal.assertVisible('template');
      await onDialogModal.assertBackdropHidden();
    });

    await test.step('Close via close button', async () => {
      await onDialogModal.closeTemplate();
      await onDialogModal.assertHidden('template');
    });
  });

  test('card 3: "Open Dialog with esc close" opens showcase dialog; ESC closes it', async ({
    onApplicationURLs,
    onDialogPage,
    onDialogModal,
  }) => {
    await test.step('Navigate to the dialog page', async () => {
      await onApplicationURLs.navigateToDialogPage();
    });

    await test.step('Click the esc button and assert showcase dialog', async () => {
      await onDialogPage.clickButton('openDialogEsc');
      await onDialogModal.assertVisible('showcase');
    });

    await test.step('Press ESC and assert dialog closes', async () => {
      await onDialogModal.closeViaEsc();
      await onDialogModal.assertHidden('showcase');
    });
  });

  test('card 3: "Open Dialog without esc close" - ESC does NOT close it', async ({
    onApplicationURLs,
    onDialogPage,
    onDialogModal,
  }) => {
    await test.step('Navigate to the dialog page', async () => {
      await onApplicationURLs.navigateToDialogPage();
    });

    await test.step('Click the no-esc button and assert template dialog', async () => {
      await onDialogPage.clickButton('openDialogNoEsc');
      await onDialogModal.assertVisible('template');
    });

    await test.step('Press ESC and assert dialog stays visible', async () => {
      await onDialogModal.closeViaEsc();
      await onDialogModal.assertVisible('template');
    });

    await test.step('Close via close button to clean up', async () => {
      await onDialogModal.closeTemplate();
      await onDialogModal.assertHidden('template');
    });
  });

  test('card 4: "Open Dialog with backdrop click" opens showcase; backdrop click closes it', async ({
    onApplicationURLs,
    onDialogPage,
    onDialogModal,
  }) => {
    await test.step('Navigate to the dialog page', async () => {
      await onApplicationURLs.navigateToDialogPage();
    });

    await test.step('Click the backdrop-click button and assert showcase', async () => {
      await onDialogPage.clickButton('openDialogBackdropClick');
      await onDialogModal.assertVisible('showcase');
    });

    await test.step('Click backdrop and assert dialog closes', async () => {
      await onDialogModal.clickBackdrop();
      await onDialogModal.assertHidden('showcase');
    });
  });

  test('card 4: "Open without backdrop click" - backdrop click does NOT close it', async ({
    onApplicationURLs,
    onDialogPage,
    onDialogModal,
  }) => {
    await test.step('Navigate to the dialog page', async () => {
      await onApplicationURLs.navigateToDialogPage();
    });

    await test.step('Click the no-backdrop-click button and assert template dialog', async () => {
      await onDialogPage.clickButton('openDialogNoBackdropClick');
      await onDialogModal.assertVisible('template');
    });

    await test.step('Click backdrop and assert dialog stays visible', async () => {
      await onDialogModal.clickBackdrop();
      await onDialogModal.assertVisible('template');
    });

    await test.step('Close via close button to clean up', async () => {
      await onDialogModal.closeTemplate();
      await onDialogModal.assertHidden('template');
    });
  });

  test('card 5: "Enter Name" prompts for a name and appends it to the names list', async ({
    onApplicationURLs,
    onDialogPage,
    onDialogModal,
  }) => {
    const testName = 'Jane Doe';

    await test.step('Navigate to the dialog page', async () => {
      await onApplicationURLs.navigateToDialogPage();
    });

    await test.step('Open name prompt dialog', async () => {
      await onDialogPage.clickButton('enterName');
      await onDialogModal.assertVisible('namePrompt');
    });

    await test.step('Fill and submit the name', async () => {
      await onDialogModal.fillName(testName);
      await onDialogModal.submitName();
      await onDialogModal.assertHidden('namePrompt');
    });

    await test.step('Assert the name appears in the list', async () => {
      await expect(onDialogPage.nameItems).toHaveCount(1);
      await expect(onDialogPage.nameItems.first()).toHaveText(testName);
    });
  });
});
