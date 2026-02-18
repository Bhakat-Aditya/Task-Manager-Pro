import jwt from 'jsonwebtoken';

export const generateTokens = (userId) => {
  // Access Token: Short lifespan (15 minutes). Used for API requests.
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  // Refresh Token: Long lifespan (7 days). Used to get a new Access Token.
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const setRefreshTokenCookie = (res, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Prevents JavaScript from reading the cookie (XSS protection)
    secure: isProduction, // Requires HTTPS in production (Vercel)
    sameSite: isProduction ? 'none' : 'lax', // 'none' is required for cross-site cookies in production
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  });
};