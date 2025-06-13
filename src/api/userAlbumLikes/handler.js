const autoBind = require('auto-bind');

    class UserAlbumLikesHandler {
      constructor(service, albumsService, validator) {
        this._service = service;
        this._albumsService = albumsService;
        this._validator = validator;

        autoBind(this);
      }

      async postUserAlbumLikeHandler(request, h) {
        const { id: albumId } = request.params;
        const { id: userId } = request.auth.credentials;

        await this._albumsService.verifyAlbumExists(albumId);

        await this._service.addUserAlbumLike(albumId, userId);

        const response = h.response({
          status: 'success',
          message: 'Berhasil menyukai album',
        });
        response.code(201);
        return response;
      }

      async getUserAlbumLikesHandler(request, h) {
        const { id: albumId } = request.params;

        await this._albumsService.verifyAlbumExists(albumId);

        const { likes, dataSource } = await this._service.getUserAlbumLikes(albumId);

        const response = h.response({
          status: 'success',
          data: {
            likes: parseInt(likes, 10),
          },
        });

        if (dataSource === 'cache') {
          response.header('X-Data-Source', 'cache');
        }

        return response;
      }

      async deleteUserAlbumLikeHandler(request, h) {
        const { id: albumId } = request.params;
        const { id: userId } = request.auth.credentials;

        await this._albumsService.verifyAlbumExists(albumId);

        await this._service.deleteUserAlbumLike(albumId, userId);

        return {
          status: 'success',
          message: 'Berhasil batal menyukai album',
        };
      }
    }

    module.exports = UserAlbumLikesHandler;