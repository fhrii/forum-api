import NewReply from '../NewReply';

describe('a NewReply entities', () => {
  it('should throw error when payload not contain needed properti', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action & Arrange
    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create newReply entities correctly', () => {
    // Arrange
    const payload = {
      content: 'some reply content',
    };

    // Action
    const newReply = new NewReply(payload);

    // Assert
    expect(newReply).toBeInstanceOf(NewReply);
    expect(newReply.content).toEqual(payload.content);
  });
});
