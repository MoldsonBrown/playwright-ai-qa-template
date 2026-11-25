import { test, expect } from '../../src/fixtures';
import { isPost } from '../../src/api/PostsClient';

test.describe('Posts API', () => {
  test('GET /posts/:id returns a well-formed post', async ({ posts }) => {
    const res = await posts.get(1);

    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');
    const body: unknown = await res.json();
    expect(isPost(body)).toBe(true);
    expect(body).toMatchObject({ id: 1, userId: 1 });
  });

  test('GET /posts filters by userId', async ({ posts }) => {
    const list = await posts.list({ userId: 2 });

    expect(list.length).toBeGreaterThan(0);
    expect(list.every((p) => p.userId === 2 && isPost(p))).toBe(true);
  });

  test('POST /posts creates a post and echoes the payload', async ({ posts }) => {
    const payload = { userId: 7, title: 'Stable suites', body: 'No hard waits.' };

    const created = await posts.create(payload);

    expect(created).toMatchObject(payload);
    expect(typeof created.id).toBe('number');
  });

  test('GET /posts/:id returns 404 for a missing post', async ({ posts }) => {
    const res = await posts.get(999_999);
    expect(res.status()).toBe(404);
  });
});
