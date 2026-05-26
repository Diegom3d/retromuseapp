import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { postsService } from '../services/posts';

const postTypes = [
  { value: 'artwork', label: '🎨 Obra de Arte' },
  { value: 'blog',    label: '📝 Entrada de Blog' },
  { value: 'music',   label: '🎵 Música' },
  { value: 'photo',   label: '📷 Fotografía' },
  { value: 'video',   label: '🎬 Video' },
  { value: 'poem',    label: '📖 Poema' },
];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', content: '', type: 'artwork', tags: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await postsService.create({
        title: form.title,
        content: form.content,
        type: form.type,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      toast.success('¡Publicación creada! 🎨');
      navigate('/feed');
    } catch (error: unknown) {
      const message =
        typeof error === 'object' && error !== null && 'response' in error && (error as any).response?.data?.error
          ? (error as any).response.data.error
          : 'Error al publicar';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const labelStyle = {
    fontFamily: 'var(--font-ui)', fontSize: '10px',
    color: 'var(--color-text-muted)', display: 'block',
    marginBottom: '6px', letterSpacing: '1px',
  };

  return (
    <div style={{ maxWidth: '640px' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: '13px',
        color: 'var(--color-primary)', textShadow: 'var(--glow-primary)', marginBottom: '24px',
      }}>
        ◈ Nueva Publicación
      </h1>

      <form onSubmit={handleSubmit} style={{
        background: 'var(--color-surface)', border: '2px solid var(--color-border)',
        padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        {/* Type */}
        <div>
          <label style={labelStyle}>TIPO DE PUBLICACIÓN</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {postTypes.map(({ value, label }) => (
              <button key={value} type="button"
                onClick={() => setForm({ ...form, type: value })}
                style={{
                  background: form.type === value ? 'var(--color-primary)' : 'var(--color-surface-2)',
                  border: `2px solid ${form.type === value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  color: form.type === value ? 'var(--color-bg)' : 'var(--color-text-muted)',
                  padding: '8px', cursor: 'pointer',
                  fontFamily: 'var(--font-pixel)', fontSize: '13px',
                  transition: 'all 0.2s',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>TÍTULO</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="El título de tu obra..." required />
        </div>

        <div>
          <label style={labelStyle}>DESCRIPCIÓN / CONTENIDO</label>
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
            placeholder="Cuéntanos sobre esta obra..."
            rows={6} style={{ resize: 'vertical' }} />
        </div>

        <div>
          <label style={labelStyle}>ETIQUETAS (separadas por comas)</label>
          <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
            placeholder="pintura, abstracto, 2024" />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}
          style={{ padding: '12px', fontSize: '12px' }}>
          {isLoading ? '...' : '✦ Publicar obra ✦'}
        </button>
      </form>
    </div>
  );
}
