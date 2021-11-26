import CommentRepository from '../../../Domains/comments/CommentRepository';
import ReplyRepository from '../../../Domains/replies/ReplyRepository';
import ThreadRepository from '../../../Domains/threads/ThreadRepository';
import GetThreadUseCase from '../GetThreadUseCase';

describe('GetThreadUseCase', () => {
  it('should throw error if use case payload not contain id', async () => {
    // Arrange
    const useCasePayload = {};
    const getThreadUseCase = new GetThreadUseCase({});

    // Action & Assert
    await expect(getThreadUseCase.execute(useCasePayload)).rejects.toThrowError(
      'GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error if id not string', async () => {
    // Arrange
    const useCasePayload = {
      id: ['thread-123'],
    };
    const getThreadUseCase = new GetThreadUseCase({});

    // Action & Assert
    await expect(getThreadUseCase.execute(useCasePayload)).rejects.toThrowError(
      'GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
    };
    const definedDate = new Date().toISOString();
    const expectingThread = {
      id: 'thread-123',
      title: 'some title',
      body: 'some body',
      username: 'dicoding',
      date: definedDate,
    };
    const expectingComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: definedDate,
        content: 'some comment content',
      },
    ];
    const expectingReplies = [
      {
        id: 'reply-123',
        username: 'dicoding',
        date: definedDate,
        content: 'some reply content',
      },
    ];
    const expectingDetailThread = {
      ...expectingThread,
      comments: [{ ...expectingComments[0], replies: expectingReplies }],
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mocking
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectingThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectingComments));
    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectingReplies));

    // Action
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    const thread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(thread).toStrictEqual(expectingDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.id
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.id
    );
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(
      expectingComments[0].id
    );
  });
});
