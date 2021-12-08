/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool';

const CommentLikesTableHelper = {
  async addCommentLike({
    id = 'commentlike-123',
    commentId = 'comment-123',
    owner = 'user-123',
    isDeleted = false,
    createdAt = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO commentlikes VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, commentId, owner, isDeleted, createdAt, createdAt],
    };

    await pool.query(query);
  },
  async findCommentLikesById(id) {
    const query = {
      text: 'SELECT * FROM commentlikes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },
  async findCommentLikesByCommentId(id) {
    const query = {
      text: 'SELECT * FROM commentlikes WHERE comment_id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM commentlikes WHERE 1=1');
  },
};

export default CommentLikesTableHelper;
