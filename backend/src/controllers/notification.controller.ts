import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Notification, User } from '../models';

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: User, as: 'actor', attributes: ['id', 'username'] }
      ],
      order: [['created_at', 'DESC']],
      limit: 50
    });
    
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo notificaciones' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) { res.status(404).json({ error: 'Notificación no encontrada' }); return; }
    
    if (notification.user_id !== req.user.id) {
      res.status(403).json({ error: 'No tienes permiso' }); return;
    }
    
    notification.is_read = true;
    await notification.save();
    
    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error actualizando notificación' });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) { res.status(404).json({ error: 'Notificación no encontrada' }); return; }
    
    if (notification.user_id !== req.user.id) {
      res.status(403).json({ error: 'No tienes permiso' }); return;
    }
    
    await notification.destroy();
    res.json({ message: 'Notificación eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error eliminando notificación' });
  }
};
