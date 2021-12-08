import NotFoundError from '../../Commons/exceptions/NotFoundError';

class ToggleCommentLikeUseCase {
  constructor({ threadRepository, commentRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);

    const { threadId, commentId, owner } = useCasePayload;

    await this._threadRepository.checkThreadExistance(threadId);
    await this._commentRepository.checkCommentExistance(commentId);

    try {
      await this._commentLikeRepository.checkCommentLikeExistance(
        commentId,
        owner
      );
      await this._commentLikeRepository.toggleCommentLike(commentId, owner);
    } catch (error) {
      if (!(error instanceof NotFoundError)) throw error;

      await this._commentLikeRepository.addCommentLike(commentId, owner);
    }
  }

  _verifyPayload({ threadId, commentId, owner }) {
    if (!threadId || !commentId || !owner)
      throw new Error(
        'TOGGLE_COMMENT_LIKE_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
      );

    if (
      typeof threadId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof owner !== 'string'
    )
      throw new Error(
        'TOGGLE_COMMENT_LIKE_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
  }
}

export default ToggleCommentLikeUseCase;
