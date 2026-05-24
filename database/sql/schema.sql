-- ============================================================
-- RetroMuse — PostgreSQL Schema
-- 8 tablas
-- ============================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USERS — Datos de autenticación y cuenta
-- ============================================================
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username      VARCHAR(50)  UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'artist' CHECK (role IN ('artist','admin')),
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  email_verified BOOLEAN     NOT NULL DEFAULT FALSE,
  reset_token   VARCHAR(255),
  reset_token_expires TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. ARTIST_PROFILES — Perfil artístico extendido
-- ============================================================
CREATE TABLE artist_profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID         NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  display_name    VARCHAR(100),
  bio             TEXT,
  avatar_url      VARCHAR(500),
  banner_url      VARCHAR(500),
  location        VARCHAR(100),
  website         VARCHAR(255),
  mood            VARCHAR(100),                          -- "Mood del día"
  discipline      VARCHAR(50) CHECK (discipline IN (
                    'painting','sculpture','music',
                    'literature','dance','photography','digital','other'
                  )),
  years_active    INTEGER,
  social_links    JSONB DEFAULT '{}',                   -- { instagram, twitter, ... }
  guestbook_open  BOOLEAN NOT NULL DEFAULT TRUE,
  followers_count INTEGER NOT NULL DEFAULT 0,
  following_count INTEGER NOT NULL DEFAULT 0,
  posts_count     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. CATEGORIES — Tipos de arte
-- ============================================================
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(50) UNIQUE NOT NULL,
  slug        VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  icon_url    VARCHAR(255),
  color_hex   VARCHAR(7) DEFAULT '#FF69B4',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed de categorías
INSERT INTO categories (name, slug, description, color_hex) VALUES
  ('Pintura',           'painting',     'Obras de arte en lienzo y papel',        '#E63946'),
  ('Escultura',         'sculpture',    'Arte tridimensional',                    '#457B9D'),
  ('Música',            'music',        'Composiciones, covers y proyectos',      '#8338EC'),
  ('Literatura',        'literature',   'Poesía, cuentos y novelas',              '#06D6A0'),
  ('Danza',             'dance',        'Performances y coreografías',            '#FFB703'),
  ('Fotografía',        'photography',  'Imágenes y series fotográficas',         '#FB5607'),
  ('Arte Digital',      'digital',      'Ilustración, diseño y arte generativo',  '#3A86FF'),
  ('Mixta',             'mixed',        'Arte que cruza disciplinas',             '#FF006E');

-- ============================================================
-- 4. POSTS — Publicaciones artísticas
-- ============================================================
CREATE TABLE posts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id  UUID         REFERENCES categories(id) ON DELETE SET NULL,
  title        VARCHAR(255) NOT NULL,
  content      TEXT,
  type         VARCHAR(20)  NOT NULL DEFAULT 'artwork' CHECK (type IN (
                 'artwork','blog','music','photo','video','poem'
               )),
  media_urls   JSONB  DEFAULT '[]',                    -- Array de URLs de media
  tags         TEXT[] DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  views_count  INTEGER NOT NULL DEFAULT 0,
  likes_count  INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. COMMENTS — Comentarios en publicaciones
-- ============================================================
CREATE TABLE comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id   UUID REFERENCES comments(id) ON DELETE CASCADE,  -- Para respuestas
  content     TEXT NOT NULL,
  is_guestbook BOOLEAN NOT NULL DEFAULT FALSE,               -- Guestbook del perfil
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. LIKES — Reacciones a publicaciones
-- ============================================================
CREATE TABLE likes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- ============================================================
-- 7. FOLLOWERS — Relaciones de seguimiento
-- ============================================================
CREATE TABLE followers (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id <> following_id)
);

-- ============================================================
-- 8. NOTIFICATIONS — Notificaciones del sistema
-- ============================================================
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  actor_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  type        VARCHAR(30) NOT NULL CHECK (type IN (
                'like','comment','follow','mention','system'
              )),
  entity_type VARCHAR(20) CHECK (entity_type IN ('post','comment','user')),
  entity_id   UUID,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_posts_user_id      ON posts(user_id);
CREATE INDEX idx_posts_category_id  ON posts(category_id);
CREATE INDEX idx_posts_created_at   ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id   ON comments(post_id);
CREATE INDEX idx_likes_post_id      ON likes(post_id);
CREATE INDEX idx_likes_user_id      ON likes(user_id);
CREATE INDEX idx_followers_follower ON followers(follower_id);
CREATE INDEX idx_followers_following ON followers(following_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- ============================================================
-- TRIGGERS — updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_artist_profiles_updated_at
  BEFORE UPDATE ON artist_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_comments_updated_at
  BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
