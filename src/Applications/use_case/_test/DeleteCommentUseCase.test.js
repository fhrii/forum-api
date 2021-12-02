import CommentRepository from '../../../Domains/comments/CommentRepository';
import DeleteCommentUseCase from '../DeleteCommentUseCase';

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      threadId: 'thread-123',
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(
      deleteCommentUseCase.execute(useCasePayload)
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
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(
      deleteCommentUseCase.execute(useCasePayload)
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
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Mocking
    mockCommentRepository.verifyComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

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
