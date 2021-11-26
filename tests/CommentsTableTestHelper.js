/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool';

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    threadId = 'thread-123',
    content = 'some comment content',
    owner = 'user-123',
    isDeleted = false,
    createdAt = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, threadId, content, owner, isDeleted, createdAt, createdAt],
    };

    await pool.query(query);
  },
  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

export default CommentsTableTestHelper;
