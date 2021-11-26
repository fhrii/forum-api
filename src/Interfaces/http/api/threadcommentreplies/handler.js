import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase';
import DeleteReplyUseCase from '../../../../Applications/use_case/DeleteReplyUseCase';

class ThreadCommentRepliesHandler {
  constructor(container) {
    this._container = container;

    this.postThreadCommentReplyHandler =
      this.postThreadCommentReplyHandler.bind(this);
    this.deleteThreadCommentReplyHandler =
      this.deleteThreadCommentReplyHandler.bind(this);
  }

  async postThreadCommentReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const addedReply = await addReplyUseCase.execute({
      content,
      threadId,
      commentId,
      owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );
    const { id, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    await deleteReplyUseCase.execute({ id, commentId, owner });

    return h.response({
      status: 'success',
    });
  }
}

export default ThreadCommentRepliesHandler;
