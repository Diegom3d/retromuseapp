import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import toast from 'react-hot-toast';
import type { ArtDiscipline } from '../types';

const disciplines: { value: ArtDiscipline; label: string; icon: string }[] = [
  { value: 'painting',    label: 'Pintura',      icon: '🎨' },
  { value: 'music',       label: 'Música',       icon: '🎵' },
  { value: 'photography', label: 'Fotografía',   icon: '📷' },
  { value: 'literature',  label: 'Literatura',   icon: '📖' },
  { value: 'dance',       label: 'Danza',        icon: '💃' },
  { value: 'sculpture',   label: 'Escultura',    icon: '🗿' },
  { value: 'digital',     label: 'Arte Digital', icon: '💻' },
  { value: 'other',       label: 'Otra',         icon: '🎭' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    discipline: 'other' as ArtDiscipline,
  });
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success('¡Bienvenido a RetroMuse! 🎉');
      navigate('/feed');
    } catch {
      toast.error('Error al crear la cuenta');
    }
  };

  const labelStyle = {
    fontFamily: 'var(--font-ui)',
    fontSize: '10px',
    color: 'var(--color-text-muted)',
    display: 'block',
    marginBottom: '6px',
    letterSpacing: '1px',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'var(--color-surface)',
        border: '2px solid var(--color-accent)',
        padding: '32px',
        boxShadow: 'var(--glow-accent)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{
            fontFamily: 'var(--font-display)',
            fontSize: '12px',
            color: 'var(--color-primary)',
          }}>✦ RETROMUSE ✦</Link>
          <h2 style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            marginTop: '12px',
          }}>Crear Cuenta de Artista</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>NOMBRE DE USUARIO</label>
            <input
              type="text" minLength={3} maxLength={50} required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="mi_nombre_artistico"
            />
          </div>
          <div>
            <label style={labelStyle}>EMAIL</label>
            <input
              type="email" required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="yo@email.com"
            />
          </div>
          <div>
            <label style={labelStyle}>CONTRASEÑA (mín. 6 caracteres)</label>
            <input
              type="password" minLength={6} required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          {/* Discipline selector */}
          <div>
            <label style={labelStyle}>TU DISCIPLINA ARTÍSTICA</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {disciplines.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, discipline: value })}
                  style={{
                    background: form.discipline === value ? 'var(--color-primary)' : 'var(--color-surface-2)',
                    border: `2px solid ${form.discipline === value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    color: form.discipline === value ? 'var(--color-bg)' : 'var(--color-text-muted)',
                    padding: '8px 4px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '12px',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '18px' }}>{icon}</div>
                  <div style={{ marginTop: '2px', fontSize: '11px' }}>{label}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-accent"
            disabled={isLoading}
            style={{ padding: '12px', fontSize: '12px', marginTop: '8px' }}
          >
            {isLoading ? '...' : '✦ Crear mi espacio artístico ✦'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          fontFamily: 'var(--font-pixel)',
          fontSize: '14px',
          color: 'var(--color-text-muted)',
        }}>
          ¿Ya eres parte?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)' }}>
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
