import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsService } from '../services/posts';
import { useAuthStore } from '../hooks/useAuthStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import type { Post, Comment } from '../types';

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  const typeIcons: Record<string, string> = {
    artwork: '🎨', blog: '📝', music: '🎵', photo: '📷', video: '🎬', poem: '📖',
  };

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    Promise.all([
      postsService.getById(id),
      api.get<Comment[]>(`/comments/${id}`).then(r => r.data).catch(() => []),
    ])
      .then(([postData, commentsData]) => {
        setPost(postData);
        setLiked(postData.user_has_liked ?? false);
        setLikesCount(postData.likes_count);
        setComments(commentsData);
      })
      .catch(() => toast.error('Error cargando la publicación'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) { toast.error('Inicia sesión para dar like'); return; }
    try {
      const result = await postsService.toggleLike(id!);
      setLiked(result.liked);
      setLikesCount(prev => result.liked ? prev + 1 : prev - 1);
    } catch {
      toast.error('Error al registrar el like');
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    if (!isAuthenticated) { toast.error('Inicia sesión para comentar'); return; }
    setCommentLoading(true);
    try {
      const { data } = await api.post<Comment>('/comments', { post_id: id, content: newComment });
      setComments(prev => [data, ...prev]);
      setNewComment('');
      toast.success('Comentario publicado ✦');
    } catch {
      toast.error('Error al comentar');
    } finally {
      setCommentLoading(false);
    }
  };

  if (isLoading) return (
    <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--font-pixel)', color: 'var(--color-text-muted)', fontSize: '16px' }}>
      ⟳ Cargando publicación...
    </div>
  );

  if (!post) return (
    <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--font-pixel)', color: '#ff4466', fontSize: '14px' }}>
      ⚠ Publicación no encontrada
    </div>
  );

  return (
    <div style={{ maxWidth: '700px' }}>
      {/* Header */}
      <div style={{ background: 'var(--color-surface)', border: '2px solid var(--color-primary)', padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '18px', padding: '4px 10px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
            {typeIcons[post.type] ?? '✦'} {post.type}
          </span>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '13px', color: 'var(--color-text-muted)' }}>
            {new Date(post.created_at).toLocaleDateString('es-MX')}
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--color-primary)', textShadow: 'var(--glow-primary)', marginBottom: '12px' }}>
          {post.title}
        </h1>

        {post.author && (
          <Link to={`/artista/${post.user_id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', textDecoration: 'none' }}>
            <div style={{ width: '28px', height: '28px', background: 'var(--color-surface-2)', border: '2px solid var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✦</div>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--color-accent)' }}>{post.author.display_name}</span>
          </Link>
        )}

        {post.content && (
          <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '16px', color: 'var(--color-text-muted)', lineHeight: '1.8', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
            {post.content}
          </p>
        )}

        {post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {post.tags.map(tag => (
              <span key={tag} style={{ fontFamily: 'var(--font-pixel)', fontSize: '13px', color: 'var(--color-accent-2)', background: 'var(--color-surface-2)', padding: '2px 8px', border: '1px solid var(--color-accent-2)' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Acciones */}
        <div style={{ display: 'flex', gap: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-border)', fontFamily: 'var(--font-pixel)', fontSize: '16px' }}>
          <button onClick={handleLike} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: liked ? 'var(--color-accent-2)' : 'var(--color-text-muted)',
            fontFamily: 'var(--font-pixel)', fontSize: '16px', transition: 'color 0.2s',
          }}>
            {liked ? '♥' : '♡'} {likesCount}
          </button>
          <span style={{ color: 'var(--color-text-muted)' }}>💬 {comments.length}</span>
          <span style={{ color: 'var(--color-text-muted)' }}>👁 {post.views_count}</span>
        </div>
      </div>

      {/* Sección de comentarios */}
      <div id="comments" style={{ background: 'var(--color-surface)', border: '2px solid var(--color-border)', padding: '20px' }}>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--color-primary)', letterSpacing: '2px', marginBottom: '16px' }}>
          ▸ COMENTARIOS ({comments.length})
        </h2>

        {/* Caja de nuevo comentario */}
        {isAuthenticated && (
          <div style={{ marginBottom: '20px' }}>
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario..."
              rows={3}
              style={{ width: '100%', resize: 'vertical', marginBottom: '8px', boxSizing: 'border-box' }}
            />
            <button
              onClick={handleComment}
              disabled={commentLoading || !newComment.trim()}
              className="btn btn-primary"
              style={{ fontSize: '10px', padding: '8px 16px' }}
            >
              {commentLoading ? '...' : '✦ Comentar'}
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            <Link to="/login" style={{ color: 'var(--color-accent)' }}>Inicia sesión</Link> para comentar.
          </p>
        )}

        {/* Lista de comentarios */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {comments.length === 0 && (
            <p style={{ fontFamily: 'var(--font-pixel)', color: 'var(--color-text-muted)', fontSize: '14px' }}>
              Sé el primero en comentar.
            </p>
          )}
          {comments.map(comment => (
            <div key={comment.id} style={{ borderLeft: '2px solid var(--color-border)', paddingLeft: '12px' }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', color: 'var(--color-accent)', marginBottom: '4px' }}>
                {comment.author?.display_name ?? 'Artista'} · {new Date(comment.created_at).toLocaleDateString('es-MX')}
              </div>
              <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', color: 'var(--color-text-muted)' }}>
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
