class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);

    const { id, threadId, owner } = useCasePayload;
    await this._commentRepository.verifyComment(id, owner);
    await this._commentRepository.deleteComment(threadId, id);
  }

  _verifyPayload({ id, threadId, owner }) {
    if (!id || !threadId || !owner)
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');

    if (
      typeof id !== 'string' ||
      typeof threadId !== 'string' ||
      typeof owner !== 'string'
    )
      throw new Error(
        'DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
  }
}

export default DeleteCommentUseCase;
