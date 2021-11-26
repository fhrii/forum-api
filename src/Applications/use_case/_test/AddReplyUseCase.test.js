import NotFoundError from '../../../Commons/exceptions/NotFoundError';
import CommentRepository from '../../../Domains/comments/CommentRepository';
import AddedReply from '../../../Domains/replies/entities/AddedReply';
import ReplyRepository from '../../../Domains/replies/ReplyRepository';
import ThreadRepository from '../../../Domains/threads/ThreadRepository';
import AddReplyUseCase from '../AddReplyUseCase';

describe('AddReplyUseCase', () => {
  it('should throw error when use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {
      content: 'some reply content',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const addReplyUseCase = new AddReplyUseCase({});

    // Action & Assert
    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError(
      'ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      content: 'some reply content',
      threadId: 'thread-123',
      commentId: ['comment-123'],
      owner: 'user-123',
    };
    const addReplyUseCase = new AddReplyUseCase({});

    // Action & Assert
    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError(
      'ADD_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'some reply content',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const expectingAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Mocking
    mockThreadRepository.checkThreadExistance = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentExistance = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectingAddedReply));

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(expectingAddedReply);
    expect(mockThreadRepository.checkThreadExistance).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.checkCommentExistance).toBeCalledWith(
      useCasePayload.commentId
    );
  });
});
