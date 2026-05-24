import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { User, ArtistProfile } from '../models';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role', 'created_at'],
      include: [{ model: ArtistProfile, as: 'profile' }]
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo usuarios' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'role', 'created_at'],
      include: [{ model: ArtistProfile, as: 'profile' }]
    });
    
    if (!user) { res.status(404).json({ error: 'Usuario no encontrado' }); return; }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo usuario' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      res.status(403).json({ error: 'No tienes permiso para editar este perfil' }); return;
    }
    
    const profile = await ArtistProfile.findOne({ where: { user_id: req.params.id } });
    if (!profile) { res.status(404).json({ error: 'Perfil no encontrado' }); return; }
    
    const { display_name, bio, avatar_url, banner_url, location, website, mood, discipline, years_active, social_links, guestbook_open } = req.body;
    
    await profile.update({
      display_name: display_name !== undefined ? display_name : profile.display_name,
      bio: bio !== undefined ? bio : profile.bio,
      avatar_url: avatar_url !== undefined ? avatar_url : profile.avatar_url,
      banner_url: banner_url !== undefined ? banner_url : profile.banner_url,
      location: location !== undefined ? location : profile.location,
      website: website !== undefined ? website : profile.website,
      mood: mood !== undefined ? mood : profile.mood,
      discipline: discipline !== undefined ? discipline : profile.discipline,
      years_active: years_active !== undefined ? years_active : profile.years_active,
      social_links: social_links !== undefined ? social_links : profile.social_links,
      guestbook_open: guestbook_open !== undefined ? guestbook_open : profile.guestbook_open
    });
    
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error actualizando perfil' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      res.status(403).json({ error: 'No tienes permiso para eliminar esta cuenta' }); return;
    }
    
    const user = await User.findByPk(req.params.id);
    if (!user) { res.status(404).json({ error: 'Usuario no encontrado' }); return; }
    
    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error eliminando usuario' });
  }
};
