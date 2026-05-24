import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Follower, ArtistProfile, User } from '../models';

export const toggleFollow = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'No autorizado' }); return; }
    
    const followerId = req.user.id;
    const followingId = req.params.id; // User ID to follow
    
    if (followerId === followingId) {
      res.status(400).json({ error: 'No puedes seguirte a ti mismo' }); return;
    }
    
    const existingFollow = await Follower.findOne({ where: { follower_id: followerId, following_id: followingId } });
    
    const followerProfile = await ArtistProfile.findOne({ where: { user_id: followerId } });
    const followingProfile = await ArtistProfile.findOne({ where: { user_id: followingId } });
    
    if (existingFollow) {
      await existingFollow.destroy();
      if (followerProfile) await followerProfile.decrement('following_count');
      if (followingProfile) await followingProfile.decrement('followers_count');
      res.json({ message: 'Dejaste de seguir', followed: false });
    } else {
      await Follower.create({ follower_id: followerId, following_id: followingId });
      if (followerProfile) await followerProfile.increment('following_count');
      if (followingProfile) await followingProfile.increment('followers_count');
      res.status(201).json({ message: 'Ahora sigues a este artista', followed: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error toggling follow' });
  }
};

export const getFollowers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: User, as: 'followers', attributes: ['id', 'username'] }]
    });
    if (!user) { res.status(404).json({ error: 'Usuario no encontrado' }); return; }
    
    // @ts-ignore
    res.json(user.followers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo seguidores' });
  }
};

export const getFollowing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: User, as: 'following', attributes: ['id', 'username'] }]
    });
    if (!user) { res.status(404).json({ error: 'Usuario no encontrado' }); return; }
    
    // @ts-ignore
    res.json(user.following);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo seguidos' });
  }
};
