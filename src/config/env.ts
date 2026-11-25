/** Target URLs. Override per environment with env vars (see .env.example). */
export const urls = {
  todo: process.env.TODO_BASE_URL ?? 'https://demo.playwright.dev/todomvc',
  shop: process.env.SHOP_BASE_URL ?? 'https://www.saucedemo.com',
  api: process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
};
