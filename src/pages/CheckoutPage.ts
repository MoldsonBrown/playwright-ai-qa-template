import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;

  constructor(private readonly page: Page) {
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.postalCode = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  async fillCustomer(c: { firstName: string; lastName: string; postalCode: string }) {
    await this.firstName.fill(c.firstName);
    await this.lastName.fill(c.lastName);
    await this.postalCode.fill(c.postalCode);
    await this.continueButton.click();
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }
}
