// Ini adalah kelas error kustom untuk resource tidak ditemukan (status code 404).

const ClientError = require('./ClientError');

    class NotFoundError extends ClientError {
      constructor(message) {
        super(message, 404);
        this.name = 'NotFoundError';
      }
    }

    module.exports = NotFoundError;