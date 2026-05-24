import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Feed de publicaciones artísticas
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista de publicaciones }
 */
router.get('/', async (req, res) => {
  const { page = 1, limit = 20, category } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  // TODO: implementar con Sequelize / raw query
  res.json({
    page: Number(page),
    limit: Number(limit),
    data: [],
    message: 'Endpoint implementado — conectar con Sequelize',
  });
});

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crear nueva publicación
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, type]
 *             properties:
 *               title:      { type: string }
 *               content:    { type: string }
 *               type:       { type: string, enum: [artwork, blog, music, photo, video, poem] }
 *               categoryId: { type: string }
 *               tags:       { type: array, items: { type: string } }
 *               mediaUrls:  { type: array, items: { type: string } }
 *     responses:
 *       201: { description: Publicación creada }
 *       401: { description: No autorizado }
 */
router.post('/', authenticate, async (req, res) => {
  // TODO: implementar creación de post
  res.status(201).json({ message: 'Post creado — conectar con DB' });
});

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Obtener publicación por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Datos de la publicación }
 *       404: { description: Post no encontrado }
 */
router.get('/:id', async (req, res) => {
  res.json({ id: req.params.id, message: 'Conectar con DB' });
});

router.put('/:id', authenticate, async (req, res) => {
  res.json({ message: 'Post actualizado' });
});

router.delete('/:id', authenticate, async (req, res) => {
  res.json({ message: 'Post eliminado' });
});

router.get('/user/:userId', async (req, res) => {
  res.json({ userId: req.params.userId, posts: [] });
});

router.get('/category/:slug', async (req, res) => {
  res.json({ category: req.params.slug, posts: [] });
});

export default router;
