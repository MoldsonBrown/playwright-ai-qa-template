import { test, expect } from '../../src/fixtures';
import { checkoutCustomer, shopUsers } from '../../src/data/users';

test.describe('Shop – authentication', () => {
  test('standard user lands on the inventory', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(shopUsers.standard);

    await inventoryPage.expectLoaded();
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('locked-out user sees a clear error', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(shopUsers.lockedOut);

    await expect(loginPage.error).toContainText('this user has been locked out');
    await expect(page).not.toHaveURL(/inventory/);
  });
});

test.describe('Shop – catalog and checkout', () => {
  test('sorts products by price, low to high', async ({ shop }) => {
    await shop.sortBy('lohi');
    // Wait on the UI state, not on time: the first price must be the cheapest one.
    await expect(shop.prices.first()).toHaveText('$7.99');

    const prices = await shop.priceValues();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('completes a purchase end to end', async ({ shop, checkoutPage, page }) => {
    await shop.addToCart('Sauce Labs Backpack');
    await shop.addToCart('Sauce Labs Bike Light');
    await expect(shop.cartBadge).toHaveText('2');

    await shop.openCart();
    await expect(checkoutPage.cartItems).toHaveCount(2);

    await checkoutPage.checkoutButton.click();
    await checkoutPage.fillCustomer(checkoutCustomer);
    await checkoutPage.finishButton.click();

    await expect(page).toHaveURL(/checkout-complete/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});
