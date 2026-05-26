import api from './api';
import type { Post, PaginatedResponse } from '../types';

export const postsService = {
  getFeed: (params?: { type?: string; category?: string; page?: number }) =>
    api.get<PaginatedResponse<Post>>('/posts', { params }).then(r => r.data),

  getById: (id: string) =>
    api.get<Post>(`/posts/${id}`).then(r => r.data),

  getByUser: (userId: string) =>
    api.get<PaginatedResponse<Post>>(`/posts/user/${userId}`).then(r => r.data),

  create: (payload: { title: string; content?: string; type: string; tags: string[] }) =>
    api.post<Post>('/posts', payload).then(r => r.data),

  toggleLike: (postId: string) =>
    api.post<{ liked: boolean }>(`/likes/${postId}`).then(r => r.data),
};
