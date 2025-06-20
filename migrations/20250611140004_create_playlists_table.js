exports.shorthands = undefined;

    exports.up = (pgm) => {
      pgm.createTable('playlists', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
        name: {
          type: 'TEXT',
          notNull: true,
        },
        owner: {
          type: 'VARCHAR(50)',
          notNull: true,
          references: 'users',
          onDelete: 'cascade',
        },
      });
    };

    exports.down = (pgm) => {
      pgm.dropTable('playlists');
    };