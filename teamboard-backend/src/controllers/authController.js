import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { findByEmail, createUser, findById } from '../models/userModel.js';

const SALT_ROUNDS = 12;

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'İsim alanı zorunludur.',
    'string.min': 'İsim en az 2 karakter olmalıdır.',
    'string.max': 'İsim en fazla 100 karakter olabilir.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir e-posta adresi giriniz.',
    'string.empty': 'E-posta alanı zorunludur.',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Şifre en az 6 karakter olmalıdır.',
    'string.empty': 'Şifre alanı zorunludur.',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir e-posta adresi giriniz.',
    'string.empty': 'E-posta alanı zorunludur.',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Şifre alanı zorunludur.',
  }),
});

function generateToken(userId, email) {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export async function register(req, res) {
  try {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, email, password } = value;

    const existingUser = await findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Bu e-posta adresi zaten kayıtlı.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await createUser(name, email, passwordHash);

    const token = generateToken(newUser.id, newUser.email);

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.created_at,
      },
    });
  } catch (error) {
    console.error('Register hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}

export async function login(req, res) {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    const user = await findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre.' });
    }

    const token = generateToken(user.id, user.email);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Login hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}

export async function getMe(req, res) {
  try {
    const user = await findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('GetMe hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}
