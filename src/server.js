require('dotenv').config();

    const Hapi = require('@hapi/hapi');
    const Jwt = require('@hapi/jwt');
    const Inert = require('@hapi/inert');

    const config = require('./utils/config');

    const albums = require('./api/albums');
    const songs = require('./api/songs');
    const users = require('./api/users');
    const authentications = require('./api/authentications');
    const playlists = require('./api/playlists');
    const collaborations = require('./api/collaborations');
    const _exports = require('./api/exports');
    const uploads = require('./api/uploads');
    const userAlbumLikes = require('./api/userAlbumLikes');

    const AlbumsService = require('./services/postgres/AlbumsService');
    const SongsService = require('./services/postgres/SongsService');
    const UsersService = require('./services/postgres/UsersService');
    const AuthenticationsService = require('./services/postgres/AuthenticationsService');
    const PlaylistsService = require('./services/postgres/PlaylistsService');
    const CollaborationsService = require('./services/postgres/CollaborationsService');
    const ProducerService = require('./services/rabbitmq/ProducerService');
    const StorageService = require('./services/storage/StorageService');
    const CacheService = require('./services/redis/CacheService');
    const UserAlbumLikesService = require('./services/postgres/UserAlbumLikesService');

    const AlbumsValidator = require('./validator/albums');
    const SongsValidator = require('./validator/songs');
    const UsersValidator = require('./validator/users');
    const AuthenticationsValidator = require('./validator/authentications');
    const PlaylistsValidator = require('./validator/playlists');
    const ExportsValidator = require('./validator/exports');
    const UploadsValidator = require('./validator/uploads');
    const CollaborationsValidator = require('./validator/collaborations');
    const UserAlbumLikesValidator = require('./validator/userAlbumLikes');

    const TokenManager = require('./tokenize/TokenManager');

    const ClientError = require('./exceptions/ClientError');
    const PayloadTooLargeError = require('./exceptions/PayloadTooLargeError');

    const init = async () => {
      const cacheService = new CacheService();
      const usersService = new UsersService();
      const authenticationsService = new AuthenticationsService();
      const collaborationsService = new CollaborationsService();
      const playlistsService = new PlaylistsService(collaborationsService);
      const albumsService = new AlbumsService();
      const songsService = new SongsService();
      const storageService = new StorageService();
      const userAlbumLikesService = new UserAlbumLikesService(cacheService);

      const server = Hapi.server({
        host: config.app.host,
        port: config.app.port,
        routes: {
          cors: {
            origin: ['*'],
          },
          payload: {
            maxBytes: 512000,
            failAction: async (request, h, err) => {
              if (err.output.statusCode === 413) {
                throw new PayloadTooLargeError('Berkas melebihi batas ukuran 512KB');
              }
              throw err;
            },
          },
        },
      });

      await server.register([
        {
          plugin: Jwt,
        },
        {
          plugin: Inert,
        },
      ]);

      server.auth.strategy('openmusic_jwt', 'jwt', {
        keys: config.jwt.accessTokenKey,
        verify: {
          aud: false,
          iss: false,
          sub: false,
          maxAgeSec: process.env.ACCESS_TOKEN_AGE || 3600,
        },
        validate: (artifacts) => ({
          isValid: true,
          credentials: {
            id: artifacts.decoded.payload.userId,
          },
        }),
      });

      await server.register([
        {
          plugin: albums,
          options: {
            service: albumsService,
            validator: AlbumsValidator,
            storageService: storageService,
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
            authenticationsService,
            usersService,
            tokenManager: TokenManager,
            validator: AuthenticationsValidator,
          },
        },
        {
          plugin: playlists,
          options: {
            service: playlistsService,
            validator: PlaylistsValidator,
            songsService: songsService,
            producerService: ProducerService,
          },
        },
        {
          plugin: _exports,
          options: {
            producerService: ProducerService,
            playlistsService: playlistsService,
            validator: ExportsValidator,
          },
        },
        {
          plugin: uploads,
          options: {
            storageService,
            albumsService,
            validator: UploadsValidator,
          },
        },
        {
          plugin: collaborations,
          options: {
            collaborationsService,
            playlistsService,
            usersService,
            validator: CollaborationsValidator,
          },
        },
        {
          plugin: userAlbumLikes,
          options: {
            service: userAlbumLikesService,
            albumsService: albumsService,
            validator: UserAlbumLikesValidator,
          },
        },
      ]);

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
          if (response instanceof PayloadTooLargeError) {
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