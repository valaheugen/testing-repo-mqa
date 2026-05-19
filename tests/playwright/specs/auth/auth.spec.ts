import { test, expect } from '../../fixtures/base_fixture';
import { SocialIcon } from '../../support/components/auth/LoginPageComponent';

test.describe('Auth pages', () => {
  test('login: fill form and assert submit is enabled', async ({
    onApplicationURLs,
    onLoginPage,
  }) => {
    await test.step('Navigate to the login page', async () => {
      await onApplicationURLs.navigateToLoginPage();
    });

    await test.step('Fill email and password', async () => {
      await onLoginPage.fillEmail('test@example.com');
      await onLoginPage.fillPassword('password123');
    });

    await test.step('Toggle Remember me', async () => {
      await onLoginPage.toggleRememberMe();
    });

    await test.step('Assert the Log In button is enabled', async () => {
      await onLoginPage.assertSubmitEnabled();
    });
  });

  const socials: SocialIcon[] = ['github', 'facebook', 'twitter'];

  for (const icon of socials) {
    test(`login: ${icon} social icon links to the expected URL`, async ({
      onApplicationURLs,
      onLoginPage,
    }) => {
      await test.step('Navigate to the login page', async () => {
        await onApplicationURLs.navigateToLoginPage();
      });

      await test.step(`Assert ${icon} icon is visible and links to the expected URL`, async () => {
        const link = onLoginPage.socialIcon(icon);
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', onLoginPage.expectedSocialUrl(icon));
        await expect(link).toHaveAttribute('target', '_blank');
      });
    });
  }

  test('login: clicking the Register link navigates to /auth/register', async ({
    onApplicationURLs,
    onLoginPage,
    onRegisterPage,
    page,
  }) => {
    await test.step('Navigate to the login page', async () => {
      await onApplicationURLs.navigateToLoginPage();
    });

    await test.step('Assert the Register link points to /auth/register', async () => {
      await expect(onLoginPage.registerLink).toHaveAttribute('href', '/auth/register');
    });

    await test.step('Click the Register link', async () => {
      await onLoginPage.clickRegisterLink();
    });

    await test.step('Wait for navigation to /auth/register', async () => {
      await page.waitForURL(/\/auth\/register$/);
    });

    await test.step('Assert register page rendered', async () => {
      await onRegisterPage.assertVisibility(true);
    });
  });

  test('register: fill form and assert submit is enabled', async ({
    onApplicationURLs,
    onRegisterPage,
  }) => {
    await test.step('Navigate to the register page', async () => {
      await onApplicationURLs.navigateToRegisterPage();
    });

    await test.step('Fill the registration form', async () => {
      await onRegisterPage.fillFullName('Jane Doe');
      await onRegisterPage.fillEmail('jane@example.com');
      await onRegisterPage.fillPassword('password123');
      await onRegisterPage.fillConfirmPassword('password123');
      await onRegisterPage.acceptTerms();
    });

    await test.step('Assert the Register button is enabled', async () => {
      await onRegisterPage.assertSubmitEnabled();
    });
  });

  test('request-password: fill email and assert submit is enabled', async ({
    onApplicationURLs,
    onRequestPasswordPage,
  }) => {
    await test.step('Navigate to the request password page', async () => {
      await onApplicationURLs.navigateToRequestPasswordPage();
    });

    await test.step('Fill the email', async () => {
      await onRequestPasswordPage.fillEmail('test@example.com');
    });

    await test.step('Assert the Request password button is enabled', async () => {
      await onRequestPasswordPage.assertSubmitEnabled();
    });
  });

  test('reset-password: fill new password and confirm, assert submit is enabled', async ({
    onApplicationURLs,
    onResetPasswordPage,
  }) => {
    await test.step('Navigate to the reset password page', async () => {
      await onApplicationURLs.navigateToResetPasswordPage();
    });

    await test.step('Fill new password and confirmation', async () => {
      await onResetPasswordPage.fillPassword('newpassword123');
      await onResetPasswordPage.fillConfirmPassword('newpassword123');
    });

    await test.step('Assert the Change password button is enabled', async () => {
      await onResetPasswordPage.assertSubmitEnabled();
    });
  });
});
