exports.shorthands = undefined;

    exports.up = (pgm) => {
      pgm.createTable('songs', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
        title: {
          type: 'TEXT',
          notNull: true,
        },
        year: {
          type: 'SMALLINT',
          notNull: true,
        },
        genre: {
          type: 'TEXT',
          notNull: true,
        },
        performer: {
          type: 'TEXT',
          notNull: true,
        },
        duration: {
          type: 'INTEGER',
        },
        albumId: {
          type: 'VARCHAR(50)',
          references: 'albums',
          onDelete: 'cascade',
        },
        created_at: {
          type: 'TEXT',
          notNull: true,
          default: pgm.func('current_timestamp'),
        },
        updated_at: {
          type: 'TEXT',
          notNull: true,
          default: pgm.func('current_timestamp'),
        },
      });
    };

    exports.down = (pgm) => {
      pgm.dropTable('songs');
    };