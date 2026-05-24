import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres';

export class ArtistProfile extends Model {
  public id!: string;
  public user_id!: string;
  public display_name!: string | null;
  public bio!: string | null;
  public avatar_url!: string | null;
  public banner_url!: string | null;
  public location!: string | null;
  public website!: string | null;
  public mood!: string | null;
  public discipline!: string | null;
  public years_active!: number | null;
  public social_links!: any;
  public guestbook_open!: boolean;
  public followers_count!: number;
  public following_count!: number;
  public posts_count!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ArtistProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: 'users', key: 'id' },
    },
    display_name: { type: DataTypes.STRING(100), allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
    avatar_url: { type: DataTypes.STRING(500), allowNull: true },
    banner_url: { type: DataTypes.STRING(500), allowNull: true },
    location: { type: DataTypes.STRING(100), allowNull: true },
    website: { type: DataTypes.STRING(255), allowNull: true },
    mood: { type: DataTypes.STRING(100), allowNull: true },
    discipline: { type: DataTypes.STRING(50), allowNull: true },
    years_active: { type: DataTypes.INTEGER, allowNull: true },
    social_links: { type: DataTypes.JSONB, defaultValue: {} },
    guestbook_open: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    followers_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    following_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    posts_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    sequelize,
    tableName: 'artist_profiles',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
