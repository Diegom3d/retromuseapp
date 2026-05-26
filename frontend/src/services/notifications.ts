import api from './api';
import type { Notification } from '../types';

export const notificationsService = {
  getAll: () =>
    api.get<Notification[]>('/notifications').then(r => r.data),

  markAsRead: (id: string) =>
    api.put(`/notifications/${id}/read`).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/notifications/${id}`).then(r => r.data),
};
