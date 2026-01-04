export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  description: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  // tags: string[];
  tags: {
    slug: string;
    name: string;
  }[];
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  created_at: string;
  updated_at: string;
  reading_time?: string;
  featured_image?: string;
}

export type BlogFilters = {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
};