const {
  createAccount,
  getAccount,
  getAccountsByUser,
  getAllAccounts,
  changeBalance,
} = require('../modals/Account');
const { createTransaction } = require('../modals/Transaction');

function checkBalance(userId) {
  const userAccounts = getAccountsByUser(userId);
  return userAccounts.reduce((total, account) => total + account.balance, 0);
}

const getAllAccountsHandler = (req, res) => {
  res.json({ accounts: getAllAccounts() });
};

const getMyAccounts = (req, res) => {
  const accounts = getAccountsByUser(req.user.userId);
  res.json({ accounts });
};

const getAccountById = (req, res) => {
  const account = getAccount(req.params.accountId);
  if (!account) {
    return res.status(404).json({ error: 'Account not found.' });
  }

  if (req.user.role !== 'admin' && account.userId !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied to this account.' });
  }

  res.json({ account });
};

const openAccount = (req, res) => {
  const { accountType } = req.body;
  const account = createAccount(req.user.userId, accountType, 0);
  res.status(201).json({ account });
};

const deposit = (req, res) => {
  const { amount } = req.body;
  const account = getAccount(req.params.accountId);
  if (!account) {
    return res.status(404).json({ error: 'Account not found.' });
  }

  if (req.user.role !== 'admin' && account.userId !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied.' });
  }

  checkBalance(req.user.userId);
  changeBalance(account.id, amount);
  createTransaction(null, account.id, amount);

  res.json({ account, balance: account.balance });
};

const withdraw = (req, res) => {
  const { amount } = req.body;
  const account = getAccount(req.params.accountId);
  if (!account) {
    return res.status(404).json({ error: 'Account not found.' });
  }

  if (req.user.role !== 'admin' && account.userId !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied.' });
  }

  if (account.balance - amount < 0) {
    return res.status(400).json({ error: 'Insufficient funds. Overdraft is not allowed.' });
  }

  checkBalance(req.user.userId);
  changeBalance(account.id, -amount);
  createTransaction(account.id, null, amount);

  res.json({ account, balance: account.balance });
};

const transfer = (req, res) => {
  const { fromAccount, toAccount, amount } = req.body;
  const source = getAccount(fromAccount);
  const destination = getAccount(toAccount);

  if (!source || !destination) {
    return res.status(404).json({ error: 'One or both accounts were not found.' });
  }

  if (source.userId !== req.user.userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'You can only transfer from your own account.' });
  }

  if (source.id === destination.id) {
    return res.status(400).json({ error: 'Source and destination accounts must differ.' });
  }

  if (source.balance - amount < 0) {
    return res.status(400).json({ error: 'Insufficient funds. Overdraft is not allowed.' });
  }

  checkBalance(req.user.userId);
  changeBalance(source.id, -amount);
  changeBalance(destination.id, amount);
  const transaction = createTransaction(source.id, destination.id, amount);

  res.json({ transaction, source, destination });
};

module.exports = {
  getAllAccounts: getAllAccountsHandler,
  getMyAccounts,
  getAccountById,
  openAccount,
  deposit,
  withdraw,
  transfer,
  checkBalance,
};
