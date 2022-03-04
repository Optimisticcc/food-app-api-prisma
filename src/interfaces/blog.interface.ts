export interface BlogInput {
  title: string;
  summary: string;
  content: string;
  slug: string;
}

export interface BlogUpdate {
  title?: string;
  summary?: string;
  content?: string;
  slug?: string;
}
