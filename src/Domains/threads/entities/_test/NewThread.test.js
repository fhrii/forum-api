import NewThread from '../NewThread';

describe('a NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = { title: 'dicoding backend' };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: ['dicoding backend'],
      body: 'some thread body',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create newThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'some title',
      body: 'some thread body',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });
});
