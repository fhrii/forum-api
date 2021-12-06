import CommentLikeRepository from '../CommentLikeRepository';

describe('ComentLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', () => {
    // Arrange
    const commentLikeRepository = new CommentLikeRepository();

    // Action & Assert
    expect(() => commentLikeRepository.addCommentLike('', '')).toThrowError(
      'COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    expect(() =>
      commentLikeRepository.toggleCommentLikeByCommentId('')
    ).toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(() =>
      commentLikeRepository.getNumberOfCommentLikesByCommentId('')
    ).toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(() =>
      commentLikeRepository.checkCommentLikeExistance('', '')
    ).toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
