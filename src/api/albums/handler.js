const autoBind = require('auto-bind');

    class AlbumsHandler {
      constructor(service, validator, storageService) {
        this._service = service;
        this._validator = validator;
        this._storageService = storageService;

        autoBind(this);
      }

      async postAlbumHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const { name, year } = request.payload;

        const albumId = await this._service.addAlbum({ name, year });

        const response = h.response({
          status: 'success',
          message: 'Album berhasil ditambahkan',
          data: {
            albumId,
          },
        });
        response.code(201);
        return response;
      }

      async getAlbumByIdHandler(request, h) {
        const { id } = request.params;
        const album = await this._service.getAlbumById(id);
        return {
          status: 'success',
          data: {
            album,
          },
        };
      }

      async putAlbumByIdHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const { id } = request.params;

        await this._service.editAlbumById(id, request.payload);

        return {
          status: 'success',
          message: 'Album berhasil diperbarui',
        };
      }

      async deleteAlbumByIdHandler(request, h) {
        const { id } = request.params;

        await this._service.deleteAlbumById(id);

        return {
          status: 'success',
          message: 'Album berhasil dihapus',
        };
      }
    }

    module.exports = AlbumsHandler;