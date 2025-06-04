// Ini adalah service untuk interaksi dengan database PostgreSQL untuk tabel album.

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    // Membuat instance Pool untuk koneksi ke database PostgreSQL
    this._pool = new Pool();
  }

  // Menambahkan album baru ke database
  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`; // Membuat ID unik untuk album
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // Mendapatkan semua album dari database
  async getAlbums() {
    const result = await this._pool.query('SELECT id, name, year FROM albums');
    return result.rows;
  }

  // Mendapatkan album berdasarkan ID dari database
  async getAlbumById(id) {
    const query = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    // Kriteria Opsional 1: Memunculkan daftar lagu di dalam detail album
    const songsQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
      values: [id],
    };
    const songsResult = await this._pool.query(songsQuery);

    const album = result.rows[0];
    album.songs = songsResult.rows;

    return album;
  }

  // Mengubah detail album berdasarkan ID di database
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

  // Menghapus album berdasarkan ID dari database
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
}

module.exports = AlbumsService;