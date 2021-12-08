exports.up = (pgm) => {
  pgm.createTable('commentlikes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    is_deleted: {
      type: 'BOOL',
      notNull: true,
      default: false,
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
      onUpdate: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint(
    'commentlikes',
    'unique_comment_id_and_owner',
    'UNIQUE(comment_id, owner)'
  );

  pgm.addConstraint(
    'commentlikes',
    'fk_commentlikes.comment_id_comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'commentlikes',
    'fk_collaborations.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('commentlikes');
};
