import bcrypt from 'bcryptjs';
import { z } from 'zod';
import User from '../models/user.model.js';
import { createAccessToken } from '../services/token.service.js';

const emailSchema = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((email) => email.toLowerCase());

const passwordSchema = z.string().min(8).max(72);

const registerSchema = z.object({
  name: z.string().trim().min(2).max(50),
  email: emailSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

function validateCredentials(req, res, schema) {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: 'Please check your name, email, and password.',
    });
    return null;
  }

  if (Buffer.byteLength(result.data.password, 'utf8') > 72) {
    res.status(400).json({
      success: false,
      message: 'Password is too long.',
    });
    return null;
  }

  return result.data;
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name || user.email.split('@')[0],
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function register(req, res, next) {
  try {
    const credentials = validateCredentials(req, res, registerSchema);
    if (!credentials) return;

    const passwordHash = await bcrypt.hash(credentials.password, 12);

    const user = await User.create({
      name: credentials.name,
      email: credentials.email,
      passwordHash,
    });

    const accessToken = createAccessToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        user: publicUser(user),
        accessToken,
        tokenType: 'Bearer',
        expiresIn: '7d',
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const credentials = validateCredentials(req, res, loginSchema);
    if (!credentials) return;

    const user = await User.findOne({ email: credentials.email }).select(
      '+passwordHash'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const passwordMatches = await bcrypt.compare(
      credentials.password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const accessToken = createAccessToken(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: publicUser(user),
        accessToken,
        tokenType: 'Bearer',
        expiresIn: '7d',
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.auth.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Account not found. Please log in again.',
      });
    }

    return res.status(200).json({
      success: true,
      data: { user: publicUser(user) },
    });
  } catch (error) {
    return next(error);
  }
}
