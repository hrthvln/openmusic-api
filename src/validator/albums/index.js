// Ini adalah validator Joi untuk payload album.

const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(), // Nama album harus string dan wajib
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(), // Tahun album harus angka, integer, minimal 1900, maksimal tahun saat ini, dan wajib
});

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;