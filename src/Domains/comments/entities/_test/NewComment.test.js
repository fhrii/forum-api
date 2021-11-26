import NewComment from '../NewComment';

describe('a NewComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Arrange
    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = { content: 1234 };

    // Action & Arrange
    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT'.NOT_MEET_DATA_TYPE_SPECIFICATION
    );
  });
});
