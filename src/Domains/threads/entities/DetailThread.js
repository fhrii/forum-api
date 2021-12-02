import DetailComment from '../../comments/entities/DetailComment';

class DetailThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body, date, username, comments } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  _verifyPayload({ id, title, date, username, comments }) {
    if (!id || !title || !date || !username || !comments)
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string' ||
      !Array.isArray(comments) ||
      comments.some((comment) => !(comment instanceof DetailComment))
    )
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

export default DetailThread;
