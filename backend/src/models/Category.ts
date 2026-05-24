import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres';

export class Category extends Model {
  public id!: string;
  public name!: string;
  public slug!: string;
  public description!: string | null;
  public icon_url!: string | null;
  public color_hex!: string;
  public readonly created_at!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    color_hex: {
      type: DataTypes.STRING(7),
      defaultValue: '#FF69B4',
    },
  },
  {
    sequelize,
    tableName: 'categories',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);
