const autoBind = require('auto-bind');

    class PlaylistsHandler {
      constructor(service, validator, songsService, producerService) {
        this._service = service;
        this._validator = validator;
        this._songsService = songsService;
        this._producerService = producerService;

        autoBind(this);
      }

      async postPlaylistHandler(request, h) {
        this._validator.validatePlaylistPayload(request.payload);
        const { name } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

        const response = h.response({
          status: 'success',
          message: 'Playlist berhasil ditambahkan',
          data: {
            playlistId,
          },
        });
        response.code(201);
        return response;
      }

      async getPlaylistsHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._service.getPlaylists(credentialId);
        return {
          status: 'success',
          data: {
            playlists,
          },
        };
      }

      async deletePlaylistByIdHandler(request, h) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistOwner(id, credentialId);
        await this._service.deletePlaylistById(id);

        return {
          status: 'success',
          message: 'Playlist berhasil dihapus',
        };
      }

      async postPlaylistSongHandler(request, h) {
        this._validator.validatePlaylistSongPayload(request.payload);
        const { playlistId } = request.params;
        const { songId } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        await this._service.addSongToPlaylist(playlistId, songId);

        // Catat aktivitas (Kriteria Opsional 2 V2)
        try {
            const song = await this._songsService.getSongById(songId);
            await this._service.addPlaylistActivity({
              playlistId,
              songId,
              userId: credentialId,
              action: 'add',
              songTitle: song.title,
            });
        } catch (error) {
            console.error('Failed to log playlist activity (add song):', error);
        }


        const response = h.response({
          status: 'success',
          message: 'Lagu berhasil ditambahkan ke playlist',
        });
        response.code(201);
        return response;
      }

      async getPlaylistSongsHandler(request, h) {
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        const playlist = await this._service.getPlaylistSongs(playlistId);

        return {
          status: 'success',
          data: {
            playlist,
          },
        };
      }

      async deletePlaylistSongHandler(request, h) {
        this._validator.validatePlaylistSongPayload(request.payload);
        const { playlistId } = request.params;
        const { songId } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        await this._service.deleteSongFromPlaylist(playlistId, songId);

        // Catat aktivitas (Kriteria Opsional 2 V2)
        try {
            const song = await this._songsService.getSongById(songId);
            await this._service.addPlaylistActivity({
              playlistId,
              songId,
              userId: credentialId,
              action: 'delete',
              songTitle: song.title,
            });
        } catch (error) {
            console.error('Failed to log playlist activity (delete song):', error);
        }

        return {
          status: 'success',
          message: 'Lagu berhasil dihapus dari playlist',
        };
      }

      async getPlaylistActivitiesHandler(request, h) {
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        const activities = await this._service.getPlaylistActivities(playlistId);

        return {
          status: 'success',
          data: {
            playlistId,
            activities,
          },
        };
      }
    }

    module.exports = PlaylistsHandler;