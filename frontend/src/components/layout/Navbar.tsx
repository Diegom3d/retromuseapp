import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useAuthStore';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'var(--color-surface)',
      borderBottom: '2px solid var(--color-primary)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '56px',
      boxShadow: 'var(--glow-primary)',
    }}>
      {/* Logo */}
      <Link to="/" style={{
        fontFamily: 'var(--font-display)',
        fontSize: '14px',
        color: 'var(--color-primary)',
        textShadow: 'var(--glow-primary)',
        letterSpacing: '2px',
      }}>
        ✦ RETROMUSE ✦
      </Link>

      {/* Marquee ticker */}
      <div className="marquee-container" style={{ flex: 1, margin: '0 32px', opacity: 0.7 }}>
        <span className="marquee-text" style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '18px',
          color: 'var(--color-accent)',
        }}>
          ★ Bienvenido al espacio artístico del nuevo milenio ★ Comparte tu arte ★ Conecta con creadores ★ Expresa tu visión ★
        </span>
      </div>

      {/* Auth buttons */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <Link to="/crear" className="btn btn-accent" style={{ fontSize: '10px', padding: '6px 12px' }}>
              + Publicar
            </Link>
            <Link to={`/artista/${user?.id}`} style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              color: 'var(--color-text-muted)',
            }}>
              {user?.username}
            </Link>
            <button onClick={handleLogout} className="btn" style={{ fontSize: '10px', padding: '6px 12px' }}>
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">Entrar</Link>
            <Link to="/register" className="btn btn-primary">Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
}
