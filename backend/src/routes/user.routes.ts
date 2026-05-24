// user.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
const router = Router();

router.get('/', async (_req, res) => res.json({ users: [], message: 'Listar artistas' }));
router.get('/:id', async (req, res) => res.json({ id: req.params.id }));
router.put('/:id', authenticate, async (req, res) => res.json({ message: 'Perfil actualizado' }));
router.delete('/:id', authenticate, async (req, res) => res.json({ message: 'Cuenta eliminada' }));
router.post('/:id/follow', authenticate, async (req, res) => res.json({ message: 'Siguiendo artista' }));
router.delete('/:id/follow', authenticate, async (req, res) => res.json({ message: 'Dejaste de seguir' }));
router.get('/:id/followers', async (req, res) => res.json({ followers: [] }));
router.get('/:id/following', async (req, res) => res.json({ following: [] }));

export default router;
