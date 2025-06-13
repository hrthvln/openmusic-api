const autoBind = require('auto-bind');

    class UploadsHandler {
      constructor(storageService, albumsService, validator) {
        this._storageService = storageService;
        this._albumsService = albumsService;
        this._validator = validator;

        autoBind(this);
      }

      async postUploadImageHandler(request, h) {
        const { cover } = request.payload;
        const { id } = request.params;

        this._validator.validateImageHeaders(cover.hapi.headers);

        const filename = await this._storageService.writeFile(cover, cover.hapi.headers);

        const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/covers/${filename}`; // Menggunakan HOST/PORT dari .env
        await this._albumsService.addAlbumCover(id, coverUrl);

        const response = h.response({
          status: 'success',
          message: 'Sampul berhasil diunggah',
        });
        response.code(201);
        return response;
      }
    }

    module.exports = UploadsHandler;