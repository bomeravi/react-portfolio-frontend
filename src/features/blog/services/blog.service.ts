import { blogApi } from "@/lib/api";
import type { Blog, BlogFilters } from "../types/blog.interface";
import type { PaginatedResponse, SingleResponse } from "@/api/interfaces";

export const BlogService = {
  getAll(params?: BlogFilters): Promise<PaginatedResponse<Blog>> {
    return blogApi.get("/api/v1/blogs", { params }).then((res) => res.data);
  },

  getBySlug(slug: string): Promise<SingleResponse<Blog>> {
    return blogApi.get(`/api/v1/blogs/${slug}`);
  },

  getById(id: number): Promise<SingleResponse<Blog>> {
    return blogApi.get(`/api/v1/blogs/${id}`);
  },

  create(data: Partial<Blog>): Promise<SingleResponse<Blog>> {
    return blogApi.post("/api/v1/blogs", data);
  }
};
