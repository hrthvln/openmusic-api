// Ini adalah definisi rute untuk plugin lagu.

const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler, // Menggunakan handler yang sudah di-bind
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongsHandler, // Menggunakan handler yang sudah di-bind
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getSongByIdHandler, // Menggunakan handler yang sudah di-bind
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putSongByIdHandler, // Menggunakan handler yang sudah di-bind
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteSongByIdHandler, // Menggunakan handler yang sudah di-bind
  },
];

module.exports = routes;