import { test, expect } from '../../src/fixtures';

test.describe('TodoMVC', () => {
  test('adds items and updates the counter', async ({ todoPage }) => {
    await todoPage.add('Write a failing test', 'Make it pass');

    await expect(todoPage.itemTitles).toHaveText(['Write a failing test', 'Make it pass']);
    await expect(todoPage.counter).toHaveText('2 items left');
  });

  test('completes an item and filters by status', async ({ todoPage }) => {
    await todoPage.add('Review PR', 'Triage flaky test', 'Ship it');
    await todoPage.toggle('Triage flaky test');

    await expect(todoPage.counter).toHaveText('2 items left');

    await todoPage.filter('Completed');
    await expect(todoPage.itemTitles).toHaveText(['Triage flaky test']);

    await todoPage.filter('Active');
    await expect(todoPage.itemTitles).toHaveText(['Review PR', 'Ship it']);
  });

  test('clears completed items', async ({ todoPage }) => {
    await todoPage.add('Done already', 'Still pending');
    await todoPage.toggle('Done already');
    await todoPage.clearCompleted.click();

    await expect(todoPage.itemTitles).toHaveText(['Still pending']);
    await expect(todoPage.clearCompleted).toBeHidden();
  });
});
