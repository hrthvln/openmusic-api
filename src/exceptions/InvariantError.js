// Ini adalah kelas error kustom untuk kesalahan validasi atau kondisi yang tidak terpenuhi (status code 400).

const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;