import { test as base, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PostsClient } from '../api/PostsClient';
import { shopUsers } from '../data/users';

type Fixtures = {
  todoPage: TodoPage;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  checkoutPage: CheckoutPage;
  /** Inventory page already authenticated as the standard user. */
  shop: InventoryPage;
  posts: PostsClient;
};

export const test = base.extend<Fixtures>({
  todoPage: async ({ page }, use) => {
    const todo = new TodoPage(page);
    await todo.goto();
    await use(todo);
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  shop: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.goto();
    await loginPage.login(shopUsers.standard);
    await inventoryPage.expectLoaded();
    await use(inventoryPage);
  },
  posts: async ({ request }, use) => {
    await use(new PostsClient(request));
  },
});

export { expect };
