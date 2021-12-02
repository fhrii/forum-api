import AuthorizationError from '../../Commons/exceptions/AuthorizationError';
import NotFoundError from '../../Commons/exceptions/NotFoundError';
import CommentRepository from '../../Domains/comments/CommentRepository';
import AddedComment from '../../Domains/comments/entities/AddedComment';

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment, threadId, owner) {
    const { content } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, DEFAULT, DEFAULT, DEFAULT) RETURNING id, content, owner',
      values: [id, threadId, content, owner],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async getCommentsByThreadId(id) {
    const query = {
      text: 'SELECT comments.id, users.username, comments.is_deleted, comments.created_at, comments.content FROM comments LEFT JOIN users ON comments.owner = users.id WHERE comments.thread_id = $1 ORDER BY comments.created_at',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteComment(threadId, id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1 AND thread_id = $2 RETURNING id',
      values: [id, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('komentar tidak ditemukan');
  }

  async verifyComment(id, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('komentar tidak ditemukan');

    const comment = result.rows[0];

    if (comment.owner !== owner)
      throw new AuthorizationError('tidak dapat mengakses resource');
  }

  async checkCommentExistance(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('komentar tidak ditemukan');
  }
}

export default CommentRepositoryPostgres;
