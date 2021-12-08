import ToggleCommentLikeUseCase from '../../../../Applications/use_case/ToggleCommentLikeUseCase';

class ThreadCommentLikesHandler {
  constructor(container) {
    this._container = container;

    this.putThreadCommentLikeHandler =
      this.putThreadCommentLikeHandler.bind(this);
  }

  async putThreadCommentLikeHandler(request, h) {
    const toggleCommentLikeUseCase = this._container.getInstance(
      ToggleCommentLikeUseCase.name
    );
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    await toggleCommentLikeUseCase.execute({ threadId, commentId, owner });

    return h.response({ status: 'success' });
  }
}

export default ThreadCommentLikesHandler;
