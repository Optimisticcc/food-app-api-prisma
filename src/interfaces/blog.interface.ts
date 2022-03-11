export interface BlogInput {
  title: string;
  summary: string;
  content: string;
  slug: string;
  userId: number;
  blogCategoryId: number;
  image: any;
}

export interface BlogUpdate {
  title?: string;
  summary?: string;
  content?: string;
  slug?: string;
  userId?: number;
  blogCategoryId?: number;
  image?: any;
}
