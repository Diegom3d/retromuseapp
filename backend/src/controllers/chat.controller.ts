import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Chat } from '../models/Chat';

export const getChats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    const chats = await Chat.find({ participants: req.user.id }).sort({ 'lastMessage.createdAt': -1 });
    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo chats' });
  }
};

export const createChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    const { participantId } = req.body;
    
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, participantId] }
    });
    
    if (!chat) {
      chat = new Chat({ participants: [req.user.id, participantId], messages: [] });
      await chat.save();
    }
    
    res.status(201).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creando chat' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    const chat = await Chat.findById(req.params.id);
    if (!chat || !chat.participants.includes(req.user.id)) {
      res.status(404).json({ error: 'Chat no encontrado' }); return;
    }
    
    res.json(chat.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo mensajes' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    const chat = await Chat.findById(req.params.id);
    if (!chat || !chat.participants.includes(req.user.id)) {
      res.status(404).json({ error: 'Chat no encontrado' }); return;
    }
    
    const { content, type, mediaUrl } = req.body;
    
    const newMessage = {
      senderId: req.user.id,
      content,
      type: type || 'text',
      mediaUrl,
      isRead: false,
      createdAt: new Date()
    };
    
    chat.messages.push(newMessage as any);
    chat.lastMessage = {
      content,
      senderId: req.user.id,
      createdAt: new Date()
    };
    
    await chat.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error enviando mensaje' });
  }
};
