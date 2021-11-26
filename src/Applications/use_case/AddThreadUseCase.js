import NewThread from '../../Domains/threads/entities/NewThread';

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newThread = new NewThread(useCasePayload);
    this._verifyPayload(useCasePayload);

    return this._threadRepository.addThread(newThread, useCasePayload.owner);
  }

  _verifyPayload({ owner }) {
    if (!owner)
      throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof owner !== 'string')
      throw new Error('ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

export default AddThreadUseCase;
