import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Customization } from '../models/Customization';

export const getCustomization = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let customization = await Customization.findOne({ userId: req.params.userId });
    
    if (!customization) {
      customization = new Customization({ userId: req.params.userId });
      await customization.save();
    }
    
    res.json(customization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo configuración del perfil' });
  }
};

export const updateCustomization = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      res.status(403).json({ error: 'No tienes permiso' }); return;
    }
    
    let customization = await Customization.findOne({ userId: req.params.userId });
    if (!customization) {
      customization = new Customization({ userId: req.params.userId });
    }
    
    const { theme, background, profileMusic, cursor, stickers, gifs, layoutStyle } = req.body;
    
    if (theme) customization.theme = { ...customization.theme, ...theme };
    if (background) customization.background = { ...customization.background, ...background };
    if (profileMusic) customization.profileMusic = { ...customization.profileMusic, ...profileMusic };
    if (cursor) customization.cursor = { ...customization.cursor, ...cursor };
    if (stickers) customization.stickers = stickers;
    if (gifs) customization.gifs = gifs;
    if (layoutStyle) customization.layoutStyle = layoutStyle;
    
    await customization.save();
    res.json(customization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error guardando configuración del perfil' });
  }
};
