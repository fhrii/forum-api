import ReplyRepository from '../../../Domains/replies/ReplyRepository';
import DeleteReplyUseCase from '../DeleteReplyUseCase';

describe('DeleteReplyUseCase', () => {
  it('should throw error when use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      owner: 'user-123',
    };
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(
      deleteReplyUseCase.execute(useCasePayload)
    ).rejects.toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      id: 123,
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(
      deleteReplyUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the delete reply action corectly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const mockReplyRepository = new ReplyRepository();
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Mocking
    mockReplyRepository.verifyReply = jest.fn(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve());

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.verifyReply).toBeCalledWith(
      useCasePayload.id,
      useCasePayload.owner
    );
    expect(mockReplyRepository.deleteReply).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.id
    );
  });
});
