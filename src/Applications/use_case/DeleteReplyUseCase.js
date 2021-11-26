class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);

    const { id, commentId, owner } = useCasePayload;
    await this._replyRepository.verifyReply(id, owner);
    await this._replyRepository.deleteReply(commentId, id);
  }

  _verifyPayload({ id, commentId, owner }) {
    if (!id || !commentId || !owner)
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');

    if (
      typeof id !== 'string' ||
      typeof commentId !== 'string' ||
      typeof owner !== 'string'
    )
      throw new Error('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

export default DeleteReplyUseCase;
