import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateTokens, setRefreshTokenCookie } from '../utils/generateTokens.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Add name here

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash }); // Save name

    const { accessToken, refreshToken } = generateTokens(user._id);
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, preferences: user.preferences },
      accessToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const { accessToken, refreshToken } = generateTokens(user._id);
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, preferences: user.preferences }, // Include name
      accessToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid or expired refresh token' });

      // NEW: Fetch the user data so the frontend context can restore the session
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const { accessToken } = generateTokens(decoded.userId);

      res.status(200).json({
        accessToken,
        user: { id: user._id, name: user.name, email: user.email, preferences: user.preferences }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const logout = async (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(0) // Expire immediately
  });
  res.status(200).json({ message: 'Logged out successfully' });
};