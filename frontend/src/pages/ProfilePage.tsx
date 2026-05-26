import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usersService } from '../services/users';
import { postsService } from '../services/posts';
import { useAuthStore } from '../hooks/useAuthStore';
import type { ArtistProfile, User, Post } from '../types';
import toast from 'react-hot-toast';

const disciplineLabels: Record<string, string> = {
  painting: '🎨 Pintura', sculpture: '🗿 Escultura', music: '🎵 Música',
  literature: '📖 Literatura', dance: '💃 Danza', photography: '📷 Fotografía',
  digital: '💻 Arte Digital', other: '✦ Otro',
};

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, isAuthenticated } = useAuthStore();

  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState<ArtistProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'obras' | 'seguidores' | 'siguiendo'>('obras');
  const [following, setFollowing] = useState<ArtistProfile[]>([]);

  const typeIcons: Record<string, string> = {
    artwork: '🎨', blog: '📝', music: '🎵', photo: '📷', video: '🎬', poem: '📖',
  };

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    Promise.all([
      usersService.getProfile(id),
      postsService.getByUser(id),
      usersService.getFollowers(id),
      usersService.getFollowing(id),
    ])
      .then(([profileData, postsData, followersData, followingData]) => {
        setProfile(profileData.profile);
        setUser(profileData.user);
        setPosts(postsData.data ?? postsData as unknown as Post[]);
        setFollowers(followersData);
        setFollowing(followingData);
        // Comprobar si el usuario actual ya sigue a este artista
        if (currentUser) {
          setIsFollowing(followersData.some((f: ArtistProfile) => f.user_id === currentUser.id));
        }
      })
      .catch(() => toast.error('Error cargando perfil'))
      .finally(() => setIsLoading(false));
  }, [id, currentUser]);

  const handleFollow = async () => {
    if (!isAuthenticated) { toast.error('Inicia sesión para seguir artistas'); return; }
    setFollowLoading(true);
    try {
      await usersService.toggleFollow(id!);
      setIsFollowing(prev => !prev);
      setProfile(prev => prev ? {
        ...prev,
        followers_count: isFollowing ? prev.followers_count - 1 : prev.followers_count + 1,
      } : prev);
      toast.success(isFollowing ? 'Dejaste de seguir' : '¡Ahora sigues a este artista!');
    } catch {
      toast.error('Error al seguir/dejar de seguir');
    } finally {
      setFollowLoading(false);
    }
  };

  if (isLoading) return (
    <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--font-pixel)', color: 'var(--color-text-muted)', fontSize: '16px' }}>
      ⟳ Cargando perfil...
    </div>
  );

  if (!profile) return (
    <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--font-pixel)', color: '#ff4466', fontSize: '14px' }}>
      ⚠ No se encontró este perfil
    </div>
  );

  const isOwn = currentUser?.id === id;

  return (
    <div>
      {/* Banner */}
      <div style={{
        height: '120px', background: profile.banner_url
          ? `url(${profile.banner_url}) center/cover`
          : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
        marginBottom: '0', border: '2px solid var(--color-primary)',
        marginBottom: '-40px',
      }} />

      {/* Avatar + info */}
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
          <div style={{
            width: '80px', height: '80px',
            background: profile.avatar_url ? `url(${profile.avatar_url}) center/cover` : 'var(--color-surface-2)',
            border: '3px solid var(--color-primary)',
            boxShadow: 'var(--glow-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px',
          }}>
            {!profile.avatar_url && '🎨'}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {isOwn ? (
              <Link to="/personalizar" className="btn btn-accent" style={{ fontSize: '10px', padding: '6px 14px' }}>
                ✦ Personalizar
              </Link>
            ) : (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={isFollowing ? 'btn' : 'btn btn-primary'}
                style={{ fontSize: '10px', padding: '6px 14px' }}
              >
                {followLoading ? '...' : isFollowing ? '✓ Siguiendo' : '+ Seguir'}
              </button>
            )}
          </div>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--color-primary)', textShadow: 'var(--glow-primary)', marginBottom: '4px' }}>
          {profile.display_name}
        </h1>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
          @{user?.username} · {disciplineLabels[profile.discipline] ?? profile.discipline}
          {profile.location && ` · 📍 ${profile.location}`}
        </div>

        {profile.mood && (
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', color: 'var(--color-accent)', marginBottom: '8px' }}>
            ♪ {profile.mood}
          </div>
        )}

        {profile.bio && (
          <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '15px', color: 'var(--color-text-muted)', marginBottom: '12px', maxWidth: '500px' }}>
            {profile.bio}
          </p>
        )}

        {/* Estadísticas */}
        <div style={{ display: 'flex', gap: '24px', fontFamily: 'var(--font-ui)', fontSize: '11px' }}>
          {[
            { label: 'Obras', value: profile.posts_count },
            { label: 'Seguidores', value: profile.followers_count },
            { label: 'Siguiendo', value: profile.following_count },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', color: 'var(--color-primary)', fontFamily: 'var(--font-pixel)' }}>{value}</div>
              <div style={{ color: 'var(--color-text-muted)', letterSpacing: '1px' }}>{label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--color-border)', marginBottom: '20px' }}>
        {(['obras', 'seguidores', 'siguiendo'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '10px 18px',
            fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '1px',
            color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
            marginBottom: '-2px',
            textTransform: 'uppercase',
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Obras */}
      {activeTab === 'obras' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {posts.length === 0 && (
            <p style={{ fontFamily: 'var(--font-pixel)', color: 'var(--color-text-muted)', fontSize: '15px' }}>
              Este artista aún no ha publicado obras.
            </p>
          )}
          {posts.map(post => (
            <Link key={post.id} to={`/post/${post.id}`} style={{
              display: 'block', background: 'var(--color-surface)',
              border: '2px solid var(--color-border)', padding: '14px',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--color-text)' }}>{post.title}</span>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px' }}>{typeIcons[post.type]}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                ♥ {post.likes_count} · 💬 {post.comments_count} · 👁 {post.views_count}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Tab: Seguidores */}
      {activeTab === 'seguidores' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {followers.length === 0 && (
            <p style={{ fontFamily: 'var(--font-pixel)', color: 'var(--color-text-muted)', fontSize: '15px' }}>Aún no hay seguidores.</p>
          )}
          {followers.map(f => (
            <Link key={f.id} to={`/artista/${f.user_id}`} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              padding: '10px', transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <div style={{ width: '32px', height: '32px', background: 'var(--color-surface-2)', border: '2px solid var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                {f.avatar_url ? <img src={f.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '✦'}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--color-accent)' }}>{f.display_name}</div>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: 'var(--color-text-muted)' }}>{disciplineLabels[f.discipline]}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Tab: Siguiendo */}
      {activeTab === 'siguiendo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {following.length === 0 && (
            <p style={{ fontFamily: 'var(--font-pixel)', color: 'var(--color-text-muted)', fontSize: '15px' }}>No sigue a nadie todavía.</p>
          )}
          {following.map(f => (
            <Link key={f.id} to={`/artista/${f.user_id}`} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              padding: '10px', transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <div style={{ width: '32px', height: '32px', background: 'var(--color-surface-2)', border: '2px solid var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                {f.avatar_url ? <img src={f.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '✦'}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--color-accent)' }}>{f.display_name}</div>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: 'var(--color-text-muted)' }}>{disciplineLabels[f.discipline]}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
