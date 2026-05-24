import { useState } from 'react';
import toast from 'react-hot-toast';

const themes = [
  { name: 'glitter_pink', label: 'Glitter Rosa', primary: '#ff69b4', accent: '#ff1493' },
  { name: 'dark_emo',     label: 'Dark Emo',     primary: '#8b0000', accent: '#000000' },
  { name: 'retro_80s',    label: 'Retro 80s',    primary: '#00ffff', accent: '#ff00ff' },
  { name: 'nature',       label: 'Naturaleza',   primary: '#228b22', accent: '#90ee90' },
  { name: 'galaxy',       label: 'Galaxia',      primary: '#6600cc', accent: '#00ccff' },
  { name: 'sunset',       label: 'Atardecer',    primary: '#ff6600', accent: '#ff9900' },
];

const cursors = [
  { value: 'default',  label: '🖱️ Normal' },
  { value: 'sparkle',  label: '✨ Destello' },
  { value: 'heart',    label: '💖 Corazón' },
  { value: 'star',     label: '⭐ Estrella' },
];

export default function CustomizePage() {
  const [selectedTheme, setSelectedTheme] = useState('galaxy');
  const [selectedCursor, setSelectedCursor] = useState('sparkle');
  const [musicUrl, setMusicUrl] = useState('');
  const [mood, setMood] = useState('');

  const handleSave = () => {
    toast.success('¡Perfil personalizado! 🎨');
  };

  return (
    <div style={{ maxWidth: '640px' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: '12px',
        color: 'var(--color-primary)', textShadow: 'var(--glow-primary)', marginBottom: '8px',
      }}>
        ◈ Personalizar Perfil
      </h1>
      <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '15px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
        Hazlo tuyo — estilo MySpace 2005
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Themes */}
        <section style={{ background: 'var(--color-surface)', border: '2px solid var(--color-border)', padding: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--color-accent)', marginBottom: '12px', letterSpacing: '1px' }}>
            TEMA DE COLOR
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {themes.map(({ name, label, primary, accent }) => (
              <button key={name} onClick={() => setSelectedTheme(name)}
                style={{
                  background: `linear-gradient(135deg, ${primary}33, ${accent}33)`,
                  border: `2px solid ${selectedTheme === name ? primary : 'var(--color-border)'}`,
                  padding: '12px 8px', cursor: 'pointer',
                  fontFamily: 'var(--font-pixel)', fontSize: '13px',
                  color: selectedTheme === name ? primary : 'var(--color-text-muted)',
                  boxShadow: selectedTheme === name ? `0 0 8px ${primary}` : 'none',
                  transition: 'all 0.2s',
                }}>
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Cursor */}
        <section style={{ background: 'var(--color-surface)', border: '2px solid var(--color-border)', padding: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--color-accent)', marginBottom: '12px', letterSpacing: '1px' }}>
            CURSOR
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {cursors.map(({ value, label }) => (
              <button key={value} onClick={() => setSelectedCursor(value)}
                className={selectedCursor === value ? 'btn btn-primary' : 'btn'}
                style={{ fontSize: '11px', padding: '6px 12px' }}>
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Music */}
        <section style={{ background: 'var(--color-surface)', border: '2px solid var(--color-border)', padding: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--color-accent)', marginBottom: '12px', letterSpacing: '1px' }}>
            🎵 MÚSICA DE PERFIL
          </h3>
          <input value={musicUrl} onChange={e => setMusicUrl(e.target.value)}
            placeholder="URL de archivo de audio (mp3, ogg...)" />
          <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            Se reproducirá al entrar a tu perfil
          </p>
        </section>

        {/* Mood */}
        <section style={{ background: 'var(--color-surface)', border: '2px solid var(--color-border)', padding: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--color-accent)', marginBottom: '12px', letterSpacing: '1px' }}>
            MOOD DEL DÍA
          </h3>
          <input value={mood} onChange={e => setMood(e.target.value)}
            placeholder="ej: Trabajando en nueva pintura 🎨" maxLength={100} />
        </section>

        <button onClick={handleSave} className="btn btn-accent" style={{ padding: '12px', fontSize: '12px' }}>
          ✦ Guardar personalización ✦
        </button>
      </div>
    </div>
  );
}
