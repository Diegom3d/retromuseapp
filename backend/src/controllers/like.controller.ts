import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Like, Post } from '../models';

export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    const { postId } = req.params;
    const userId = req.user.id;
    
    const existingLike = await Like.findOne({ where: { post_id: postId, user_id: userId } });
    const post = await Post.findByPk(postId);
    
    if (existingLike) {
      await existingLike.destroy();
      if (post) await post.decrement('likes_count');
      res.json({ message: 'Like removido', liked: false });
    } else {
      await Like.create({ post_id: postId, user_id: userId });
      if (post) await post.increment('likes_count');
      res.status(201).json({ message: 'Like añadido', liked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error toggling like' });
  }
};

export const getLikeCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const count = await Like.count({ where: { post_id: postId } });
    res.json({ postId, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo conteo de likes' });
  }
};
