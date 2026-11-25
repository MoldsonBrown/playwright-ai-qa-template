import { expect, type Locator, type Page } from '@playwright/test';
import { urls } from '../config/env';
import type { ShopUser } from '../data/users';

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(private readonly page: Page) {
    this.username = page.getByPlaceholder('Username');
    this.password = page.getByPlaceholder('Password');
    this.submit = page.getByRole('button', { name: 'Login' });
    // saucedemo exposes `data-test` (not `data-testid`) attributes.
    this.error = page.locator('[data-test="error"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(urls.shop);
    await expect(this.submit).toBeVisible();
  }

  async login(user: ShopUser): Promise<void> {
    await this.username.fill(user.username);
    await this.password.fill(user.password);
    await this.submit.click();
  }
}
