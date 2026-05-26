// ============================================================
// RetroMuse — TypeScript Types
// ============================================================

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'artist' | 'admin';
  created_at: string;
  profile?: ArtistProfile;
}

export interface ArtistProfile {
  id: string;
  user_id: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  location?: string;
  website?: string;
  mood?: string;
  discipline: ArtDiscipline;
  years_active?: number;
  social_links: Record<string, string>;
  guestbook_open: boolean;
  followers_count: number;
  following_count: number;
  posts_count: number;
}

export type ArtDiscipline =
  | 'painting' | 'sculpture' | 'music'
  | 'literature' | 'dance' | 'photography'
  | 'digital' | 'other';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  color_hex: string;
}

export interface Post {
  id: string;
  user_id: string;
  category_id?: string;
  title: string;
  content?: string;
  type: PostType;
  media_urls: string[];
  tags: string[];
  is_published: boolean;
  views_count: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  // Joined
  author?: ArtistProfile;
  category?: Category;
  user_has_liked?: boolean;
}

export type PostType = 'artwork' | 'blog' | 'music' | 'photo' | 'video' | 'poem';

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  is_guestbook: boolean;
  created_at: string;
  author?: ArtistProfile;
  replies?: Comment[];
}

export interface Notification {
  id: string;
  user_id: string;
  actor_id?: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  entity_type?: string;
  entity_id?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ── MongoDB Types ─────────────────────────────────────────

export interface ChatMessage {
  _id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'audio';
  mediaUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Chat {
  _id: string;
  participants: string[];
  messages: ChatMessage[];
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
  };
}

export interface ProfileCustomization {
  userId: string;
  theme: {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
  background: {
    type: 'color' | 'image' | 'gif' | 'gradient';
    value: string;
    repeat: boolean;
    fixed: boolean;
  };
  profileMusic?: {
    title: string;
    artist: string;
    url: string;
    autoplay: boolean;
  };
  cursor: {
    type: 'default' | 'sparkle' | 'heart' | 'star';
    imageUrl?: string;
  };
  stickers: Array<{
    id: string;
    imageUrl: string;
    position: { x: number; y: number };
    size: number;
  }>;
  layoutStyle: 'classic' | 'magazine' | 'minimal' | 'chaos';
}

// ── Auth ──────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  discipline?: ArtDiscipline;
}

// ── API ───────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  data: T[];
}

export interface ApiError {
  error: string;
  details?: string[];
}
