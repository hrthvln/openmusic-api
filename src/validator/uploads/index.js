const InvariantError = require('../../exceptions/InvariantError');

    const UploadsValidator = {
      validateImageHeaders: (headers) => {
        const { 'content-type': contentType } = headers;
        if (!['image/jpeg', 'image/png'].includes(contentType)) {
          throw new InvariantError('Berkas yang diunggah harus dalam format JPG/JPEG atau PNG');
        }
      },
    };

    module.exports = UploadsValidator;