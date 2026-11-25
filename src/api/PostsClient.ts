import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

/** Thin typed client: tests talk about "posts", not about URLs and status codes. */
export class PostsClient {
  constructor(private readonly request: APIRequestContext) {}

  async list(params?: { userId?: number }): Promise<Post[]> {
    const res = await this.request.get('/posts', { params });
    return this.json<Post[]>(res, 200);
  }

  async get(id: number): Promise<APIResponse> {
    return this.request.get(`/posts/${id}`);
  }

  async create(post: Omit<Post, 'id'>): Promise<Post> {
    const res = await this.request.post('/posts', { data: post });
    return this.json<Post>(res, 201);
  }

  private async json<T>(res: APIResponse, expectedStatus: number): Promise<T> {
    expect(res.status(), `${res.url()} -> ${await res.text()}`).toBe(expectedStatus);
    return (await res.json()) as T;
  }
}

export function isPost(value: unknown): value is Post {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.userId === 'number' &&
    typeof v.id === 'number' &&
    typeof v.title === 'string' &&
    typeof v.body === 'string'
  );
}
