import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      // 403 Forbidden tells the frontend it needs to hit the /refresh endpoint
      return res.status(403).json({ message: 'Forbidden, token expired or invalid' });
    }
    
    req.user = decoded.userId; 
    next();
  });
};