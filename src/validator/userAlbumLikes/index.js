const Joi = require('joi');
    const InvariantError = require('../../exceptions/InvariantError');

    const UserAlbumLikesValidator = {
      validateUserAlbumLikePayload: (payload) => {
        // Tidak ada validasi payload khusus untuk like/unlike, validasi di service
      },
    };

    module.exports = UserAlbumLikesValidator;