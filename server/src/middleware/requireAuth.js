import { verifyAccessToken } from '../services/token.service.js';

export function requireAuth(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7).trim()
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Please log in first.',
    });
  }

  let payload;

  try {
    payload = verifyAccessToken(token);
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }

  if (typeof payload?.sub !== 'string' || !payload.sub) {
    return res.status(401).json({
      success: false,
      message: 'Invalid access token.',
    });
  }

  req.auth = {
    userId: payload.sub,
    email: payload.email,
  };

  next();
}
