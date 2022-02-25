import { PostType, StatusPost } from '@prisma/client';

export interface AddPostInput {
  title: string;
  removeVietnameseTitle: string;
  header?: string;
  summary?: string;
  image: string;
  tags: string[];
  author: string;
  type: PostType;
  status?: StatusPost;
  publicAt?: Date;
  userId?: number;
  code: string;
  categories: number[];
}

export interface UpdatePostInput {
  title?: string;
  removeVietnameseTitle?: string;
  header?: string;
  summary?: string;
  image?: string;
  tags?: string[];
  author?: string;
  type: PostType;
  status?: StatusPost;
  publicAt?: Date;
  updatedBy?: number;
  categories: number[];
}

export interface AddPostDetail {
  content: string;
  enable: boolean;
  postId: number;
  createdBy: number;
}

export interface EditPostDetail {
  content?: string;
  enable?: boolean;
  updatedBy?: number;
}
