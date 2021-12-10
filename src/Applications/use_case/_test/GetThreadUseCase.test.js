import CommentLikeRepository from '../../../Domains/commentlikes/CommentLikeRepository';
import CommentRepository from '../../../Domains/comments/CommentRepository';
import DetailComment from '../../../Domains/comments/entities/DetailComment';
import DetailReply from '../../../Domains/replies/entities/DetailReply';
import ReplyRepository from '../../../Domains/replies/ReplyRepository';
import DetailThread from '../../../Domains/threads/entities/DetailThread';
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
    const expectedThread = {
      id: 'thread-123',
      title: 'some title',
      body: 'some body',
      username: 'dicoding',
      created_at: definedDate,
    };
    const expectedComments = [
      {
        id: 'comment-123',
        thread_id: 'thread-123',
        username: 'dicoding',
        is_deleted: false,
        created_at: definedDate,
        content: 'some comment content',
      },
      {
        id: 'comment-234',
        thread_id: 'thread-123',
        username: 'dicoding',
        is_deleted: true,
        created_at: definedDate,
        content: 'some comment2 content',
      },
    ];
    const expectedCommentLikes = [
      {
        comment_id: 'comment-123',
      },
    ];
    const expectedReplies = [
      {
        id: 'reply-123',
        comment_id: 'comment-123',
        username: 'dicoding',
        is_deleted: true,
        created_at: definedDate,
        content: 'some reply content',
      },
      {
        id: 'reply-234',
        comment_id: 'comment-234',
        username: 'dicoding',
        is_deleted: false,
        created_at: definedDate,
        content: 'some reply2 content',
      },
    ];
    const expectedDetailThread = new DetailThread({
      id: expectedThread.id,
      title: expectedThread.title,
      body: expectedThread.body,
      username: expectedThread.username,
      date: expectedThread.created_at,
      comments: [
        new DetailComment({
          id: 'comment-123',
          content: 'some comment content',
          date: definedDate,
          username: 'dicoding',
          likeCount: 1,
          isDeleted: false,
          replies: [
            new DetailReply({
              id: 'reply-123',
              username: 'dicoding',
              date: definedDate,
              content: 'some reply content',
              isDeleted: true,
            }),
          ],
        }),
        new DetailComment({
          id: 'comment-234',
          content: 'some comment content',
          date: definedDate,
          username: 'dicoding',
          likeCount: 0,
          isDeleted: true,
          replies: [
            new DetailReply({
              id: 'reply-234',
              username: 'dicoding',
              date: definedDate,
              content: 'some reply2 content',
              isDeleted: false,
            }),
          ],
        }),
      ],
    });
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    // Mocking
    mockThreadRepository.getThreadById = jest.fn(() =>
      Promise.resolve(expectedThread)
    );
    mockCommentRepository.getCommentsByThreadId = jest.fn(() =>
      Promise.resolve(expectedComments)
    );
    mockReplyRepository.getRepliesByCommentIds = jest.fn(() =>
      Promise.resolve(expectedReplies)
    );
    mockCommentLikeRepository.getNumberOfCommentLikesByCommentIds = jest.fn(
      () => Promise.resolve(expectedCommentLikes)
    );

    // Action
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });
    const thread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(thread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.id
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.id
    );
    expect(mockReplyRepository.getRepliesByCommentIds).toBeCalledWith([
      expectedComments[0].id,
      expectedComments[1].id,
    ]);
    expect(
      mockCommentLikeRepository.getNumberOfCommentLikesByCommentIds
    ).toBeCalledWith([expectedComments[0].id, expectedComments[1].id]);
  });
});
