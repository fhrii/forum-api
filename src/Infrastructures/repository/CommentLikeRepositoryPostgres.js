import NotFoundError from '../../Commons/exceptions/NotFoundError';
import CommentLikeRepository from '../../Domains/commentlikes/CommentLikeRepository';

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentLike(commentId, owner) {
    const id = `commentlike-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO commentlikes VALUES($1, $2, $3, DEFAULT, DEFAULT, DEFAULT) RETURNING id',
      values: [id, commentId, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getNumberOfCommentLikesByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(*) FROM commentlikes WHERE comment_id = $1 AND is_deleted = false',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return +result.rows[0].count;
  }

  async toggleCommentLike(commentId, owner) {
    const query = {
      text: 'UPDATE commentlikes SET is_deleted = NOT is_deleted WHERE comment_id = $1 AND owner = $2 RETURNING id',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async checkCommentLikeExistance(commentId, owner) {
    const query = {
      text: 'SELECT id FROM commentlikes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount)
      throw new NotFoundError('Comment like tidak ditemukan');

    return result.rows[0];
  }
}

export default CommentLikeRepositoryPostgres;
