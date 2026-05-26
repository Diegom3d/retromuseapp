import { Link } from 'react-router-dom';
import { useState } from 'react';
import { postsService } from '../../services/posts';
import { useAuthStore } from '../../hooks/useAuthStore';
import toast from 'react-hot-toast';
import type { Post } from '../../types';

interface Props {
  post: Post;
  typeIcons: Record<string, string>;
}

export default function PostCard({ post, typeIcons }: Props) {
  const { isAuthenticated } = useAuthStore();
  const [liked, setLiked] = useState(post.user_has_liked ?? false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Inicia sesión para dar like');
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);
    // Actualización optimista
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
    try {
      const result = await postsService.toggleLike(post.id);
      setLiked(result.liked);
      setLikesCount(prev => {
        // Ajustar si el servidor difiere del estado optimista
        if (result.liked !== newLiked) return result.liked ? prev + 1 : prev - 1;
        return prev;
      });
    } catch {
      // Revertir si falla
      setLiked(!newLiked);
      setLikesCount(prev => newLiked ? prev - 1 : prev + 1);
      toast.error('Error al registrar like');
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <article
      style={{
        background: 'var(--color-surface)', border: '2px solid var(--color-border)',
        padding: '20px', transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--color-primary)';
        e.currentTarget.style.boxShadow = '0 0 12px #cc00ff33';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Autor y tipo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', background: 'var(--color-surface-2)',
            border: '2px solid var(--color-primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '18px',
          }}>
            {post.author?.discipline === 'painting' ? '🎨' : post.author?.discipline === 'music' ? '🎵' : '✦'}
          </div>
          <div>
            <Link to={`/artista/${post.user_id}`} style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--color-accent)' }}>
              {post.author?.display_name ?? 'Artista'}
            </Link>
            {post.author?.mood && (
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {post.author.mood}
              </div>
            )}
          </div>
        </div>
        <span style={{
          fontFamily: 'var(--font-pixel)', fontSize: '18px', padding: '4px 8px',
          background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
        }}>
          {typeIcons[post.type] ?? '✦'} {post.type}
        </span>
      </div>

      {/* Título */}
      <Link to={`/post/${post.id}`}>
        <h2
          style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-text)', marginBottom: '8px', transition: 'color 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text)'; }}
        >
          {post.title}
        </h2>
      </Link>

      {/* Contenido */}
      {post.content && (
        <p style={{
          fontFamily: 'var(--font-pixel)', fontSize: '15px', color: 'var(--color-text-muted)',
          marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {post.content}
        </p>
      )}

      {/* Etiquetas */}
      {post.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {post.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: 'var(--font-pixel)', fontSize: '13px', color: 'var(--color-accent-2)',
              background: 'var(--color-surface-2)', padding: '2px 8px', border: '1px solid var(--color-accent-2)',
            }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Acciones */}
      <div style={{
        display: 'flex', gap: '16px', paddingTop: '12px',
        borderTop: '1px solid var(--color-border)',
        fontFamily: 'var(--font-pixel)', fontSize: '15px',
      }}>
        <button
          onClick={handleLike}
          style={{
            background: 'none', border: 'none', cursor: likeLoading ? 'wait' : 'pointer',
            color: liked ? 'var(--color-accent-2)' : 'var(--color-text-muted)',
            fontFamily: 'var(--font-pixel)', fontSize: '15px', transition: 'color 0.2s',
            opacity: likeLoading ? 0.6 : 1,
          }}
        >
          {liked ? '♥' : '♡'} {likesCount}
        </button>
        <Link to={`/post/${post.id}#comments`} style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-pixel)', fontSize: '15px' }}>
          💬 {post.comments_count}
        </Link>
        <span style={{ color: 'var(--color-text-muted)' }}>👁 {post.views_count}</span>
      </div>
    </article>
  );
}
