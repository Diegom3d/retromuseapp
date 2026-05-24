-- ============================================================
-- RetroMuse — Seed Data (PostgreSQL)
-- ============================================================

-- Insertar usuarios de prueba
-- Passwords: Admin123! y Test123! (bcrypt hash de ejemplo)
INSERT INTO users (id, username, email, password_hash, role, email_verified) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'admin_retromuse', 'admin@retromuse.com',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/o.k.pUvVC', 'admin', TRUE),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'lucia_pinceles', 'artista1@retromuse.com',
   '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uJIiIlmoby', 'artist', TRUE),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'marco_sounds', 'artista2@retromuse.com',
   '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uJIiIlmoby', 'artist', TRUE);

-- Perfiles artísticos
INSERT INTO artist_profiles (user_id, display_name, bio, discipline, location, mood) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Admin RetroMuse', 'Administrador de la plataforma', 'digital', 'Ciudad de México', 'Gestionando la plataforma ✨'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'Lucía Pinceles', 'Pintora contemporánea apasionada por el color y la emoción.', 'painting', 'Guadalajara, MX', 'Trabajando en nueva serie 🎨'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'Marco Sounds', 'Músico y compositor. Jazz, electrónica y todo lo que suene bonito.', 'music', 'Monterrey, MX', 'Grabando nuevo EP 🎵');

-- Posts de ejemplo
INSERT INTO posts (user_id, category_id, title, content, type, tags) VALUES
  ('a1b2c3d4-0002-0002-0002-000000000002',
   (SELECT id FROM categories WHERE slug = 'painting'),
   'Serie: Emociones en Acrílico #1',
   'Empecé esta serie inspirada en los estados de ánimo que nadie puede nombrar. El amarillo ocre representa esa nostalgia dulce de los recuerdos felices...',
   'artwork',
   ARRAY['pintura','acrílico','emociones','abstracto']),
  ('a1b2c3d4-0003-0003-0003-000000000003',
   (SELECT id FROM categories WHERE slug = 'music'),
   'Nueva composición: "Tarde de lluvia en Monterrey"',
   'Compuse esta pieza durante una tarde lluviosa. Piano, contrabajo y algo de electrónica ambient. Pueden escuchar el proceso en el link.',
   'music',
   ARRAY['jazz','piano','composición','ambient']);
