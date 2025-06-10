// Rute untuk plugin kolaborasi.

const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaborationHandler,
    options: {
      auth: 'openmusic_jwt', // Membutuhkan autentikasi JWT
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborationHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;