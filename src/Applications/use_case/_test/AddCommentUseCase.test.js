import CommentRepository from '../../../Domains/comments/CommentRepository';
import AddedComment from '../../../Domains/comments/entities/AddedComment';
import NewComment from '../../../Domains/comments/entities/NewComment';
import ThreadRepository from '../../../Domains/threads/ThreadRepository';
import AddComentUseCase from '../AddCommentUseCase';

describe('AddCommentUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {
      content: 'some comment content',
      threadId: 'thread-123',
    };
    const addCommentUseCase = new AddComentUseCase({});

    // Action & Assert
    await expect(
      addCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError('ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      content: 'some comment content',
      threadId: 123,
      owner: 'user-123',
    };
    const addCommentUseCase = new AddComentUseCase({});

    // Action & Assert
    await expect(
      addCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'some comment content',
      threadId: 'thread-123',
      owner: 'user-123',
    };
    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mocking
    mockCommentRepository.addComment = jest.fn(() =>
      Promise.resolve(expectedAddedComment)
    );
    mockThreadRepository.checkThreadExistance = jest.fn(() =>
      Promise.resolve()
    );

    const addCommentUseCase = new AddComentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const comment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(comment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.checkThreadExistance).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({ content: useCasePayload.content }),
      useCasePayload.threadId,
      useCasePayload.owner
    );
  });
});
