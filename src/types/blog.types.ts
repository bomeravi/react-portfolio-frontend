export interface Blog {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface BlogListParams {
  limit?: number;
  page?: number;
}

export interface BlogDetailParams {
  id: string;
}