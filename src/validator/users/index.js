// Validator Joi untuk payload pengguna.

const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

const UserPayloadSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(), // Username harus alfanumerik, min 3, max 30
  password: Joi.string().min(6).required(), // Password min 6 karakter
  fullname: Joi.string().required(), // Fullname wajib
});

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;