// Ini adalah file utama untuk menginisialisasi server Hapi.

require('dotenv').config(); // Memuat variabel lingkungan dari .env

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  // Inisialisasi service untuk album dan lagu
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  // Konfigurasi server Hapi
  const server = Hapi.server({
    host: process.env.HOST, // Mengambil host dari environment variable
    port: process.env.PORT, // Mengambil port dari environment variable
    routes: {
      cors: {
        origin: ['*'], // Mengizinkan semua origin untuk CORS
      },
    },
  });

  // Mendaftarkan plugin
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
  ]);

  // Ekstensi onPreResponse untuk penanganan error global
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      // Penanganan client error secara internal (misalnya dari validasi Joi atau ClientError kustom)
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // Mempertahankan penanganan client error oleh Hapi secara native (misalnya 404 Not Found)
      if (!response.isServer) {
        return h.continue;
      }

      // Penanganan server error (500 Internal Server Error)
      const newResponse = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      newResponse.code(500);
      console.error(response); // Log error server untuk debugging
      return newResponse;
    }

    // Jika bukan error, lanjutkan dengan response sebelumnya
    return h.continue;
  });

  // Memulai server
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

// Panggil fungsi init untuk memulai aplikasi
init();