// ProfilePage.tsx
import { useParams } from 'react-router-dom';
export default function ProfilePage() {
  const { id } = useParams();
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--color-primary)', textShadow: 'var(--glow-primary)' }}>
        ◈ Perfil del Artista
      </h1>
      <p style={{ fontFamily: 'var(--font-pixel)', color: 'var(--color-text-muted)', marginTop: '12px', fontSize: '16px' }}>
        ID: {id} — Conectar con API para cargar perfil
      </p>
    </div>
  );
}
