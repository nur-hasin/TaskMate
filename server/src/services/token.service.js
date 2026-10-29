import jwt from 'jsonwebtoken';

function getTokenSecret() {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('ACCESS_TOKEN_SECRET must be at least 32 characters.');
  }

  return secret;
}

export function createAccessToken(user) {
  if (!user?._id || !user?.email) {
    throw new Error('A valid user is required to create a token.');
  }

  return jwt.sign(
    {
      email: user.email,
    },
    getTokenSecret(),
    {
      subject: user._id.toString(),
      expiresIn: '7d',
    }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, getTokenSecret());
}
