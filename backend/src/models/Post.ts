import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres';

export class Post extends Model {
  public id!: string;
  public user_id!: string;
  public category_id!: string | null;
  public title!: string;
  public content!: string | null;
  public type!: string;
  public media_urls!: any;
  public tags!: string[];
  public is_published!: boolean;
  public views_count!: number;
  public likes_count!: number;
  public comments_count!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'categories', key: 'id' },
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: true },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'artwork',
    },
    media_urls: { type: DataTypes.JSONB, defaultValue: [] },
    tags: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
    is_published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    views_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    likes_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    comments_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    sequelize,
    tableName: 'posts',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
