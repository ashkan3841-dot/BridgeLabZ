const { v4: uuidv4 } = require('uuid');

const accounts = [];

function createAccount(userId, accountType = 'checking', initialBalance = 0) {
  const account = {
    id: uuidv4(),
    userId,
    balance: Math.max(0, initialBalance),
    accountType,
  };

  accounts.push(account);
  return account;
}

function getAccount(id) {
  return accounts.find((account) => account.id === id);
}

function getAccountsByUser(userId) {
  return accounts.filter((account) => account.userId === userId);
}

function getAllAccounts() {
  return accounts;
}

function changeBalance(accountId, amount) {
  const account = getAccount(accountId);
  if (!account) {
    return null;
  }

  account.balance += amount;
  return account;
}

module.exports = {
  createAccount,
  getAccount,
  getAccountsByUser,
  getAllAccounts,
  changeBalance,
  accounts,
};
