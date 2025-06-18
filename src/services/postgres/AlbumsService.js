    // File: openmusic-api/src/services/postgres/AlbumsService.js

    const { Pool } = require('pg');
    const { nanoid } = require('nanoid');
    const InvariantError = require('../../exceptions/InvariantError');
    const NotFoundError = require('../../exceptions/NotFoundError');

    class AlbumsService {
      constructor() {
        this._pool = new Pool();
      }

      async addAlbum({ name, year }) {
        const id = `album-${nanoid(16)}`;
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
          text: 'INSERT INTO albums (id, name, year, cover_url, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
          values: [id, name, year, null, createdAt, updatedAt],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
          throw new InvariantError('Album gagal ditambahkan');
        }

        return result.rows[0].id;
      }

      async getAlbums() {
        const result = await this._pool.query('SELECT id, name, year, cover_url FROM albums');
        // PASTIKAN MAPPING INI TERJADI UNTUK SEMUA ALBUM
        return result.rows.map(album => ({
          id: album.id,
          name: album.name,
          year: album.year,
          coverUrl: album.cover_url, // Mapping eksplisit
        }));
      }

      async getAlbumById(id) {
        const query = {
          text: 'SELECT id, name, year, cover_url FROM albums WHERE id = $1', // PASTIKAN cover_url di SELECT
          values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
          throw new NotFoundError('Album tidak ditemukan');
        }

        const songsQuery = {
          text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
          values: [id],
        };
        const songsResult = await this._pool.query(songsQuery);

        const album = result.rows[0];
        album.coverUrl = album.cover_url;
        delete album.cover_url;
        // Hapus properti lama jika diperlukan oleh test

        album.songs = songsResult.rows;

        return album;
      }

      async editAlbumById(id, { name, year }) {
        const updatedAt = new Date().toISOString();
        const query = {
          text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
          values: [name, year, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
          throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
        }
      }

      async deleteAlbumById(id) {
        const query = {
          text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
          values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
          throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
        }
      }

      async addAlbumCover(id, coverUrl) {
        const updatedAt = new Date().toISOString();
        const query = {
          text: 'UPDATE albums SET cover_url = $1, updated_at = $2 WHERE id = $3 RETURNING id',
          values: [coverUrl, updatedAt, id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
          throw new NotFoundError('Album tidak ditemukan');
        }
      }

      async verifyAlbumExists(id) {
        const query = {
          text: 'SELECT id FROM albums WHERE id = $1',
          values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
          throw new NotFoundError('Album tidak ditemukan');
        }
      }
    }

    module.exports = AlbumsService;
    