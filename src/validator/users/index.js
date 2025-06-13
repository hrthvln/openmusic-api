const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

    const UserPayloadSchema = Joi.object({
      username: Joi.string()
        .pattern(/^[a-zA-Z0-9_.]+$/)
        .min(3)
        .max(30)
        .required(),
      password: Joi.string().min(6).required(),
      fullname: Joi.string().required(),
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