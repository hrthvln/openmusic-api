// Ini adalah handler untuk endpoint lagu.

const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this); // Mengikat semua metode ke instance ini
  }

  // Menambahkan lagu baru
  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload); // Validasi payload
    const { title, year, genre, performer, duration, albumId } = request.payload;

    const songId = await this._service.addSong({
      title, year, genre, performer, duration, albumId,
    }); // Menambahkan lagu ke database

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201); // Mengatur status code 201 (Created)
    return response;
  }

  // Mendapatkan semua lagu atau mencari lagu berdasarkan query parameter
  async getSongsHandler(request, h) {
    const { title, performer } = request.query; // Mengambil query parameter
    const songs = await this._service.getSongs({ title, performer }); // Mendapatkan lagu dari database

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  // Mendapatkan detail lagu berdasarkan ID
  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id); // Mendapatkan lagu dari database
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  // Mengubah detail lagu berdasarkan ID
  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload); // Validasi payload
    const { id } = request.params;

    await this._service.editSongById(id, request.payload); // Mengubah lagu di database

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  // Menghapus lagu berdasarkan ID
  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteSongById(id); // Menghapus lagu dari database

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;