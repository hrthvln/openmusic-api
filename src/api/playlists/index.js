// Plugin Hapi untuk pengelolaan playlist.

const PlaylistsHandler = require('./handler');
    const routes = require('./routes');

    module.exports = {
      name: 'playlists',
      version: '1.0.0',
      register: async (server, { service, validator, songsService, producerService }) => {
        const playlistsHandler = new PlaylistsHandler(service, validator, songsService, producerService);
        server.route(routes(playlistsHandler));
      },
    };