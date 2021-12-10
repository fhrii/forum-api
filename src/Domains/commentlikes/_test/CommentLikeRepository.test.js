import CommentLikeRepository from '../CommentLikeRepository';

describe('ComentLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentLikeRepository = new CommentLikeRepository();

    // Action & Assert
    await expect(
      commentLikeRepository.addCommentLike('', '')
    ).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      commentLikeRepository.toggleCommentLike('')
    ).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      commentLikeRepository.getNumberOfCommentLikesByCommentIds([''])
    ).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      commentLikeRepository.checkCommentLikeExistance('', '')
    ).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
