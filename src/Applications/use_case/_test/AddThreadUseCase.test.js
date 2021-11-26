import AddThreadUseCase from '../AddThreadUseCase';
import AddedThread from '../../../Domains/threads/entities/AddedThread';
import NewThread from '../../../Domains/threads/entities/NewThread';
import ThreadRepository from '../../../Domains/threads/ThreadRepository';

describe('AddThreadUseCase', () => {
  it('should throw error if use case payload  not contain owner', async () => {
    // Arrange
    const useCasePayload = {
      title: 'some title',
      body: 'some thread body',
    };
    const addThreadUsCase = new AddThreadUseCase({});

    // Action & Assert
    await expect(addThreadUsCase.execute(useCasePayload)).rejects.toThrowError(
      'ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error if owner not string', async () => {
    // Arrange
    const useCasePayload = {
      title: 'some title',
      body: 'some thread body',
      owner: 1234,
    };
    const addThreadUseCase = new AddThreadUseCase({});

    // Action & Assert
    await expect(addThreadUseCase.execute(useCasePayload)).rejects.toThrowError(
      'ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'some title',
      body: 'some thread body',
      owner: 'user-123',
    };
    const expectingAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.body,
      owner: useCasePayload.owner,
    });
    const mockThreadRepository = new ThreadRepository();

    // Mocking
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectingAddedThread));

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectingAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({ title: useCasePayload.title, body: useCasePayload.body }),
      useCasePayload.owner
    );
  });
});
