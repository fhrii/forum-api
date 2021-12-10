class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, username, isDeleted } = payload;

    this.id = id;
    this.content = isDeleted ? '**balasan telah dihapus**' : content;
    this.date = date;
    this.username = username;
  }

  _verifyPayload({ id, content, date, username, isDeleted }) {
    if (
      !id ||
      !content ||
      !date ||
      !username ||
      typeof isDeleted === 'undefined'
    )
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string' ||
      typeof isDeleted !== 'boolean'
    )
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

export default DetailReply;
