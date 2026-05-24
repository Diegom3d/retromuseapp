import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres';

export class Notification extends Model {
  public id!: string;
  public user_id!: string;
  public actor_id!: string | null;
  public type!: string;
  public entity_type!: string | null;
  public entity_id!: string | null;
  public message!: string;
  public is_read!: boolean;
  public readonly created_at!: Date;
}

Notification.init(
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
    actor_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    type: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    entity_type: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    entity_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    message: { type: DataTypes.TEXT, allowNull: false },
    is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    tableName: 'notifications',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);
