// Plugin Hapi untuk pengelolaan playlist.

const SongsService = require('../../services/postgres/SongsService');
const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, validator, songsService }) => {
    const playlistsHandler = new PlaylistsHandler(service, validator, SongsService);
    server.route(routes(playlistsHandler));
  },
};