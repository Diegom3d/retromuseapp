// ============================================================
// RetroMuse — MongoDB Schemas (Mongoose)
// 4 Colecciones
// ============================================================

// ============================================================
// 1. CHATS — Mensajes privados entre artistas
// ============================================================
/*
{
  _id: ObjectId,
  participants: [userId1, userId2],   // UUIDs de PostgreSQL
  messages: [
    {
      _id: ObjectId,
      senderId: String,               // UUID de PostgreSQL
      content: String,
      type: "text" | "image" | "audio",
      mediaUrl: String,               // si aplica
      isRead: Boolean,
      readAt: Date,
      createdAt: Date
    }
  ],
  lastMessage: {
    content: String,
    senderId: String,
    createdAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
*/

// ============================================================
// 2. ACTIVITY_LOGS — Historial de actividad del usuario
// ============================================================
/*
{
  _id: ObjectId,
  userId: String,                     // UUID de PostgreSQL
  action: String,                     // "post_created", "like_given", "followed_user", etc.
  entityType: String,                 // "post", "comment", "user"
  entityId: String,                   // UUID de la entidad relacionada
  metadata: Object,                   // Info adicional flexible
  ipAddress: String,
  userAgent: String,
  createdAt: Date
}
*/

// ============================================================
// 3. CUSTOMIZATION — Temas y estilos del perfil (MySpace-style)
// ============================================================
/*
{
  _id: ObjectId,
  userId: String,                     // UUID de PostgreSQL
  theme: {
    name: String,                     // "glitter_pink", "dark_emo", "retro_80s", etc.
    primaryColor: String,             // hex
    secondaryColor: String,
    accentColor: String,
    fontFamily: String,
    fontSize: String
  },
  background: {
    type: String,                     // "color", "image", "gif", "gradient"
    value: String,                    // URL o valor CSS
    repeat: Boolean,
    fixed: Boolean
  },
  profileMusic: {
    title: String,
    artist: String,
    url: String,                      // URL de audio
    autoplay: Boolean
  },
  cursor: {
    type: String,                     // "default", "sparkle", "heart", "star"
    imageUrl: String
  },
  stickers: [
    {
      id: String,
      imageUrl: String,
      position: { x: Number, y: Number },
      size: Number
    }
  ],
  gifs: [
    {
      id: String,
      url: String,
      position: String               // "header", "sidebar", "footer"
    }
  ],
  layoutStyle: String,               // "classic", "magazine", "minimal", "chaos"
  updatedAt: Date
}
*/

// ============================================================
// 4. MEDIA_METADATA — Metadata de archivos multimedia
// ============================================================
/*
{
  _id: ObjectId,
  userId: String,                     // UUID de PostgreSQL (propietario)
  postId: String,                     // UUID de PostgreSQL (post relacionado, opcional)
  cloudinaryId: String,               // ID en Cloudinary
  url: String,                        // URL pública
  type: String,                       // "image", "audio", "video"
  format: String,                     // "jpg", "mp3", "mp4", etc.
  size: Number,                       // bytes
  duration: Number,                   // segundos (audio/video)
  dimensions: {
    width: Number,
    height: Number
  },
  colors: [String],                   // Paleta de colores dominantes (imágenes)
  tags: [String],                     // Tags generados o manuales
  altText: String,
  isNsfw: Boolean,
  uploadedAt: Date
}
*/
