/**
 * Public demo accounts published on https://www.saucedemo.com (not secrets).
 * In a real project, read credentials from environment variables / a secrets manager.
 */
export const shopPassword = process.env.SHOP_PASSWORD ?? 'secret_sauce';

export const shopUsers = {
  standard: { username: 'standard_user', password: shopPassword },
  lockedOut: { username: 'locked_out_user', password: shopPassword },
} as const;

export type ShopUser = (typeof shopUsers)[keyof typeof shopUsers];

export const checkoutCustomer = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  postalCode: '94105',
} as const;
