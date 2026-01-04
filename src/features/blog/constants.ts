export const BLOG_API_ROUTES = {
    LIST: (limit: number) => `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`,
    DETAIL: (id: string) => `https://jsonplaceholder.typicode.com/posts/${id}`,
} as const;
