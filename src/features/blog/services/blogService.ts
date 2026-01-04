import type { Blog } from "@/types/blog.types.ts";
import { BLOG_API_ROUTES } from "../constants";


export const blogService = {
  fetchBlogs: async (limit: number = 3): Promise<Blog[]> => {
    const response = await fetch(
      BLOG_API_ROUTES.LIST(limit)
    );
    if (!response.ok) throw new Error('Failed to fetch blogs');
    return response.json();
  },

  fetchBlog: async (id: string): Promise<Blog> => {
    const response = await fetch(
      BLOG_API_ROUTES.DETAIL(id)
    );
    if (!response.ok) throw new Error('Failed to fetch blog');
    return response.json();
  },
};