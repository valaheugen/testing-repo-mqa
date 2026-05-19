import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export type SocialIcon = 'github' | 'facebook' | 'twitter';

const SOCIAL_URLS: Record<SocialIcon, string> = {
  github: 'https://github.com/akveo/nebular',
  facebook: 'https://www.facebook.com/akveo/',
  twitter: 'https://twitter.com/akveo_inc',
};

export class LoginPageComponent {
  readonly page: Page;
  readonly title: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly submitButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly socialsSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1#title');
    this.emailInput = page.locator('input#input-email[name="email"]');
    this.passwordInput = page.locator('input#input-password[name="password"]');
    this.rememberMeCheckbox = page
      .locator('nb-checkbox[name="rememberMe"]')
      .locator('input[type="checkbox"]');
    this.submitButton = page.getByRole('button', { name: 'Log In' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password?' });
    this.registerLink = page.locator('section.another-action a.text-link');
    this.socialsSection = page.locator('section.links .socials');
  }

  socialIcon(icon: SocialIcon): Locator {
    return this.socialsSection.locator(`a.${icon}`);
  }

  expectedSocialUrl(icon: SocialIcon): string {
    return SOCIAL_URLS[icon];
  }

  async clickRegisterLink() {
    // Angular routerLink doesn't react to Playwright's synthetic click here;
    // dispatchEvent('click') reliably triggers the directive's navigation.
    await this.registerLink.dispatchEvent('click');
  }

  async assertVisibility(visible = true) {
    if (visible) {
      await expect(this.title).toHaveText('Login');
      await expect(this.emailInput).toBeVisible();
      await expect(this.passwordInput).toBeVisible();
      await expect(this.submitButton).toBeVisible();
    } else {
      await expect(this.title).not.toBeVisible();
    }
  }

  async fillEmail(value: string) {
    await this.emailInput.fill(value);
  }

  async fillPassword(value: string) {
    await this.passwordInput.fill(value);
  }

  async toggleRememberMe() {
    await expect(this.rememberMeCheckbox).not.toBeChecked();
    await this.rememberMeCheckbox.check({ force: true });
    await expect(this.rememberMeCheckbox).toBeChecked();
  }

  async assertSubmitEnabled() {
    await expect(this.submitButton).toBeEnabled();
  }
}
