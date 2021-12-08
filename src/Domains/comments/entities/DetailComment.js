import DetailReply from '../../replies/entities/DetailReply';

class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, username, likeCount, replies } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.likeCount = likeCount;
    this.replies = replies;
  }

  _verifyPayload({ id, content, date, username, likeCount, replies }) {
    if (
      !id ||
      !content ||
      !date ||
      !username ||
      typeof likeCount === 'undefined' ||
      !replies
    )
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string' ||
      typeof likeCount !== 'number' ||
      !Array.isArray(replies) ||
      replies.some((reply) => !(reply instanceof DetailReply))
    )
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

export default DetailComment;
