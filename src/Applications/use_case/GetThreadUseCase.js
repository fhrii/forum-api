class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    const { id } = useCasePayload;
    const [thread, comments] = await Promise.all([
      this._threadRepository.getThreadById(id),
      this._commentRepository.getCommentsByThreadId(id),
    ]);

    thread.comments = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(
          comment.id
        );

        return { ...comment, replies };
      })
    );

    return thread;
  }

  _verifyPayload({ id }) {
    if (!id) throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof id !== 'string')
      throw new Error('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

export default GetThreadUseCase;
