import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 8vw, 80px)',
        color: 'var(--color-primary)', textShadow: 'var(--glow-primary)', marginBottom: '16px',
        animation: 'glitch 1s infinite',
      }}>404</h1>
      <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '20px', color: 'var(--color-text-muted)', marginBottom: '32px' }}>
        Esta página no existe... o se perdió en el ciberespacio 🌌
      </p>
      <Link to="/" className="btn btn-primary" style={{ fontSize: '12px', padding: '12px 24px' }}>
        ✦ Volver al inicio ✦
      </Link>
    </div>
  );
}
