import { User } from './User';
import { ArtistProfile } from './ArtistProfile';
import { Category } from './Category';
import { Post } from './Post';
import { Comment } from './Comment';
import { Like } from './Like';
import { Follower } from './Follower';
import { Notification } from './Notification';

// ── Asociaciones (Relaciones entre tablas) ──

// User <-> ArtistProfile (1 a 1)
User.hasOne(ArtistProfile, { foreignKey: 'user_id', as: 'profile' });
ArtistProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> Post (1 a N)
User.hasMany(Post, { foreignKey: 'user_id', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// Category <-> Post (1 a N)
Category.hasMany(Post, { foreignKey: 'category_id', as: 'posts' });
Post.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Post <-> Comment (1 a N)
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

// User <-> Comment (1 a N)
User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// Comment <-> Comment (1 a N para respuestas)
Comment.hasMany(Comment, { foreignKey: 'parent_id', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parent_id', as: 'parent' });

// Post <-> Like (1 a N)
Post.hasMany(Like, { foreignKey: 'post_id', as: 'likes' });
Like.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

// User <-> Like (1 a N)
User.hasMany(Like, { foreignKey: 'user_id', as: 'likes' });
Like.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> Follower (N a M sobre la misma tabla User)
User.belongsToMany(User, {
  through: Follower,
  as: 'followers',
  foreignKey: 'following_id',
  otherKey: 'follower_id',
});
User.belongsToMany(User, {
  through: Follower,
  as: 'following',
  foreignKey: 'follower_id',
  otherKey: 'following_id',
});

// User <-> Notification (1 a N)
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// El actor que generó la notificación
Notification.belongsTo(User, { foreignKey: 'actor_id', as: 'actor' });

export {
  User,
  ArtistProfile,
  Category,
  Post,
  Comment,
  Like,
  Follower,
  Notification,
};
