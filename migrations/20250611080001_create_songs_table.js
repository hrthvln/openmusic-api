/* eslint-disable camelcase */

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
      // Boleh null atau undefined sesuai kriteria
    },
    albumId: {
      type: 'VARCHAR(50)',
      references: 'albums', // Foreign key ke tabel albums
      onDelete: 'cascade', // Jika album dihapus, lagu-lagu terkait juga dihapus
      // Boleh null atau undefined sesuai kriteria
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
      default: pgm.func('current_timestamp'), // Tambahkan default timestamp
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
      default: pgm.func('current_timestamp'), // Tambahkan default timestamp
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};