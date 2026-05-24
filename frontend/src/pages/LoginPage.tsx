import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('¡Bienvenido de vuelta! 🎨');
      navigate('/feed');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      toast.error(message);
    }
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
        maxWidth: '400px',
        background: 'var(--color-surface)',
        border: '2px solid var(--color-primary)',
        padding: '32px',
        boxShadow: 'var(--glow-primary)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{
            fontFamily: 'var(--font-display)',
            fontSize: '12px',
            color: 'var(--color-primary)',
            textShadow: 'var(--glow-primary)',
          }}>
            ✦ RETROMUSE ✦
          </Link>
          <h2 style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            color: 'var(--color-text)',
            marginTop: '12px',
          }}>
            Iniciar Sesión
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              color: 'var(--color-text-muted)',
              display: 'block',
              marginBottom: '6px',
              letterSpacing: '1px',
            }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="artista@email.com"
              required
            />
          </div>

          <div>
            <label style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              color: 'var(--color-text-muted)',
              display: 'block',
              marginBottom: '6px',
              letterSpacing: '1px',
            }}>
              CONTRASEÑA
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ marginTop: '8px', padding: '12px', fontSize: '12px' }}
          >
            {isLoading ? '...' : '✦ Entrar ✦'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontFamily: 'var(--font-pixel)',
          fontSize: '14px',
          color: 'var(--color-text-muted)',
        }}>
          ¿Sin cuenta?{' '}
          <Link to="/register" style={{ color: 'var(--color-accent)' }}>
            Regístrate gratis
          </Link>
        </div>

        {/* Test credentials */}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          fontFamily: 'var(--font-pixel)',
          fontSize: '13px',
          color: 'var(--color-text-muted)',
        }}>
          💡 Test: artista1@retromuse.com / Test123!
        </div>
      </div>
    </div>
  );
}
