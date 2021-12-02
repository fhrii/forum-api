import DetailComment from '../../Domains/comments/entities/DetailComment';
import DetailReply from '../../Domains/replies/entities/DetailReply';
import DetailThread from '../../Domains/threads/entities/DetailThread';

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    const { id } = useCasePayload;
    const [{ created_at: threadDate, ...thread }, comments] = await Promise.all(
      [
        this._threadRepository.getThreadById(id),
        this._commentRepository.getCommentsByThreadId(id),
      ]
    );

    thread.date = threadDate;
    thread.comments = await Promise.all(
      comments.map(async (comment) => {
        const {
          created_at: commentDate,
          content: commentContent,
          is_deleted: isCommentDeleted,
          ...newComment
        } = comment;
        const replies = await this._replyRepository.getRepliesByCommentId(
          newComment.id
        );

        newComment.content = !isCommentDeleted
          ? commentContent
          : '**komentar telah dihapus**';
        newComment.date = commentDate;
        newComment.replies = replies.map(
          ({
            created_at: replyDate,
            content: replyContent,
            is_deleted: isReplyDeleted,
            ...reply
          }) =>
            new DetailReply({
              ...reply,
              content: !isReplyDeleted
                ? replyContent
                : '**balasan telah dihapus**',
              date: replyDate,
            })
        );

        return new DetailComment({ ...newComment, date: commentDate });
      })
    );

    return new DetailThread(thread);
  }

  _verifyPayload({ id }) {
    if (!id) throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof id !== 'string')
      throw new Error('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

export default GetThreadUseCase;
