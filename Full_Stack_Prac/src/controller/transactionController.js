const { getAccountsByUser } = require('../modals/Account');
const { getTransactionsForUserAccounts } = require('../modals/Transaction');

const getUserTransactions = (req, res) => {
  if (req.user.role === 'admin') {
    return res.json({ transactions: getTransactionsForUserAccounts(getAccountsByUser(req.user.userId).map((a) => a.id)) });
  }

  const accountIds = getAccountsByUser(req.user.userId).map((account) => account.id);
  res.json({ transactions: getTransactionsForUserAccounts(accountIds) });
};

const getAccountTransactions = (req, res) => {
  const { accountId } = req.params;
  const accountIds = getAccountsByUser(req.user.userId).map((account) => account.id);

  if (req.user.role !== 'admin' && !accountIds.includes(accountId)) {
    return res.status(403).json({ error: 'Access denied to this account history.' });
  }

  res.json({ transactions: getTransactionsForUserAccounts([accountId]) });
};

module.exports = { getUserTransactions, getAccountTransactions };
