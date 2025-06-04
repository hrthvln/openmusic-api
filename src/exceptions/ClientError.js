// Ini adalah kelas error kustom untuk client-side errors (status code 4xx).

class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = ClientError;