const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, findUserById, verifyPassword } = require('../modals/User');
const { createAccount } = require('../modals/Account');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'banking-access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'banking-refresh-secret';

const refreshTokens = [];

function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role, email: user.email }, 
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
}

function generateRefreshToken(user) {
  const token = jwt.sign({ userId: user.id, role: user.role }, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

  refreshTokens.push(token);
  return token;
}

const register = (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (findUserByEmail(email)) {
      return res.status(409).json({ error: 'A user with that email already exists.' });
    }

    const user = createUser({ name, email, password, role: 'user' });
    createAccount(user.id, 'checking', 100);

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = findUserByEmail(email);

    if (!user || !verifyPassword(user, password)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

const refreshToken = (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token || !refreshTokens.includes(token)) {
      return res.status(403).json({ error: 'Refresh token is invalid or expired.' });
    }

    jwt.verify(token, REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) {
        return res.status(403).json({ error: 'Refresh token is invalid or expired.' });
      }

      const user = findUserById(payload.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const accessToken = generateAccessToken(user);
      res.json({ accessToken });
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  try {
    const { token } = req.body;
    const index = refreshTokens.indexOf(token);
    if (index >= 0) {
      refreshTokens.splice(index, 1);
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refreshToken, logout };
