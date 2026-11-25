import { expect, type Locator, type Page } from '@playwright/test';
import { urls } from '../config/env';

export class TodoPage {
  readonly newTodo: Locator;
  readonly items: Locator;
  readonly itemTitles: Locator;
  readonly counter: Locator;
  readonly clearCompleted: Locator;

  constructor(private readonly page: Page) {
    this.newTodo = page.getByPlaceholder('What needs to be done?');
    this.items = page.getByTestId('todo-item');
    this.itemTitles = page.getByTestId('todo-title');
    this.counter = page.getByTestId('todo-count');
    this.clearCompleted = page.getByRole('button', { name: 'Clear completed' });
  }

  async goto(): Promise<void> {
    await this.page.goto(urls.todo);
    await expect(this.newTodo).toBeVisible();
  }

  async add(...titles: string[]): Promise<void> {
    for (const title of titles) {
      await this.newTodo.fill(title);
      await this.newTodo.press('Enter');
    }
  }

  item(title: string): Locator {
    return this.items.filter({ hasText: title });
  }

  async toggle(title: string): Promise<void> {
    await this.item(title).getByRole('checkbox').check();
  }

  async filter(name: 'All' | 'Active' | 'Completed'): Promise<void> {
    await this.page.getByRole('link', { name, exact: true }).click();
  }
}
