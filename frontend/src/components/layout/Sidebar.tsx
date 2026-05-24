import { Link } from 'react-router-dom';

const categories = [
  { slug: 'painting',     name: 'Pintura',      icon: '🎨' },
  { slug: 'music',        name: 'Música',       icon: '🎵' },
  { slug: 'photography',  name: 'Fotografía',   icon: '📷' },
  { slug: 'literature',   name: 'Literatura',   icon: '📖' },
  { slug: 'dance',        name: 'Danza',        icon: '💃' },
  { slug: 'sculpture',    name: 'Escultura',    icon: '🗿' },
  { slug: 'digital',      name: 'Arte Digital', icon: '💻' },
];

export default function Sidebar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Navigation */}
      <section>
        <h3 style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '10px',
          color: 'var(--color-primary)',
          textShadow: 'var(--glow-primary)',
          marginBottom: '8px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          ▸ Navegar
        </h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { to: '/feed', label: '◈ Feed Artístico' },
            { to: '/feed?top=true', label: '★ Top Artistas' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '16px',
              color: 'var(--color-text-muted)',
              padding: '4px 8px',
              borderLeft: '2px solid transparent',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.color = 'var(--color-primary)';
              el.style.borderLeftColor = 'var(--color-primary)';
              el.style.textShadow = 'var(--glow-primary)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.color = 'var(--color-text-muted)';
              el.style.borderLeftColor = 'transparent';
              el.style.textShadow = 'none';
            }}>
              {label}
            </Link>
          ))}
        </nav>
      </section>

      {/* Categories */}
      <section>
        <h3 style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '10px',
          color: 'var(--color-accent)',
          textShadow: 'var(--glow-accent)',
          marginBottom: '8px',
          letterSpacing: '2px',
        }}>
          ▸ Categorías
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {categories.map(({ slug, name, icon }) => (
            <Link key={slug} to={`/feed?category=${slug}`} style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '16px',
              color: 'var(--color-text-muted)',
              padding: '3px 8px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}>
              {icon} {name}
            </Link>
          ))}
        </div>
      </section>

      {/* Retro "online" indicator */}
      <section style={{
        borderTop: '1px solid var(--color-border)',
        paddingTop: '16px',
        fontFamily: 'var(--font-pixel)',
        fontSize: '14px',
        color: 'var(--color-text-muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#00ff88', textShadow: '0 0 6px #00ff88' }}>●</span>
          Artistas online: <span style={{ color: 'var(--color-accent)' }}>42</span>
        </div>
        <div style={{ marginTop: '8px' }}>
          Obras hoy: <span style={{ color: 'var(--color-primary)' }}>137</span>
        </div>
      </section>
    </div>
  );
}
