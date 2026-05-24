import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Post, User, Category } from '../models';

export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string;
    const offset = (page - 1) * limit;

    const whereClause: any = { is_published: true };
    if (category) {
      const cat = await Category.findOne({ where: { slug: category } });
      if (cat) whereClause.category_id = cat.id;
    }

    const { count, rows } = await Post.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    res.json({
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo posts' });
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    const { title, content, type, categoryId, tags, mediaUrls } = req.body;
    
    const newPost = await Post.create({
      user_id: req.user.id,
      category_id: categoryId || null,
      title,
      content,
      type,
      tags: tags || [],
      media_urls: mediaUrls || []
    });
    
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creando post' });
  }
};

export const getPostById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
      ]
    });
    
    if (!post) { res.status(404).json({ error: 'Post no encontrado' }); return; }
    
    // Incrementar vistas
    await post.increment('views_count');
    
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo post' });
  }
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    const post = await Post.findByPk(req.params.id);
    if (!post) { res.status(404).json({ error: 'Post no encontrado' }); return; }
    
    if (post.user_id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ error: 'No tienes permiso para editar este post' }); return;
    }
    
    const { title, content, type, categoryId, tags, mediaUrls } = req.body;
    
    await post.update({
      title: title || post.title,
      content: content !== undefined ? content : post.content,
      type: type || post.type,
      category_id: categoryId !== undefined ? categoryId : post.category_id,
      tags: tags || post.tags,
      media_urls: mediaUrls || post.media_urls
    });
    
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error actualizando post' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    const post = await Post.findByPk(req.params.id);
    if (!post) { res.status(404).json({ error: 'Post no encontrado' }); return; }
    
    if (post.user_id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ error: 'No tienes permiso para eliminar este post' }); return;
    }
    
    await post.destroy();
    res.json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error eliminando post' });
  }
};

export const getPostsByUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await Post.findAll({
      where: { user_id: req.params.userId },
      order: [['created_at', 'DESC']],
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
      ]
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo posts del usuario' });
  }
};
