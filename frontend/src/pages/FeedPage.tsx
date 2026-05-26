import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../components/posts/PostCard';
import { postsService } from '../services/posts';
import type { Post } from '../types';

const typeIcons: Record<string, string> = {
  artwork: '🎨', blog: '📝', music: '🎵',
  photo: '📷', video: '🎬', poem: '📖',
};

export default function FeedPage() {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<string>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = [
    { value: 'all',     label: 'Todo' },
    { value: 'artwork', label: '🎨 Obras' },
    { value: 'music',   label: '🎵 Música' },
    { value: 'photo',   label: '📷 Fotos' },
    { value: 'blog',    label: '📝 Blog' },
    { value: 'poem',    label: '📖 Poemas' },
  ];

  useEffect(() => {
    const category = searchParams.get('category') ?? undefined;
    const type = filter !== 'all' ? filter : undefined;

    setIsLoading(true);
    setError(null);

    postsService.getFeed({ type, category })
      .then(data => setPosts(data.data ?? data as unknown as Post[]))
      .catch(() => setError('No se pudo cargar el feed. ¿El servidor está corriendo?'))
      .finally(() => setIsLoading(false));
  }, [filter, searchParams]);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '14px',
          color: 'var(--color-primary)', textShadow: 'var(--glow-primary)', marginBottom: '4px',
        }}>
          ◈ Feed Artístico
        </h1>
        <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '16px', color: 'var(--color-text-muted)' }}>
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

      {/* Estado: cargando */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '48px 0', fontFamily: 'var(--font-pixel)', color: 'var(--color-text-muted)', fontSize: '16px' }}>
          ⟳ Cargando obras...
        </div>
      )}

      {/* Estado: error */}
      {error && !isLoading && (
        <div style={{
          background: 'var(--color-surface)', border: '2px solid #ff4466',
          padding: '20px', textAlign: 'center',
          fontFamily: 'var(--font-pixel)', color: '#ff4466', fontSize: '14px',
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Estado: sin posts */}
      {!isLoading && !error && posts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', fontFamily: 'var(--font-pixel)', color: 'var(--color-text-muted)', fontSize: '16px' }}>
          No hay publicaciones en esta categoría todavía.
        </div>
      )}

      {/* Posts */}
      {!isLoading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} typeIcons={typeIcons} />
          ))}
        </div>
      )}
    </div>
  );
}
