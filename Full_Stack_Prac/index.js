const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'supersecret_access_token';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'supersecret_refresh_token';
const SALT_ROUNDS = 10;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use(limiter);

const users = [];
const accounts = [];
const transactions = [];
const refreshTokens = [];
let nextUserId = 1;
let nextAccountId = 1;
let nextTransactionId = 1;

function seedAdmin() {
  if (users.some((user) => user.role === 'admin')) return;
  const passwordHash = bcrypt.hashSync('Admin@123', SALT_ROUNDS);
  const admin = {
    id: nextUserId++,
    name: 'Admin User',
    email: 'admin@example.com',
    passwordHash,
    role: 'admin',
    createdAt: new Date().toISOString(),
  };
  users.push(admin);
  accounts.push({
    id: nextAccountId++,
    userId: admin.id,
    balance: 10000,
    accountType: 'checking',
  });
}

seedAdmin();

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const accountActionSchema = Joi.object({
  accountId: Joi.number().integer().positive().required(),
  amount: Joi.number().positive().required(),
});

const transferSchema = Joi.object({
  fromAccountId: Joi.number().integer().positive().required(),
  toAccountId: Joi.number().integer().positive().required(),
  amount: Joi.number().positive().required(),
});

function validateSchema(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
}

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
}

function generateRefreshToken(user) {
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
  refreshTokens.push(token);
  return token;
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing access token' });

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = payload;
    next();
  });
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden: insufficient privileges' });
    }
    next();
  };
}

function checkBalance(userId) {
  const userAccounts = accounts.filter((account) => account.userId === userId);
  if (userAccounts.some((account) => account.balance < 0)) {
    throw new Error('One or more accounts have a negative balance');
  }
  return userAccounts;
}

function recordTransaction(fromAccount, toAccount, amount) {
  transactions.push({
    id: nextTransactionId++,
    fromAccount,
    toAccount,
    amount,
    date: new Date().toISOString(),
  });
}

app.post('/register', validateSchema(registerSchema), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    if (users.some((user) => user.email === normalizedEmail)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = {
      id: nextUserId++,
      name,
      email: normalizedEmail,
      passwordHash,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);

    accounts.push({
      id: nextAccountId++,
      userId: newUser.id,
      balance: 0,
      accountType: 'checking',
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', validateSchema(authSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired refresh token' });
    const user = users.find((u) => u.id === payload.id);
    if (!user) return res.status(403).json({ error: 'User not found' });

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  });
});

app.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }
  const index = refreshTokens.indexOf(refreshToken);
  if (index !== -1) refreshTokens.splice(index, 1);
  res.json({ message: 'Logged out successfully' });
});

app.get('/accounts', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') {
    return res.json({ accounts });
  }
  const userAccounts = accounts.filter((account) => account.userId === req.user.id);
  res.json({ accounts: userAccounts });
});

app.get('/accounts/:id', authenticateToken, (req, res) => {
  const accountId = Number(req.params.id);
  const account = accounts.find((acc) => acc.id === accountId);
  if (!account) return res.status(404).json({ error: 'Account not found' });
  if (req.user.role !== 'admin' && account.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json({ account });
});

app.post('/accounts/deposit', authenticateToken, validateSchema(accountActionSchema), (req, res) => {
  try {
    const { accountId, amount } = req.body;
    const account = accounts.find((acc) => acc.id === accountId);
    if (!account) return res.status(404).json({ error: 'Account not found' });
    if (req.user.role !== 'admin' && account.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    checkBalance(account.userId);
    account.balance += amount;
    recordTransaction(null, account.id, amount);
    res.json({ message: 'Deposit successful', account });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/accounts/withdraw', authenticateToken, validateSchema(accountActionSchema), (req, res) => {
  try {
    const { accountId, amount } = req.body;
    const account = accounts.find((acc) => acc.id === accountId);
    if (!account) return res.status(404).json({ error: 'Account not found' });
    if (req.user.role !== 'admin' && account.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    checkBalance(account.userId);
    if (account.balance - amount < 0) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    account.balance -= amount;
    recordTransaction(account.id, null, amount);
    res.json({ message: 'Withdrawal successful', account });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/accounts/transfer', authenticateToken, validateSchema(transferSchema), (req, res) => {
  try {
    const { fromAccountId, toAccountId, amount } = req.body;
    if (fromAccountId === toAccountId) {
      return res.status(400).json({ error: 'fromAccountId and toAccountId must differ' });
    }

    const fromAccount = accounts.find((acc) => acc.id === fromAccountId);
    const toAccount = accounts.find((acc) => acc.id === toAccountId);
    if (!fromAccount || !toAccount) {
      return res.status(404).json({ error: 'One or both accounts not found' });
    }

    if (req.user.role !== 'admin' && fromAccount.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    checkBalance(fromAccount.userId);
    if (fromAccount.balance - amount < 0) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    fromAccount.balance -= amount;
    toAccount.balance += amount;
    recordTransaction(fromAccount.id, toAccount.id, amount);
    res.json({ message: 'Transfer completed', fromAccount, toAccount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/transactions', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') {
    return res.json({ transactions });
  }

  const userAccountIds = accounts.filter((acc) => acc.userId === req.user.id).map((acc) => acc.id);
  const userTransactions = transactions.filter((transaction) =>
    userAccountIds.includes(transaction.fromAccount) || userAccountIds.includes(transaction.toAccount)
  );
  res.json({ transactions: userTransactions });
});

app.get('/transactions/:accountId', authenticateToken, (req, res) => {
  const accountId = Number(req.params.accountId);
  const account = accounts.find((acc) => acc.id === accountId);
  if (!account) return res.status(404).json({ error: 'Account not found' });
  if (req.user.role !== 'admin' && account.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const accountTransactions = transactions.filter(
    (transaction) => transaction.fromAccount === accountId || transaction.toAccount === accountId
  );
  res.json({ transactions: accountTransactions });
});

app.get('/me', authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Secure Banking API running at http://localhost:${PORT}`);
});
