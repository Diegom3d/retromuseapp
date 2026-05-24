import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../config/postgres';
import { QueryTypes } from 'sequelize';

const SALT_ROUNDS = 12;

interface UserRow {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: string;
  is_active: boolean;
}

const generateToken = (user: { id: string; email: string; role: string }): string =>
  jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
  });

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, discipline } = req.body;

    // Verificar duplicados
    const existing = await sequelize.query<UserRow>(
      'SELECT id FROM users WHERE email = :email OR username = :username',
      { replacements: { email, username }, type: QueryTypes.SELECT }
    );
    if (existing.length > 0) {
      res.status(409).json({ error: 'Email o nombre de usuario ya registrado' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = uuidv4();

    await sequelize.transaction(async (t) => {
      await sequelize.query(
        `INSERT INTO users (id, username, email, password_hash) VALUES (:id, :username, :email, :passwordHash)`,
        { replacements: { id: userId, username, email, passwordHash }, transaction: t, type: QueryTypes.INSERT }
      );
      await sequelize.query(
        `INSERT INTO artist_profiles (user_id, display_name, discipline) VALUES (:userId, :username, :discipline)`,
        { replacements: { userId, username, discipline: discipline || 'other' }, transaction: t, type: QueryTypes.INSERT }
      );
    });

    const token = generateToken({ id: userId, email, role: 'artist' });
    res.status(201).json({ message: 'Cuenta creada exitosamente', token, userId });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error al crear la cuenta' });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const users = await sequelize.query<UserRow>(
      'SELECT * FROM users WHERE email = :email AND is_active = TRUE',
      { replacements: { email }, type: QueryTypes.SELECT }
    );

    if (users.length === 0) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.json({
      message: '¡Bienvenido a RetroMuse!',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// GET /api/auth/me
export const getMe = async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const rows = await sequelize.query(
      `SELECT u.id, u.username, u.email, u.role, u.created_at,
              ap.display_name, ap.bio, ap.avatar_url, ap.discipline, ap.mood, ap.followers_count
       FROM users u
       LEFT JOIN artist_profiles ap ON ap.user_id = u.id
       WHERE u.id = :userId`,
      { replacements: { userId }, type: QueryTypes.SELECT }
    );
    if (rows.length === 0) { res.status(404).json({ error: 'Usuario no encontrado' }); return; }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};
