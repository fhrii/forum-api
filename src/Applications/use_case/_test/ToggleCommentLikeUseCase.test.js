import NotFoundError from '../../../Commons/exceptions/NotFoundError';
import CommentLikeRepository from '../../../Domains/commentlikes/CommentLikeRepository';
import CommentRepository from '../../../Domains/comments/CommentRepository';
import ThreadRepository from '../../../Domains/threads/ThreadRepository';
import ToggleCommentLikeUseCase from '../ToggleCommentLikeUseCase';

describe('ToggleCommentLikeUseCase', () => {
  it('should throw error when use case payload not contain needed data property', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({});

    // Action & Assert
    await expect(
      toggleCommentLikeUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'TOGGLE_COMMENT_LIKE_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({});

    // Action & Assert
    await expect(
      toggleCommentLikeUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'TOGGLE_COMMENT_LIKE_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw error when thread not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
    });

    // Mocking
    mockThreadRepository.checkThreadExistance = jest.fn(() =>
      Promise.reject(new NotFoundError())
    );

    // Action & Assert
    await expect(
      toggleCommentLikeUseCase.execute(useCasePayload)
    ).rejects.toThrowError(NotFoundError);
  });

  it('should throw error when comment not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Mocking
    mockThreadRepository.checkThreadExistance = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.checkCommentExistance = jest.fn(() =>
      Promise.reject(new NotFoundError())
    );

    // Action & Assert
    await expect(
      toggleCommentLikeUseCase.execute(useCasePayload)
    ).rejects.toThrowError(NotFoundError);
  });

  it('should throw error when use case throwing error except not found error', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Mocking
    mockThreadRepository.checkThreadExistance = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.checkCommentExistance = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentLikeRepository.checkCommentLikeExistance = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentLikeRepository.toggleCommentLike = jest.fn(() =>
      Promise.reject(new Error('something happened'))
    );

    // Action & Assert
    await expect(
      toggleCommentLikeUseCase.execute(useCasePayload)
    ).rejects.toThrowError('something happened');
  });

  it('should orchestrating the toggle comment like action correctly even the comment like did not exist', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Mocking
    mockThreadRepository.checkThreadExistance = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.checkCommentExistance = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentLikeRepository.checkCommentLikeExistance = jest.fn(() =>
      Promise.reject(new NotFoundError())
    );
    mockCommentLikeRepository.addCommentLike = jest.fn(() => Promise.resolve());

    // Action && Assert
    await expect(
      toggleCommentLikeUseCase.execute(useCasePayload)
    ).resolves.not.toThrowError();
    expect(mockThreadRepository.checkThreadExistance).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.checkCommentExistance).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockCommentLikeRepository.checkCommentLikeExistance).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(mockCommentLikeRepository.addCommentLike).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
  });

  it('should orchestrating the toggle comment like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Mocking
    mockThreadRepository.checkThreadExistance = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.checkCommentExistance = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentLikeRepository.checkCommentLikeExistance = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentLikeRepository.toggleCommentLike = jest.fn(() =>
      Promise.resolve()
    );

    // Action && Assert
    await expect(
      toggleCommentLikeUseCase.execute(useCasePayload)
    ).resolves.not.toThrowError();
    expect(mockThreadRepository.checkThreadExistance).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.checkCommentExistance).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockCommentLikeRepository.checkCommentLikeExistance).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(mockCommentLikeRepository.toggleCommentLike).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
  });
});
