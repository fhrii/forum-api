/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool';

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    commentId = 'comment-123',
    content = 'some reply content',
    owner = 'user-123',
    isDeleted = false,
    createdAt = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, commentId, content, owner, isDeleted, createdAt, createdAt],
    };

    await pool.query(query);
  },
  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

export default RepliesTableTestHelper;
