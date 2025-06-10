// Service untuk interaksi dengan database PostgreSQL untuk tabel kolaborasi.

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  // Menambahkan kolaborator
  async addCollaboration(playlistId, userId) {
    // Pastikan kolaborasi belum ada
    const checkQuery = {
      text: 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
    const checkResult = await this._pool.query(checkQuery);

    if (checkResult.rows.length) {
      throw new InvariantError('Kolaborasi sudah ada');
    }

    const id = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // Menghapus kolaborator
  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Kolaborasi gagal dihapus. Kolaborator tidak ditemukan pada playlist ini');
    }
  }

  // Memverifikasi kolaborator
  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Anda bukan kolaborator pada playlist ini');
    }
  }
}

module.exports = CollaborationsService;