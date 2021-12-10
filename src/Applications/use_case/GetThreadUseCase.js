import DetailComment from '../../Domains/comments/entities/DetailComment';
import DetailReply from '../../Domains/replies/entities/DetailReply';
import DetailThread from '../../Domains/threads/entities/DetailThread';

class GetThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    commentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    const { id } = useCasePayload;
    const [thread, comments] = await Promise.all([
      this._threadRepository.getThreadById(id),
      this._commentRepository.getCommentsByThreadId(id),
    ]);

    const commentIds = comments.map((comment) => comment.id);
    const [replies, likes] = await Promise.all([
      this._replyRepository.getRepliesByCommentIds(commentIds),
      this._commentLikeRepository.getNumberOfCommentLikesByCommentIds(
        commentIds
      ),
    ]);

    thread.date = thread.created_at;
    thread.comments = await Promise.all(
      comments.map(async (comment) => {
        const newComment = { ...comment };

        newComment.date = comment.created_at;
        newComment.likeCount = likes.filter(
          (like) => like.comment_id === comment.id
        ).length;
        newComment.isDeleted = comment.is_deleted;
        newComment.replies = replies
          .filter((reply) => reply.comment_id === comment.id)
          .map(
            (reply) =>
              new DetailReply({
                ...reply,
                date: reply.created_at,
                isDeleted: reply.is_deleted,
              })
          );

        return new DetailComment(newComment);
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
