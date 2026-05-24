# 🎨 RetroMuse — Plataforma Creativa Retro-Social para Artistas

> Una mezcla entre blog personal estilo MySpace/Fotolog, portafolio artístico y red social creativa — solo para artistas.

---

## 📖 Descripción del Proyecto

**RetroMuse** es una plataforma web con estética de los 2000 diseñada exclusivamente para artistas (pintores, escultores, músicos, escritores, fotógrafos, bailarines y creadores digitales). Los artistas pueden publicar obras, escribir entradas de blog, personalizar su perfil con fondos y música, seguir a otros creadores, chatear y conectar en comunidades artísticas.

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                     FRONTEND                        │
│          React + TypeScript + Tailwind CSS          │
│                  Deployed: Vercel                   │
└─────────────────┬───────────────────────────────────┘
                  │ HTTP / REST API
┌─────────────────▼───────────────────────────────────┐
│                     BACKEND                         │
│             Node.js + Express + JWT                 │
│                  Deployed: Render                   │
└────────────┬────────────────────┬───────────────────┘
             │                    │
┌────────────▼──────┐  ┌──────────▼──────────────────┐
│  PostgreSQL (SQL) │  │       MongoDB (NoSQL)        │
│    8 tablas       │  │      4 colecciones           │
└───────────────────┘  └─────────────────────────────┘
```

### Stack Tecnológico

| Área        | Tecnología                          |
|-------------|-------------------------------------|
| Frontend    | React 18 + TypeScript + Tailwind CSS |
| Backend     | Node.js + Express + TypeScript       |
| SQL DB      | PostgreSQL                          |
| NoSQL DB    | MongoDB + Mongoose                  |
| Auth        | JWT + bcrypt                        |
| File Upload | Multer + Cloudinary                 |
| Hosting FE  | Vercel                              |
| Hosting BE  | Render                              |

---

## 🗄️ Bases de Datos

### PostgreSQL — 8 Tablas

| Tabla             | Descripción                              |
|-------------------|------------------------------------------|
| `users`           | Datos de autenticación y cuenta          |
| `artist_profiles` | Info artística, bio, links, disciplina   |
| `posts`           | Publicaciones (obras, blogs, videos)     |
| `comments`        | Comentarios en publicaciones             |
| `likes`           | Reacciones a posts                       |
| `followers`       | Relaciones de seguimiento                |
| `categories`      | Tipos de arte (pintura, música, etc.)    |
| `notifications`   | Alertas y notificaciones del sistema     |

### MongoDB — 4 Colecciones

| Colección        | Descripción                                |
|------------------|--------------------------------------------|
| `chats`          | Mensajes privados entre artistas           |
| `activity_logs`  | Historial de actividad del usuario         |
| `customization`  | Temas, fondos, música y estilos del perfil |
| `media_metadata` | Metadata de imágenes, audio y video        |

**Total: 12 tablas/colecciones ✅**

---

## 📁 Estructura del Proyecto

```
retromuseapp/
├── frontend/               # React + TypeScript
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # Llamadas a la API
│   │   ├── types/          # Interfaces TypeScript
│   │   └── styles/         # CSS global y temas retro
│   ├── package.json
│   └── tsconfig.json
├── backend/                # Node.js + Express
│   ├── src/
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── routes/         # Definición de rutas
│   │   ├── middleware/      # Auth, validación, errores
│   │   ├── models/         # Modelos Sequelize + Mongoose
│   │   ├── config/         # DB connections
│   │   └── utils/          # Helpers
│   ├── package.json
│   └── tsconfig.json
├── database/
│   ├── sql/                # Scripts SQL (schema + seed)
│   └── nosql/              # Scripts MongoDB (schema + seed)
├── docs/                   # Documentación API
└── README.md
```

---

## 🚀 Instalación Local

### Prerrequisitos
- Node.js >= 18
- PostgreSQL >= 14
- MongoDB >= 6
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/retromuseapp.git
cd retromuseapp
```

### 2. Configurar Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run dev
```

### 3. Configurar Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 4. Inicializar Bases de Datos
```bash
# PostgreSQL
psql -U postgres -f database/sql/schema.sql
psql -U postgres -f database/sql/seed.sql

# MongoDB (desde mongo shell o Compass)
# Importar: database/nosql/seed.json
```

---

## ⚙️ Variables de Entorno

### Backend `.env`
```env
PORT=4000
NODE_ENV=development

