// Ini adalah definisi rute untuk plugin album.

const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postAlbumHandler, // Menggunakan handler yang sudah di-bind
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getAlbumByIdHandler, // Menggunakan handler yang sudah di-bind
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.putAlbumByIdHandler, // Menggunakan handler yang sudah di-bind
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbumByIdHandler, // Menggunakan handler yang sudah di-bind
  },
];

module.exports = routes;