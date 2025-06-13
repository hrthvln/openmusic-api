exports.shorthands = undefined;

    exports.up = (pgm) => {
      pgm.createTable('user_album_likes', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
        album_id: {
          type: 'VARCHAR(50)',
          notNull: true,
          references: 'albums',
          onDelete: 'cascade',
        },
        user_id: {
          type: 'VARCHAR(50)',
          notNull: true,
          references: 'users',
          onDelete: 'cascade',
        },
      });

      pgm.addConstraint('user_album_likes', 'unique_album_id_and_user_id', 'UNIQUE(album_id, user_id)');
    };

    exports.down = (pgm) => {
      pgm.dropTable('user_album_likes');
    };