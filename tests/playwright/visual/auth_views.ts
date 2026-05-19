import { test } from '../fixtures/base_fixture';
import { argosFullScreenshot } from '../support/utils/argosSmartScreenshot';

test.describe('Auth pages — visual', () => {
  test('login page', async ({ page, onApplicationURLs }) => {
    await onApplicationURLs.navigateToLoginPage();
    await argosFullScreenshot({ page, snapshotName: 'auth/login' });
  });

  test('register page', async ({ page, onApplicationURLs }) => {
    await onApplicationURLs.navigateToRegisterPage();
    await argosFullScreenshot({ page, snapshotName: 'auth/register' });
  });

  test('request-password page', async ({ page, onApplicationURLs }) => {
    await onApplicationURLs.navigateToRequestPasswordPage();
    await argosFullScreenshot({ page, snapshotName: 'auth/request-password' });
  });

  test('reset-password page', async ({ page, onApplicationURLs }) => {
    await onApplicationURLs.navigateToResetPasswordPage();
    await argosFullScreenshot({ page, snapshotName: 'auth/reset-password' });
  });
});
