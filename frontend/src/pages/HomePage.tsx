import { Link } from 'react-router-dom';

const disciplineIcons = ['🎨','🎵','📷','💃','📖','🗿','💻','🎭'];

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background stars */}
      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: i % 5 === 0 ? '4px' : '2px',
          height: i % 5 === 0 ? '4px' : '2px',
          background: i % 3 === 0 ? 'var(--color-primary)' : i % 3 === 1 ? 'var(--color-accent)' : 'var(--color-star)',
          boxShadow: `0 0 4px currentColor`,
          animation: `sparkle ${1.5 + Math.random() * 2}s infinite ${Math.random() * 2}s`,
          borderRadius: '50%',
        }} />
      ))}

      {/* Logo */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(18px, 5vw, 40px)',
        color: 'var(--color-primary)',
        textShadow: '0 0 10px #cc00ff, 0 0 30px #cc00ff55, 0 0 60px #cc00ff22',
        marginBottom: '8px',
        letterSpacing: '4px',
        animation: 'pulse-glow 2s ease-in-out infinite',
      }}>
        ✦ RETROMUSE ✦
      </h1>

      <p style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: '22px',
        color: 'var(--color-accent)',
        textShadow: 'var(--glow-accent)',
        marginBottom: '32px',
        letterSpacing: '2px',
      }}>
        El espacio artístico del nuevo milenio
      </p>

      {/* Discipline icons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '48px',
        fontSize: '28px',
      }}>
        {disciplineIcons.map((icon, i) => (
          <span key={i} style={{
            animation: `float ${2 + i * 0.3}s ease-in-out infinite ${i * 0.2}s`,
            display: 'inline-block',
          }}>
            {icon}
          </span>
        ))}
      </div>

      {/* Description */}
      <div style={{
        maxWidth: '600px',
        background: 'var(--color-surface)',
        border: '2px solid var(--color-border)',
        padding: '24px',
        marginBottom: '40px',
        position: 'relative',
      }}>
        <p style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '18px',
          color: 'var(--color-text)',
          lineHeight: 1.8,
        }}>
          Un lugar solo para artistas 💜<br />
          Comparte tus obras, escribe en tu blog,<br />
          personaliza tu espacio y conecta<br />
          con otros creadores del mundo.
        </p>
      </div>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/register" className="btn btn-primary" style={{ fontSize: '12px', padding: '12px 24px' }}>
          ✦ Únete gratis ✦
        </Link>
        <Link to="/feed" className="btn btn-accent" style={{ fontSize: '12px', padding: '12px 24px' }}>
          Ver el Feed
        </Link>
        <Link to="/login" className="btn" style={{ fontSize: '12px', padding: '12px 24px' }}>
          Ya tengo cuenta
        </Link>
      </div>

      {/* Retro footer text */}
      <p style={{
        position: 'absolute',
        bottom: '20px',
        fontFamily: 'var(--font-pixel)',
        fontSize: '14px',
        color: 'var(--color-text-muted)',
      }}>
        Hecho con 💜 para artistas únicos • RetroMuse 2024 • Best viewed in 1024x768
      </p>
    </div>
  );
}
