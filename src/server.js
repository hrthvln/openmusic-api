// Ini adalah file utama untuk menginisialisasi server Hapi.

require('dotenv').config(); // Memuat variabel lingkungan dari .env

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// Plugins
const albums = require('./api/albums');
const songs = require('./api/songs');
const users = require('./api/users'); // Plugin untuk pengguna
const authentications = require('./api/authentications'); // Plugin untuk autentikasi
const playlists = require('./api/playlists'); // Plugin untuk playlist
const collaborations = require('./api/collaborations'); // Plugin untuk kolaborasi (opsional)

// Services
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService'); // Service untuk pengguna
const AuthenticationsService = require('./services/postgres/AuthenticationsService'); // Service untuk autentikasi
const PlaylistsService = require('./services/postgres/PlaylistsService'); // Service untuk playlist
const CollaborationsService = require('./services/postgres/CollaborationsService'); // Service untuk kolaborasi (opsional)

// Validators
const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const UsersValidator = require('./validator/users'); // Validator untuk pengguna
const AuthenticationsValidator = require('./validator/authentications'); // Validator untuk autentikasi
const PlaylistsValidator = require('./validator/playlists'); // Validator untuk playlist
const CollaborationsValidator = require('./validator/collaborations'); // Validator untuk kolaborasi (opsional)

// Token Manager
const TokenManager = require('./tokenize/TokenManager');

// Custom Errors
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  // Inisialisasi service
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService(); // Inisialisasi service kolaborasi
  const playlistsService = new PlaylistsService(collaborationsService); // PlaylistsService membutuhkan CollaborationsService
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  // Konfigurasi server Hapi
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Mendaftarkan plugin JWT
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // Mendefinisikan strategi autentikasi JWT
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY, // Kunci rahasia untuk memverifikasi token
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE || 3600, // Durasi token (default 1 jam)
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.userId, // Mengambil userId dari payload JWT
      },
    }),
  });

  // Mendaftarkan plugins API
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
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService, // Service untuk autentikasi
        usersService, // Service untuk pengguna
        tokenManager: TokenManager, // Token manager untuk JWT
        validator: AuthenticationsValidator, // Validator untuk autentikasi
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
        songsService: songsService,
      },
    },
    {
      plugin: collaborations, // Plugin kolaborasi
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
  ]);

  // Ekstensi onPreResponse untuk penanganan error global
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      newResponse.code(500);
      console.error(response);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();