import InvariantError from './InvariantError';

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat user baru karena tipe data tidak sesuai'
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat user baru karena karakter username melebihi batas limit'
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang'
  ),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan username dan password'
  ),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'username dan password harus string'
  ),
  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
  ),
  'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat thread baru karena tipe data tidak sesuai'
  ),
  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'
  ),
  'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat komentar baru karena tipe data tidak sesuai'
  ),
  'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada'
  ),
  'NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat balasan baru karena tipe data tidak sesuai'
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  'ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan id user'
  ),
  'ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'id user harus string'
  ),
  'GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan id thread'
  ),
  'GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'id thread harus string'
  ),
  'ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan id thread dan id user'
  ),
  'ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'id thread dan id user harus string'
  ),
  'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan id thread, id komentar, dan id user'
  ),
  'DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('id thread, id komentar, dan id user harus string'),
  'ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan id thread, id komentar, dan id user'
  ),
  'ADD_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'id thread, id komentar, dan id user harus string'
  ),
  'DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan id komentar, id balasan, dan id user'
  ),
  'DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'id komentar, id balasan, dan id user harus string'
  ),
  'TOGGLE_COMMENT_LIKE_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY':
    new InvariantError('harus mengirimkan id thread, id komentar, dan id user'),
  'TOGGLE_COMMENT_LIKE_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('id thread, id komentar, dan id user harus string'),
};

export default DomainErrorTranslator;
