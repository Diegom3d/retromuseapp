import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres';

export class Follower extends Model {
  public id!: string;
  public follower_id!: string;
  public following_id!: string;
  public readonly created_at!: Date;
}

Follower.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    follower_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    following_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    tableName: 'followers',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);
