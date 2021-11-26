import CommentRepository from '../../../Domains/comments/CommentRepository';
import DeleteCommentUseCase from '../DeleteCommentUseCase';

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      threadId: 'thread-123',
    };
    const getCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(
      getCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error if use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      threadId: 123,
      owner: 'user-123',
    };
    const getCommentUseCase = new DeleteCommentUseCase({});

    await expect(
      getCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };
    const mockCommentRepository = new CommentRepository();
    const getCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Mocking
    mockCommentRepository.verifyComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Action
    await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyComment).toBeCalledWith(
      useCasePayload.id,
      useCasePayload.owner
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      useCasePayload.threadId,
      useCasePayload.id
    );
  });
});
