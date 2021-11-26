import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase';

class ThreadCommentsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.deleteThreadCommentHandler =
      this.deleteThreadCommentHandler.bind(this);
  }

  async postThreadCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const { threadId } = request.params;
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const addedComment = await addCommentUseCase.execute({
      content,
      threadId,
      owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );

    const { id, threadId } = request.params;
    const { id: owner } = request.auth.credentials;

    await deleteCommentUseCase.execute({ id, threadId, owner });

    return h.response({
      status: 'success',
    });
  }
}

export default ThreadCommentsHandler;
