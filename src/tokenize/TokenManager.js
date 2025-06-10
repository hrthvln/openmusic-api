// Utilitas untuk membuat dan memverifikasi JWT.

const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  // Membuat access token
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  // Membuat refresh token
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  // Memverifikasi refresh token
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken); // Decode token tanpa verifikasi signature
      Jwt.token.verify(artifacts, process.env.REFRESH_TOKEN_KEY); // Verifikasi signature
      return artifacts.decoded.payload; // Mengembalikan payload jika valid
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;