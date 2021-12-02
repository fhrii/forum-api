import AuthorizationError from '../../Commons/exceptions/AuthorizationError';
import NotFoundError from '../../Commons/exceptions/NotFoundError';
import AddedReply from '../../Domains/replies/entities/AddedReply';
import ReplyRepository from '../../Domains/replies/ReplyRepository';

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply, commentId, owner) {
    const { content } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const isDeleted = false;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, commentId, content, owner, isDeleted, createdAt, createdAt],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async getRepliesByCommentId(id) {
    const query = {
      text: 'SELECT replies.id, users.username, replies.is_deleted, replies.created_at, replies.content FROM replies LEFT JOIN users ON replies.owner = users.id WHERE replies.comment_id = $1 ORDER BY replies.created_at',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteReply(commentId, id) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1 AND comment_id  = $2 RETURNING id',
      values: [id, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('balasan tidak ditemukan');
  }

  async verifyReply(id, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('balasan tidak ditemukan');

    const comment = result.rows[0];

    if (comment.owner !== owner)
      throw new AuthorizationError('tidak dapat mengakses resource');
  }
}

export default ReplyRepositoryPostgres;
