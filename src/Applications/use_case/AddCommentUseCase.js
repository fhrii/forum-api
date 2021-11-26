import NewComment from '../../Domains/comments/entities/NewComment';

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newComment = new NewComment(useCasePayload);
    this._verifyPayload(useCasePayload);

    const { threadId, owner } = useCasePayload;
    await this._threadRepository.checkThreadExistance(threadId);

    return this._commentRepository.addComment(newComment, threadId, owner);
  }

  _verifyPayload({ threadId, owner }) {
    if (!threadId || !owner)
      throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof threadId !== 'string' || typeof owner !== 'string')
      throw new Error('ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

export default AddCommentUseCase;
