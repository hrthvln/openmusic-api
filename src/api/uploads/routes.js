const routes = (handler) => [
      {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: handler.postUploadImageHandler,
        options: {
          payload: {
            allow: 'multipart/form-data',
            multipart: true,
            output: 'stream',
          },
        },
      },
      {
        method: 'GET', // Route untuk melayani file cover statis
        path: '/albums/covers/{filename}',
        handler: {
          directory: {
            path: './public/uploads/covers', // Jika menggunakan local storage
          },
        },
      },
    ];

    module.exports = routes;