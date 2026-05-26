import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../hooks/useAuthStore';
import { notificationsService } from '../../services/notifications';
import type { Notification } from '../../types';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (!isAuthenticated) return;
    notificationsService.getAll()
      .then(setNotifications)
      .catch(() => {/* silencioso */});

    // Polling cada 30 segundos
    const interval = setInterval(() => {
      notificationsService.getAll().then(setNotifications).catch(() => {});
    }, 30_000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch {}
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const notifIcons: Record<string, string> = {
    like: '♥', comment: '💬', follow: '✦', mention: '@', system: '★',
  };

  return (
    <nav style={{
      background: 'var(--color-surface)', borderBottom: '2px solid var(--color-primary)',
      padding: '0 24px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: '56px', boxShadow: 'var(--glow-primary)',
      position: 'relative', zIndex: 100,
    }}>
      {/* Logo */}
      <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--color-primary)', textShadow: 'var(--glow-primary)', letterSpacing: '2px' }}>
        ✦ RETROMUSE ✦
      </Link>

      {/* Marquee */}
      <div className="marquee-container" style={{ flex: 1, margin: '0 32px', opacity: 0.7 }}>
        <span className="marquee-text" style={{ fontFamily: 'var(--font-pixel)', fontSize: '18px', color: 'var(--color-accent)' }}>
          ★ Bienvenido al espacio artístico del nuevo milenio ★ Comparte tu arte ★ Conecta con creadores ★ Expresa tu visión ★
        </span>
      </div>

      {/* Botones derecha */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <Link to="/crear" className="btn btn-accent" style={{ fontSize: '10px', padding: '6px 12px' }}>
              + Publicar
            </Link>

            {/* Campana de notificaciones */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifs(prev => !prev)}
                style={{
                  background: 'none', border: '1px solid var(--color-border)', cursor: 'pointer',
                  padding: '4px 8px', fontFamily: 'var(--font-pixel)', fontSize: '16px',
                  color: unreadCount > 0 ? 'var(--color-accent-2)' : 'var(--color-text-muted)',
                  position: 'relative',
                }}
                title="Notificaciones"
              >
                🔔
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    background: '#ff4466', color: 'white', borderRadius: '50%',
                    width: '16px', height: '16px', fontSize: '9px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-ui)',
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Panel de notificaciones */}
              {showNotifs && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: '4px',
                  width: '280px', background: 'var(--color-surface)',
                  border: '2px solid var(--color-primary)', zIndex: 200,
                  boxShadow: '0 4px 20px #cc00ff44',
                }}>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--color-border)', fontFamily: 'var(--font-ui)', fontSize: '10px', color: 'var(--color-primary)', letterSpacing: '1px' }}>
                    ▸ NOTIFICACIONES
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.length === 0 && (
                      <div style={{ padding: '16px', fontFamily: 'var(--font-pixel)', fontSize: '13px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                        Sin notificaciones
                      </div>
                    )}
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkRead(n.id)}
                        style={{
                          padding: '10px 14px', cursor: 'pointer',
                          background: n.is_read ? 'transparent' : 'var(--color-surface-2)',
                          borderBottom: '1px solid var(--color-border)',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-2)'}
                        onMouseLeave={e => e.currentTarget.style.background = n.is_read ? 'transparent' : 'var(--color-surface-2)'}
                      >
                        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '13px', color: n.is_read ? 'var(--color-text-muted)' : 'var(--color-text)', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                          <span>{notifIcons[n.type] ?? '★'}</span>
                          <span>{n.message}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          {new Date(n.created_at).toLocaleDateString('es-MX')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to={`/artista/${user?.id}`} style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
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
