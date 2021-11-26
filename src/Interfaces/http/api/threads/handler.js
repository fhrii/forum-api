import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase';
import GetThreadUseCase from '../../../../Applications/use_case/GetThreadUseCase';

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: owner } = request.auth.credentials;
    const payload = { ...request.payload, owner };
    const addedThread = await addThreadUseCase.execute(payload);
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request, h) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const { id } = request.params;
    const thread = await getThreadUseCase.execute({ id });
    return h.response({
      status: 'success',
      data: {
        thread,
      },
    });
  }
}

export default ThreadsHandler;
