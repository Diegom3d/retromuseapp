import { useState } from 'react';
import PostCard from '../components/posts/PostCard';
import type { Post } from '../types';

// Mock data para desarrollo
const mockPosts: Post[] = [
  {
    id: '1', user_id: 'u1', title: 'Serie: Emociones en Acrílico #3',
    content: 'Explorando la melancolía a través del color azul... Esta pieza tardó 3 semanas en completarse.',
    type: 'artwork', media_urls: [], tags: ['pintura', 'acrílico', 'abstracto'],
    is_published: true, views_count: 342, likes_count: 87, comments_count: 12,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    author: {
      id: 'ap1', user_id: 'u1', display_name: 'Lucía Pinceles',
      discipline: 'painting', followers_count: 234, following_count: 89,
      posts_count: 45, social_links: {}, guestbook_open: true,
      mood: 'Trabajando en nueva serie 🎨',
    },
  },
  {
    id: '2', user_id: 'u2', title: 'Nueva composición: "Tarde de lluvia"',
    content: 'Piano + contrabajo + ambient electrónico. Grabado durante una tarde de lluvia en Monterrey.',
    type: 'music', media_urls: [], tags: ['jazz', 'piano', 'ambient'],
    is_published: true, views_count: 156, likes_count: 52, comments_count: 8,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    author: {
      id: 'ap2', user_id: 'u2', display_name: 'Marco Sounds',
      discipline: 'music', followers_count: 178, following_count: 67,
      posts_count: 28, social_links: {}, guestbook_open: true,
      mood: 'Grabando nuevo EP 🎵',
    },
  },
];

const typeIcons: Record<string, string> = {
  artwork: '🎨', blog: '📝', music: '🎵',
  photo: '📷', video: '🎬', poem: '📖',
};

export default function FeedPage() {
  const [filter, setFilter] = useState<string>('all');

  const filters = [
    { value: 'all', label: 'Todo' },
    { value: 'artwork', label: '🎨 Obras' },
    { value: 'music', label: '🎵 Música' },
    { value: 'photo', label: '📷 Fotos' },
    { value: 'blog', label: '📝 Blog' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '14px',
          color: 'var(--color-primary)',
          textShadow: 'var(--glow-primary)',
          marginBottom: '4px',
        }}>
          ◈ Feed Artístico
        </h1>
        <p style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '16px',
          color: 'var(--color-text-muted)',
        }}>
          Las últimas creaciones de la comunidad
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={filter === value ? 'btn btn-primary' : 'btn'}
            style={{ fontSize: '10px', padding: '6px 12px' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mockPosts.filter(p => filter === 'all' || p.type === filter).map(post => (
          <PostCard key={post.id} post={post} typeIcons={typeIcons} />
        ))}
      </div>
    </div>
  );
}
