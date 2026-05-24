import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Comment, User, Post } from '../models';

export const getCommentsByPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const comments = await Comment.findAll({
      where: { post_id: req.params.postId },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] }
      ],
      order: [['created_at', 'ASC']]
    });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo comentarios' });
  }
};

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    const { postId, content, parentId, isGuestbook } = req.body;
    
    const comment = await Comment.create({
      post_id: postId,
      user_id: req.user.id,
      content,
      parent_id: parentId || null,
      is_guestbook: isGuestbook || false
    });
    
    // Incrementar conteo en el post
    const post = await Post.findByPk(postId);
    if (post) await post.increment('comments_count');
    
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creando comentario' });
  }
};

export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) { res.status(404).json({ error: 'Comentario no encontrado' }); return; }
    
    if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ error: 'No tienes permiso' }); return;
    }
    
    comment.content = req.body.content || comment.content;
    await comment.save();
    
    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error actualizando comentario' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) { res.status(404).json({ error: 'Comentario no encontrado' }); return; }
    
    if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ error: 'No tienes permiso' }); return;
    }
    
    const postId = comment.post_id;
    await comment.destroy();
    
    // Decrementar conteo
    const post = await Post.findByPk(postId);
    if (post) await post.decrement('comments_count');
    
    res.json({ message: 'Comentario eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error eliminando comentario' });
  }
};
