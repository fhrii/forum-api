import DomainErrorTranslator from '../DomainErrorTranslator';
import InvariantError from '../InvariantError';

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena tipe data tidak sesuai'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena karakter username melebihi batas limit'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena username mengandung karakter terlarang'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError('harus mengirimkan username dan password')
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(new InvariantError('username dan password harus string'));
    expect(
      DomainErrorTranslator.translate(
        new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat komentar baru karena tipe data tidak sesuai'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat balasan baru karena tipe data tidak sesuai'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
      )
    ).toStrictEqual(new InvariantError('harus mengirimkan token refresh'));
    expect(
      DomainErrorTranslator.translate(
        new Error(
          'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
        )
      )
    ).toStrictEqual(new InvariantError('refresh token harus string'));
    expect(
      DomainErrorTranslator.translate(
        new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
      )
    ).toStrictEqual(new InvariantError('harus mengirimkan token refresh'));
    expect(
      DomainErrorTranslator.translate(
        new Error(
          'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
        )
      )
    ).toStrictEqual(new InvariantError('refresh token harus string'));
    expect(
      DomainErrorTranslator.translate(
        new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(new InvariantError('harus mengirimkan id user'));
    expect(
      DomainErrorTranslator.translate(
        new Error('ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(new InvariantError('id user harus string'));
    expect(
      DomainErrorTranslator.translate(
        new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(new InvariantError('harus mengirimkan id thread'));
    expect(
      DomainErrorTranslator.translate(
        new Error('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(new InvariantError('id thread harus string'));
    expect(
      DomainErrorTranslator.translate(
        new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError('harus mengirimkan id thread dan id user')
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(new InvariantError('id thread dan id user harus string'));
    expect(
      DomainErrorTranslator.translate(
        new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError(
        'harus mengirimkan id thread, id komentar, dan id user'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(
      new InvariantError('id thread, id komentar, dan id user harus string')
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError(
        'harus mengirimkan id thread, id komentar, dan id user'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('ADD_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(
      new InvariantError('id thread, id komentar, dan id user harus string')
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError(
        'harus mengirimkan id komentar, id balasan, dan id user'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(
      new InvariantError('id komentar, id balasan, dan id user harus string')
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('TOGGLE_COMMENT_LIKE_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError(
        'harus mengirimkan id thread, id komentar, dan id user'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error(
          'TOGGLE_COMMENT_LIKE_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
        )
      )
    ).toStrictEqual(
      new InvariantError('id thread, id komentar, dan id user harus string')
    );
  });

  it('should return original error when error message is not needed to translate', () => {
    // Arrange
    const error = new Error('some_error_message');

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