# PostgreSQL
DATABASE_URL=postgresql://usuario:password@localhost:5432/retromusedb

# MongoDB
MONGO_URI=mongodb://localhost:27017/retromusedb

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRES_IN=7d

# Cloudinary (subida de archivos)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Email (recuperación de contraseña)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu@email.com
SMTP_PASS=tu_app_password
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME=RetroMuse
```

---

## 🔑 Usuarios de Prueba

| Email                  | Password | Rol   |
|------------------------|----------|-------|
| admin@retromuse.com    | Admin123!| Admin |
| artista1@retromuse.com | Test123! | User  |
| artista2@retromuse.com | Test123! | User  |

---

## 🌐 URLs de Despliegue

| Servicio  | URL                                          |
|-----------|----------------------------------------------|
| Frontend  | https://retromuseapp.vercel.app              |
| Backend   | https://retromuseapp-api.onrender.com        |
| API Docs  | https://retromuseapp-api.onrender.com/api-docs |

---

## 📡 Endpoints Principales

### Auth
```
POST   /api/auth/register      — Registro de usuario
POST   /api/auth/login         — Inicio de sesión
POST   /api/auth/logout        — Cerrar sesión
POST   /api/auth/forgot-password — Solicitar reset
POST   /api/auth/reset-password  — Resetear contraseña
GET    /api/auth/me            — Usuario actual (JWT)
```

### Usuarios y Perfiles
```
GET    /api/users              — Listar artistas
GET    /api/users/:id          — Perfil de artista
PUT    /api/users/:id          — Editar perfil
DELETE /api/users/:id          — Eliminar cuenta
POST   /api/users/:id/follow   — Seguir artista
DELETE /api/users/:id/follow   — Dejar de seguir
GET    /api/users/:id/followers — Seguidores
GET    /api/users/:id/following — Siguiendo
```

### Posts
```
GET    /api/posts              — Feed de publicaciones
POST   /api/posts              — Crear publicación
GET    /api/posts/:id          — Ver publicación
PUT    /api/posts/:id          — Editar publicación
DELETE /api/posts/:id          — Eliminar publicación
GET    /api/posts/user/:userId — Posts de un artista
GET    /api/posts/category/:cat — Posts por categoría
```

### Comentarios
```
GET    /api/comments/post/:postId — Comentarios de un post
POST   /api/comments              — Crear comentario
PUT    /api/comments/:id          — Editar comentario
DELETE /api/comments/:id          — Eliminar comentario
```

### Likes
```
POST   /api/likes/:postId      — Dar like
DELETE /api/likes/:postId      — Quitar like
GET    /api/likes/:postId/count — Conteo de likes
```

### Notificaciones
```
GET    /api/notifications      — Mis notificaciones
PUT    /api/notifications/:id/read — Marcar como leída
DELETE /api/notifications/:id  — Eliminar notificación
```

### Chat (MongoDB)
```
GET    /api/chats              — Mis conversaciones
POST   /api/chats              — Iniciar conversación
GET    /api/chats/:id/messages — Mensajes de chat
POST   /api/chats/:id/messages — Enviar mensaje
```

### Personalización (MongoDB)
```
GET    /api/customization/:userId — Obtener tema
PUT    /api/customization/:userId — Guardar tema/fondo/música
```

---

## 🎨 Funcionalidades Retro-2000

- 🌈 **Perfiles personalizables**: Fondos glitter, GIFs, cursores, stickers
- 🎵 **Música de perfil**: Autoplay (con opción mute)
- 📝 **Blog artístico**: Entradas, procesos creativos, inspiración
- 💬 **Guestbook**: Libro de visitas estilo 2005
- 😊 **Mood del día**: Estado actual del artista
- 🏆 **Top artistas**: Ranking semanal por likes/seguidores
- 🖼️ **Feed artístico**: Timeline con publicaciones de seguidos
- 💌 **Chat privado**: Mensajería directa entre artistas

---

## 🔒 Seguridad

- Contraseñas hasheadas con **bcrypt** (salt rounds: 12)
- Autenticación con **JWT** (access token)
- Rutas protegidas con middleware de autenticación
- Validación de inputs con **Zod** / **express-validator**
- Rate limiting con **express-rate-limit**
- Helmet.js para headers de seguridad
- CORS configurado

---

## 📄 Licencia

MIT © 2024 RetroMuse Team
