const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const users = [];

function createUser({ name, email, password, role = 'user' }) {
  const passwordHash = bcrypt.hashSync(password, 10);
  const user = {
    id: uuidv4(),
    name,
    email,
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  return { ...user, passwordHash: undefined };
}

function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}

function findUserById(id) {
  return users.find((user) => user.id === id);
}

function verifyPassword(user, password) {
  return bcrypt.compareSync(password, user.passwordHash);
}

function seedAdmin() {
  if (users.some((user) => user.role === 'admin')) {
    return;
  }
  const passwordHash = bcrypt.hashSync('Admin@123', 10);
  users.push({
    id: uuidv4(),
    name: 'Admin',
    email: 'admin@bank.com',
    passwordHash,
    role: 'admin',
    createdAt: new Date().toISOString(),
  });
}

seedAdmin();

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  verifyPassword,
  users,
};
