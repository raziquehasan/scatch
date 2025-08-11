const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    jwtSecret,
    { expiresIn: '1h' }
  );
}

module.exports = generateToken;
