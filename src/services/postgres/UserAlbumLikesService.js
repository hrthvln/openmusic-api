const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

    class UserAlbumLikesService {
      constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
      }

      async addUserAlbumLike(albumId, userId) {
        const checkQuery = {
          text: 'SELECT id FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
          values: [albumId, userId],
        };
        const checkResult = await this._pool.query(checkQuery);

        if (checkResult.rows.length) {
          throw new InvariantError('Anda sudah menyukai album ini');
        }

        const id = `like-${nanoid(16)}`;
        const query = {
          text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
          values: [id, albumId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
          throw new InvariantError('Gagal menyukai album');
        }

        await this._cacheService.delete(`album-likes:${albumId}`);

        return result.rows[0].id;
      }

      async getUserAlbumLikes(albumId) {
        try {
          const result = await this._cacheService.get(`album-likes:${albumId}`);
          return { likes: JSON.parse(result), dataSource: 'cache' };
        } catch (error) {
          const query = {
            text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
            values: [albumId],
          };
          const result = await this._pool.query(query);
          const likes = parseInt(result.rows[0].count, 10);

          await this._cacheService.set(`album-likes:${albumId}`, JSON.stringify(likes));

          return { likes, dataSource: 'database' };
        }
      }

      async deleteUserAlbumLike(albumId, userId) {
        const query = {
          text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
          values: [albumId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
          throw new NotFoundError('Gagal batal menyukai album. Like tidak ditemukan');
        }

        await this._cacheService.delete(`album-likes:${albumId}`);
      }
    }

    module.exports = UserAlbumLikesService;