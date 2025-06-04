// Ini adalah validator Joi untuk payload lagu.

const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(), // Judul lagu harus string dan wajib
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(), // Tahun lagu harus angka, integer, minimal 1900, maksimal tahun saat ini, dan wajib
  genre: Joi.string().required(), // Genre lagu harus string dan wajib
  performer: Joi.string().required(), // Performer lagu harus string dan wajib
  duration: Joi.number().integer().min(1).optional(), // Durasi lagu harus angka, integer, minimal 1, dan opsional
  albumId: Joi.string().optional(), // ID album harus string dan opsional
});

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;