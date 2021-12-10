class CommentLikeRepository {
  async addCommentLike(_commentId, _owner) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async toggleCommentLike(_commentId, _owner) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getNumberOfCommentLikesByCommentIds(_commentIds) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async checkCommentLikeExistance(_commentId, _owner) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default CommentLikeRepository;
