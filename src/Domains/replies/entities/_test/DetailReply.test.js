import DetailReply from '../DetailReply';

describe('an DetailReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'some reply content',
      date: 'some date',
    };

    // Action & Assert
    expect(() => new DetailReply(payload)).toThrowError(
      'DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'some reply content',
      date: 'some-date',
      username: 123,
    };

    // Action & Asssert
    expect(() => new DetailReply(payload)).toThrowError(
      'DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create detailReply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'some reply content',
      date: 'some-date',
      username: 'user-123',
    };

    // Action
    const detailReply = new DetailReply(payload);

    expect(detailReply).toBeInstanceOf(DetailReply);
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.content).toEqual(payload.content);
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.username).toEqual(payload.username);
  });
});
