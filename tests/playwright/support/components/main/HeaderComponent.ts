import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';

export type ThemeName = 'default' | 'dark' | 'cosmic' | 'corporate';
export type UserMenuItem = 'Profile' | 'Log out';

export class HeaderComponent {
  readonly page: Page;
  readonly leftContainer: Locator;
  readonly rightContainer: Locator;
  readonly sidebarToggleBtn: Locator;
  readonly logo: Locator;
  readonly themeSelect: Locator;
  readonly searchAction: Locator;
  readonly emailAction: Locator;
  readonly bellAction: Locator;
  readonly userAction: Locator;
  readonly sidebar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.leftContainer = page.getByTestId('header-left');
    this.rightContainer = page.getByTestId('header-right');
    this.sidebarToggleBtn = page.getByTestId('sidebar-toggle-btn');
    this.logo = page.getByTestId('header-logo');
    this.themeSelect = page.getByTestId('theme-select');
    this.searchAction = page.getByTestId('header-search-action');
    this.emailAction = page.getByTestId('header-email-action');
    this.bellAction = page.getByTestId('header-bell-action');
    this.userAction = page.getByTestId('header-user-action');
    this.sidebar = page.locator('nb-sidebar.menu-sidebar');
  }

  async assertVisibility(visible = true) {
    if (visible) {
      await expect(this.leftContainer).toBeVisible();
      await expect(this.rightContainer).toBeVisible();
      await expect(this.logo).toBeVisible();
      await expect(this.themeSelect).toBeVisible();
    } else {
      await expect(this.leftContainer).not.toBeVisible();
    }
  }

  async toggleSidebar() {
    await this.sidebarToggleBtn.click();
  }

  async clickLogo() {
    await this.logo.click();
  }

  async selectTheme(theme: ThemeName) {
    await this.themeSelect.click();
    await this.page.getByTestId(`theme-option-${theme}`).click();
  }

  async openUserMenu() {
    await this.userAction.click();
  }

  userMenuItem(text: UserMenuItem): Locator {
    return this.page.locator('nb-context-menu').getByText(text, { exact: true });
  }

  async assertUserMenuVisible() {
    await expect(this.userMenuItem('Profile')).toBeVisible();
    await expect(this.userMenuItem('Log out')).toBeVisible();
  }

  async assertThemeApplied(theme: ThemeName) {
    await expect(this.page.locator(`.nb-theme-${theme}`).first()).toBeVisible();
  }

  async assertSidebarCompacted(compacted: boolean) {
    if (compacted) {
      await expect(this.sidebar).toHaveClass(/compacted|collapsed/);
    } else {
      await expect(this.sidebar).not.toHaveClass(/compacted|collapsed/);
    }
  }
}
