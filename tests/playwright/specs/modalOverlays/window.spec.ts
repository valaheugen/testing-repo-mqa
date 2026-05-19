import { test } from '../../fixtures/base_fixture';

test.describe('Modal Overlays - Window page', () => {
  test('clicking "Open window form" opens the form modal', async ({
    onApplicationURLs,
    onWindowPage,
  }) => {
    await test.step('Navigate to the window page', async () => {
      await onApplicationURLs.navigateToWindowPage();
    });

    await test.step('Click "Open window form" and assert the form modal opens', async () => {
      await onWindowPage.clickOnButton('openWindowForm');
    });
  });

  test('clicking "Open window with template" opens the template modal', async ({
    onApplicationURLs,
    onWindowPage,
  }) => {
    await test.step('Navigate to the window page', async () => {
      await onApplicationURLs.navigateToWindowPage();
    });

    await test.step('Click "Open window with template" and assert the template modal opens', async () => {
      await onWindowPage.clickOnButton('openWindowTemplate');
    });
  });

  test('clicking "Open window with backdrop" opens the template modal', async ({
    onApplicationURLs,
    onWindowPage,
  }) => {
    await test.step('Navigate to the window page', async () => {
      await onApplicationURLs.navigateToWindowPage();
    });

    await test.step('Click "Open window with backdrop" and assert the template modal opens', async () => {
      await onWindowPage.clickOnButton('openWindowBackdrop');
    });
  });

  test('clicking "Open window without backdrop" opens the no-backdrop modal', async ({
    onApplicationURLs,
    onWindowPage,
  }) => {
    await test.step('Navigate to the window page', async () => {
      await onApplicationURLs.navigateToWindowPage();
    });

    await test.step('Click "Open window without backdrop" and assert the no-backdrop modal opens', async () => {
      await onWindowPage.clickOnButton('openWindowNoBackdrop');
    });
  });
});
