import DetailComment from '../../../comments/entities/DetailComment';
import DetailReply from '../../../replies/entities/DetailReply';
import DetailThread from '../DetailThread';

describe('an DetailThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'some title',
      body: 'some thread body',
      date: 'some-date',
      username: 'user-123',
    };

    // Action && Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'some title',
      body: 'some thread body',
      date: 'some-date',
      username: 'user-123',
      comments: 'some-comment',
    };
    const anotherPayload = {
      ...payload,
      comments: [
        new DetailReply({
          id: 'user-123',
          content: 'some reply content',
          date: 'some-date',
          username: 'user-123',
          isDeleted: false,
        }),
      ],
    };

    // Action && Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
    expect(() => new DetailThread(anotherPayload)).toThrowError(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create detailThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'some title',
      body: 'some thread body',
      date: 'some-date',
      username: 'user-123',
      comments: [
        new DetailComment({
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
        }),
      ],
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread).toBeInstanceOf(DetailThread);
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.comments).toEqual(payload.comments);
  });
});
