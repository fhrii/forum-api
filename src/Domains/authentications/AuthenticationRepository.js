class AuthenticationRepository {
  async addToken(_token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async checkAvailabilityToken(_token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteToken(_token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default AuthenticationRepository;
