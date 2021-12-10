import AddedReply from '../../../replies/entities/AddedReply';
import DetailReply from '../../../replies/entities/DetailReply';
import DetailComment from '../DetailComment';

describe('an DetailComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'some comment content',
      date: 'some-date',
      username: 'user-123',
      isDeleted: false,
      replies: [],
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'some comment content',
      date: 'some-date',
      username: 'user-123',
      likeCount: '0',
      isDeleted: false,
      replies: [],
    };
    const anotherPayload = {
      ...payload,
      replies: [
        new AddedReply({
          id: 'reply-123',
          content: 'some reply content',
          owner: 'user-123',
        }),
      ],
    };

    // Action && Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
    expect(() => new DetailComment(anotherPayload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create detailComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'some comment content',
      date: 'some-date',
      username: 'user-123',
      likeCount: 0,
      isDeleted: false,
      replies: [
        new DetailReply({
          id: 'reply-123',
          content: 'some reply content',
          date: 'some-date',
          username: 'user-123',
          isDeleted: false,
        }),
      ],
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.likeCount).toEqual(payload.likeCount);
    expect(detailComment.replies).toEqual(payload.replies);
  });

  it('should create deleted detailComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'some comment content',
      date: 'some-date',
      username: 'user-123',
      likeCount: 0,
      isDeleted: true,
      replies: [
        new DetailReply({
          id: 'reply-123',
          content: 'some reply content',
          date: 'some-date',
          username: 'user-123',
          isDeleted: false,
        }),
      ],
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.content).not.toEqual(payload.content);
    expect(detailComment.content).toEqual('**komentar telah dihapus**');
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.likeCount).toEqual(payload.likeCount);
    expect(detailComment.replies).toEqual(payload.replies);
  });
});
