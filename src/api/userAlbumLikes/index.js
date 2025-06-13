const UserAlbumLikesHandler = require('./handler');
    const routes = require('./routes');

    module.exports = {
      name: 'userAlbumLikes',
      version: '1.0.0',
      register: async (server, { service, albumsService, validator }) => {
        const userAlbumLikesHandler = new UserAlbumLikesHandler(service, albumsService, validator);
        server.route(routes(userAlbumLikesHandler));
      },
    };