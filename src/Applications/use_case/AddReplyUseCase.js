import NewReply from '../../Domains/replies/entities/NewReply';

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newReply = new NewReply(useCasePayload);
    this._verifyPayload(useCasePayload);

    const { threadId, commentId, owner } = useCasePayload;
    await this._threadRepository.checkThreadExistance(threadId);
    await this._commentRepository.checkCommentExistance(commentId);

    return this._replyRepository.addReply(newReply, commentId, owner);
  }

  _verifyPayload({ threadId, commentId, owner }) {
    if (!threadId || !commentId || !owner)
      throw new Error('ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');

    if (
      typeof threadId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof owner !== 'string'
    )
      throw new Error('ADD_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

export default AddReplyUseCase;
