const { v4: uuidv4 } = require('uuid');

const transactions = [];

function createTransaction(fromAccount, toAccount, amount) {
  const transaction = {
    id: uuidv4(),
    fromAccount,
    toAccount,
    amount,
    date: new Date().toISOString(),
  };

  transactions.push(transaction);
  return transaction;
}

function getTransactionsForUserAccounts(accountIds) {
  return transactions.filter(
    (tx) => accountIds.includes(tx.fromAccount) || accountIds.includes(tx.toAccount)
  );
}

function getAllTransactions() {
  return transactions;
}

module.exports = {
  createTransaction,
  getTransactionsForUserAccounts,
  getAllTransactions,
  transactions,
};
