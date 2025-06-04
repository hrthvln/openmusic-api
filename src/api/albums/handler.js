// Ini adalah handler untuk endpoint album.

const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this); // Mengikat semua metode ke instance ini
  }

  // Menambahkan album baru
  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload); // Validasi payload
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year }); // Menambahkan album ke database

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201); // Mengatur status code 201 (Created)
    return response;
  }

  // Mendapatkan detail album berdasarkan ID
  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id); // Mendapatkan album dari database
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  // Mengubah detail album berdasarkan ID
  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload); // Validasi payload
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload); // Mengubah album di database

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  // Menghapus album berdasarkan ID
  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id); // Menghapus album dari database

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;