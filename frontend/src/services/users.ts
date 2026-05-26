import api from './api';
import type { ArtistProfile, User } from '../types';

export const usersService = {
  getProfile: (id: string) =>
    api.get<{ user: User; profile: ArtistProfile }>(`/users/${id}`).then(r => r.data),

  getFollowers: (id: string) =>
    api.get<ArtistProfile[]>(`/users/${id}/followers`).then(r => r.data),

  getFollowing: (id: string) =>
    api.get<ArtistProfile[]>(`/users/${id}/following`).then(r => r.data),

  toggleFollow: (id: string) =>
    api.post(`/users/${id}/follow`).then(r => r.data),
};
