exports.shorthands = undefined;

    exports.up = (pgm) => {
      pgm.createTable('albums', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
        name: {
          type: 'TEXT',
          notNull: true,
        },
        year: {
          type: 'SMALLINT',
          notNull: true,
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
      pgm.dropTable('albums');
    };